// Admin endpoint to repair leaderboard by rebuilding from existing player data
// This will fix the issue where player data exists but leaderboard sorted set is empty

import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  // Security: Only allow this in development or with a secret key
  const isAdmin = req.headers.authorization === 'Bearer admin-repair-key' || 
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

    // Get all keys that match player:*
    const allKeys = await kv.keys('player:*')
    console.log(`📊 Found ${allKeys.length} player keys:`, allKeys)

    if (!allKeys.length) {
      return res.json({
        success: false,
        message: 'No player data found to repair',
        playersFound: 0,
      })
    }

    // Clear existing leaderboard (if corrupted)
    await kv.del('leaderboard')
    console.log('🗑️ Cleared existing leaderboard')

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
        await kv.zadd('leaderboard', {
          score: playerData.score,
          member: playerKey,
        })

        totalScores += playerData.score
        playerCount++
        processedCount++

        playersSummary.push({
          key: playerKey,
          name: `${playerData.firstName} ${playerData.lastName}`,
          score: playerData.score,
          department: playerData.department,
        })

        console.log(`✅ Added ${playerKey} to leaderboard with score ${playerData.score}`)
      } else {
        console.log(`⚠️ Skipping ${playerKey} - invalid data or missing score`)
      }
    }

    // Update tournament stats
    const stats = {
      totalPlayers: playerCount,
      totalScores: totalScores,
      averageScore: playerCount > 0 ? Math.round(totalScores / playerCount) : 0,
      highestScore: Math.max(...playersSummary.map(p => p.score)),
      lowestScore: Math.min(...playersSummary.map(p => p.score)),
      lastUpdated: new Date().toISOString(),
    }

    await kv.set('tournament:stats', stats)
    console.log('📈 Updated tournament stats:', stats)

    // Test the leaderboard
    const testLeaderboard = await kv.zrevrange('leaderboard', 0, 4)
    console.log('🧪 Test leaderboard top 5:', testLeaderboard)

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
