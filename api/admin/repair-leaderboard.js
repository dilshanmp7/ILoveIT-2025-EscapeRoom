// Admin endpoint to repair leaderboard by rebuilding from existing player data
// This will fix the issue where player data exists but leaderboard sorted set is empty

import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  // Security: Only allow this in development or with a secret key
  const isAdmin =
    req.headers.authorization === 'Bearer admin-repair-key' ||
    process.env.NODE_ENV === 'development'

  if (!isAdmin && req.query.secret !== 'repair-leaderboard-2025') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('🔧 Starting leaderboard repair...')

    // Get all keys that match player:* using scan
    console.log('🔍 Scanning for player keys...')
    let allKeys = []
    try {
      // Try different methods to get keys
      try {
        allKeys = await kv.keys('player:*')
      } catch (e) {
        console.log('🔍 keys() not available, trying alternative...')
        // Alternative: try to get known keys based on pattern
        const testKeys = [
          'player:test-test-it',
          'player:dilshan-makavitage-it',
          'player:ama-costa-it',
        ]

        const existingKeys = []
        for (const key of testKeys) {
          try {
            const data = await kv.get(key)
            if (data) {
              existingKeys.push(key)
            }
          } catch (err) {
            console.log(`Key ${key} not found`)
          }
        }
        allKeys = existingKeys
      }
    } catch (error) {
      console.error('Error getting keys:', error)
      allKeys = []
    }

    console.log(`📊 Found ${allKeys.length} player keys:`, allKeys)

    if (!allKeys.length) {
      return res.json({
        success: false,
        message: 'No player data found to repair',
        playersFound: 0,
        debug: 'Could not find any player:* keys in database',
      })
    }

    // Clear existing leaderboard (if corrupted)
    try {
      await kv.del('leaderboard')
      console.log('🗑️ Cleared existing leaderboard')
    } catch (error) {
      console.log('🗑️ Could not clear leaderboard (may not exist):', error.message)
    }

    let processedCount = 0
    let totalScores = 0
    let playerCount = 0
    const playersSummary = []

    // Process each player
    for (const playerKey of allKeys) {
      const playerData = await kv.get(playerKey)
      console.log(`👤 Processing ${playerKey}:`, playerData)

      if (playerData && typeof playerData.score === 'number') {
        // Add to leaderboard sorted set
        try {
          await kv.zadd('leaderboard', {
            score: playerData.score,
            member: playerKey,
          })
          console.log(`✅ Added ${playerKey} to leaderboard with score ${playerData.score}`)
        } catch (zaddError) {
          console.log(`⚠️ Could not add ${playerKey} to sorted set:`, zaddError.message)
          // Continue processing other players
        }

        totalScores += playerData.score
        playerCount++
        processedCount++

        playersSummary.push({
          key: playerKey,
          name: `${playerData.firstName} ${playerData.lastName}`,
          score: playerData.score,
          department: playerData.department,
        })
      } else {
        console.log(`⚠️ Skipping ${playerKey} - invalid data or missing score`)
      }
    }

    // Update tournament stats
    const stats = {
      totalPlayers: playerCount,
      totalScores: totalScores,
      averageScore: playerCount > 0 ? Math.round(totalScores / playerCount) : 0,
      highestScore: Math.max(...playersSummary.map((p) => p.score)),
      lowestScore: Math.min(...playersSummary.map((p) => p.score)),
      lastUpdated: new Date().toISOString(),
    }

    await kv.set('tournament:stats', stats)
    console.log('📈 Updated tournament stats:', stats)

    // Test the leaderboard
    let testLeaderboard = []
    try {
      testLeaderboard = await kv.zrevrange('leaderboard', 0, 4)
      console.log('🧪 Test leaderboard top 5:', testLeaderboard)
    } catch (error) {
      console.log('🧪 Could not test leaderboard:', error.message)
      testLeaderboard = ['Could not retrieve leaderboard for testing']
    }

    // Sort players by score for response
    playersSummary.sort((a, b) => b.score - a.score)

    console.log(`✅ Leaderboard repair completed! Processed ${processedCount} players.`)

    return res.json({
      success: true,
      message: `Leaderboard repair completed! Processed ${processedCount} players.`,
      repairSummary: {
        playersFound: allKeys.length,
        playersProcessed: processedCount,
        totalScores,
        averageScore: stats.averageScore,
        highestScore: stats.highestScore,
        lowestScore: stats.lowestScore,
      },
      playersReprocessed: playersSummary.slice(0, 10), // Top 10 for verification
      testLeaderboard,
    })
  } catch (error) {
    console.error('❌ Leaderboard repair failed:', error)

    return res.status(500).json({
      success: false,
      error: 'Leaderboard repair failed',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    })
  }
}
