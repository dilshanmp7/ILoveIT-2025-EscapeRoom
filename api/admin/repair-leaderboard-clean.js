// Admin endpoint to repair leaderboard by rebuilding from existing player data
// Completely dynamic - no hardcoded player IDs

import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  // Security: Only allow this with secret key
  if (req.query.secret !== 'repair-leaderboard-2025') {
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

    // Get all keys that match player:* dynamically
    console.log('🔍 Scanning for all player keys...')
    let allKeys = []
    try {
      allKeys = await kv.keys('player:*')
      console.log(`📊 Found ${allKeys.length} player keys:`, allKeys)
    } catch (error) {
      console.log('🔍 kv.keys() not available:', error.message)
      return res.status(500).json({
        success: false,
        error: 'Cannot scan for player keys',
        message: 'The kv.keys() method is not available to dynamically discover players',
        suggestion: 'Player data may exist but cannot be automatically discovered',
      })
    }

    if (!allKeys || allKeys.length === 0) {
      console.log('❌ No player keys found')
      return res.json({
        success: false,
        message: 'No player data found in database',
        playersFound: 0,
      })
    }

    // Clear existing leaderboard
    try {
      await kv.del('leaderboard')
      console.log('🗑️ Cleared existing leaderboard')
    } catch (error) {
      console.log('⚠️ Could not clear leaderboard:', error.message)
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
      console.log('⚠️ Could not test leaderboard:', error.message)
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
      playersReprocessed: playersSummary.slice(0, 10),
      testLeaderboard,
      allPlayerKeys: allKeys, // Show all discovered keys for verification
    })
  } catch (error) {
    console.error('❌ Leaderboard repair failed:', error)

    return res.status(500).json({
      success: false,
      error: 'Leaderboard repair failed',
      message: error.message,
    })
  }
}
