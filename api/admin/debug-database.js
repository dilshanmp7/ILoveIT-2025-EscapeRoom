// Debug endpoint to show all player data in the database
// Helps identify missing players and data issues

import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  // Security: Only allow this with secret key
  if (req.query.secret !== 'debug-db-2025') {
    return res.status(401).json({ error: 'Unauthorized - use ?secret=debug-db-2025' })
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed - use GET' })
  }

  try {
    console.log('🔍 Starting database debug scan...')

    // Get all player keys
    const allPlayerKeys = await kv.keys('player:*')
    console.log(`🔍 Found ${allPlayerKeys.length} player keys:`, allPlayerKeys)

    // Get all player data
    const allPlayers = []
    for (const key of allPlayerKeys) {
      try {
        const playerData = await kv.get(key)
        allPlayers.push({
          key,
          data: playerData,
          hasScore: playerData && typeof playerData.score === 'number',
          score: playerData?.score,
          name: playerData ? `${playerData.firstName} ${playerData.lastName}` : 'Unknown',
        })
      } catch (error) {
        allPlayers.push({
          key,
          error: error.message,
          hasScore: false,
        })
      }
    }

    // Check sorted set
    let sortedSetData = null
    let sortedSetError = null
    try {
      const sortedSetKeys = await kv.zrevrange('leaderboard', 0, -1)
      sortedSetData = {
        keys: sortedSetKeys,
        count: sortedSetKeys?.length || 0,
      }

      // Get scores for sorted set entries
      if (sortedSetKeys && sortedSetKeys.length > 0) {
        const scoresData = []
        for (const key of sortedSetKeys) {
          try {
            const score = await kv.zscore('leaderboard', key)
            scoresData.push({ key, score })
          } catch (error) {
            scoresData.push({ key, error: error.message })
          }
        }
        sortedSetData.scores = scoresData
      }
    } catch (error) {
      sortedSetError = error.message
    }

    // Get tournament stats
    let tournamentStats = null
    try {
      tournamentStats = await kv.get('tournament:stats')
    } catch (error) {
      tournamentStats = { error: error.message }
    }

    // Summary statistics
    const validPlayers = allPlayers.filter((p) => p.hasScore)
    const summary = {
      totalKeys: allPlayerKeys.length,
      validPlayers: validPlayers.length,
      invalidPlayers: allPlayers.length - validPlayers.length,
      scores: validPlayers.map((p) => ({ key: p.key, score: p.score, name: p.name })),
      sortedSetWorking: !sortedSetError,
    }

    console.log('✅ Database debug completed')

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary,
      rawData: {
        allPlayerKeys,
        allPlayers,
        sortedSet: sortedSetData,
        sortedSetError,
        tournamentStats,
      },
      recommendations:
        validPlayers.length === 0
          ? ['No valid player data found. Check if players have score property.']
          : validPlayers.length !== (sortedSetData?.count || 0)
          ? ['Player count mismatch with sorted set. Consider running repair.']
          : ['Database looks healthy!'],
    })
  } catch (error) {
    console.error('❌ Database debug failed:', error)

    return res.status(500).json({
      success: false,
      error: 'Database debug failed',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    })
  }
}
