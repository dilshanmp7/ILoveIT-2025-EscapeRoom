// Fix leaderboard by rebuilding from existing player data
// Run this to repair the leaderboard sorted set

import { kv } from '@vercel/kv'

async function fixLeaderboard() {
  try {
    console.log('🔧 Starting leaderboard repair...')

    // Get all keys that match player:*
    const allKeys = await kv.keys('player:*')
    console.log(`📊 Found ${allKeys.length} player keys:`, allKeys)

    if (!allKeys.length) {
      console.log('❌ No player data found!')
      return
    }

    // Clear existing leaderboard (if corrupted)
    await kv.del('leaderboard')
    console.log('🗑️ Cleared existing leaderboard')

    let processedCount = 0
    let totalScores = 0
    let playerCount = 0

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
      highestScore: 0, // Will be calculated when leaderboard is fetched
      lowestScore: 100,
      lastUpdated: new Date().toISOString(),
    }

    await kv.set('tournament:stats', stats)
    console.log('📈 Updated tournament stats:', stats)

    // Test the leaderboard
    const testLeaderboard = await kv.zrevrange('leaderboard', 0, 4)
    console.log('🧪 Test leaderboard top 5:', testLeaderboard)

    // Get scores for verification
    for (const key of testLeaderboard) {
      const score = await kv.zscore('leaderboard', key)
      const playerData = await kv.get(key)
      console.log(`🔍 ${key}: score=${score}, name=${playerData?.firstName} ${playerData?.lastName}`)
    }

    console.log(`✅ Leaderboard repair completed! Processed ${processedCount} players.`)

  } catch (error) {
    console.error('❌ Leaderboard repair failed:', error)
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    })
  }
}

// Run the fix
fixLeaderboard()
