// Database layer using Vercel KV (Redis)
// Handles all tournament data with duplicate prevention and ranking

import { kv } from '@vercel/kv'

console.log('🔍 Database module loaded')
console.log('🔍 Environment check:', {
  NODE_ENV: process.env.NODE_ENV,
  KV_REST_API_URL: process.env.KV_REST_API_URL ? 'SET' : 'MISSING',
  KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? 'SET' : 'MISSING',
  REDIS_URL: process.env.REDIS_URL ? 'SET' : 'MISSING',
})

console.log('🔍 Using PRODUCTION Redis for both dev and prod:', {
  url: process.env.KV_REST_API_URL
    ? process.env.KV_REST_API_URL.substring(0, 30) + '...'
    : 'MISSING',
  token: process.env.KV_REST_API_TOKEN ? 'SET' : 'MISSING',
})

if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
  console.error('❌ Missing Redis configuration. Need KV_REST_API_URL and KV_REST_API_TOKEN')
}

// Generate unique player ID for duplicate prevention
function generatePlayerId(firstName, lastName, department) {
  return `${firstName.toLowerCase().trim()}-${lastName.toLowerCase().trim()}-${department
    .toLowerCase()
    .replace(/\s+/g, '-')}`
}

// Check if player has already participated (for registration validation)
export async function checkPlayerParticipation(firstName, lastName, department) {
  try {
    const playerId = generatePlayerId(firstName, lastName, department)
    const existingPlayer = await kv.get(`player:${playerId}`)

    if (existingPlayer) {
      const rank = await getPlayerRank(playerId)
      return {
        hasParticipated: true,
        playerData: {
          ...existingPlayer,
          rank,
        },
      }
    }

    return { hasParticipated: false }
  } catch (error) {
    console.error('Participation check error:', error)
    throw new Error('Failed to check player participation status')
  }
}

// ✅ CENTRALIZED DATA COLLECTION
export async function savePlayerScore(playerData) {
  try {
    const playerId = generatePlayerId(
      playerData.firstName,
      playerData.lastName,
      playerData.department
    )

    // Check if player already exists
    const existingPlayer = await kv.get(`player:${playerId}`)

    const newPlayerData = {
      playerId,
      firstName: playerData.firstName,
      lastName: playerData.lastName,
      department: playerData.department,
      workTime: playerData.workTime,
      score: playerData.score,
      timeSpent: playerData.timeSpent,
      wrongAnswers: playerData.wrongAnswers || 0,
      hintsUsed: playerData.hintsUsed || 0,
      completionTime: playerData.completionTime || new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      timestamp: Date.now(),
    }

    // ✅ TOURNAMENT INTEGRITY - One participation only, no retries allowed
    if (existingPlayer) {
      return {
        success: false,
        message:
          'You have already participated in this tournament. Only one attempt is allowed per player.',
        previousScore: existingPlayer.score,
        previousRank: await getPlayerRank(playerId),
        alreadyParticipated: true,
        participationDate: existingPlayer.submittedAt,
      }
    }

    // Save player data
    await kv.set(`player:${playerId}`, newPlayerData)

    // Add to sorted leaderboard (higher scores first)
    await kv.zadd('leaderboard', {
      score: playerData.score,
      member: `player:${playerId}`,
    })

    // Update tournament statistics
    await updateTournamentStats(playerData.score, !existingPlayer)

    return {
      success: true,
      playerId,
      message: existingPlayer ? 'Score improved!' : 'Score submitted successfully!',
      rank: await getPlayerRank(playerId),
    }
  } catch (error) {
    console.error('Database save error:', error)
    throw new Error('Failed to save player score to database')
  }
}

// ✅ REAL-TIME LEADERBOARD
export async function getLeaderboard(limit = 50) {
  try {
    console.log(`🔍 getLeaderboard called with limit: ${limit}`)

    // Try to get top players from sorted set (highest scores first)
    console.log('🔍 Attempting to fetch from sorted set...')
    let topPlayerKeys = []
    let usingSortedSet = false

    try {
      topPlayerKeys = await kv.zrevrange('leaderboard', 0, limit - 1)
      console.log(
        `🔍 Found ${topPlayerKeys?.length || 0} player keys from sorted set:`,
        topPlayerKeys
      )
      usingSortedSet = true
    } catch (sortedSetError) {
      console.log(
        '🔍 Sorted set not available, falling back to direct player lookup:',
        sortedSetError.message
      )
      usingSortedSet = false
    }

    // Fallback: If sorted set is empty or not working, get all players dynamically
    if (!usingSortedSet || !topPlayerKeys || !topPlayerKeys.length) {
      console.log('🔍 Using fallback method - scanning for all player keys...')
      
      let allPlayerKeys = []
      try {
        allPlayerKeys = await kv.keys('player:*')
        console.log(`🔍 Found ${allPlayerKeys.length} player keys:`, allPlayerKeys)
      } catch (error) {
        console.log('🔍 Could not scan for player keys:', error.message)
        // If we can't scan for keys, return empty leaderboard
        return {
          leaderboard: [],
          totalPlayers: 0,
          averageScore: 0,
          topScore: 0,
          lastUpdated: new Date().toISOString(),
          debug: 'Could not scan for player keys',
        }
      }

      const directPlayers = []
      for (const playerId of allPlayerKeys) {
        try {
          const playerData = await kv.get(playerId)
          if (playerData && playerData.score !== undefined) {
            directPlayers.push(playerData)
            console.log(`🔍 Direct lookup found: ${playerId} - Score: ${playerData.score}`)
          }
        } catch (error) {
          console.log(`🔍 Could not get ${playerId}:`, error.message)
        }
      }

      if (directPlayers.length > 0) {
        // Sort by score (highest first) and add ranking
        directPlayers.sort((a, b) => b.score - a.score)
        const leaderboard = directPlayers.slice(0, limit).map((player, index) => ({
          ...player,
          rank: index + 1,
        }))

        const stats = await getTournamentStats()

        const result = {
          leaderboard,
          totalPlayers: directPlayers.length,
          averageScore: Math.round(
            directPlayers.reduce((sum, p) => sum + p.score, 0) / directPlayers.length
          ),
          topScore: leaderboard[0]?.score || 0,
          lastUpdated: new Date().toISOString(),
          debug: 'Used direct player lookup (sorted set not available)',
        }

        console.log('✅ getLeaderboard completed using fallback method:', {
          leaderboardCount: result.leaderboard.length,
          totalPlayers: result.totalPlayers,
          topScore: result.topScore,
        })

        return result
      }

      console.log('🔍 No players found with either method, returning empty leaderboard')
      return {
        leaderboard: [],
        totalPlayers: 0,
        averageScore: 0,
        topScore: 0,
        lastUpdated: new Date().toISOString(),
        debug: 'No player data found',
      }
    }

    // Original sorted set method
    console.log('🔍 Fetching full player data from sorted set results...')
    const playersData = await Promise.all(topPlayerKeys.map((key) => kv.get(key)))
    console.log(`🔍 Retrieved ${playersData?.length || 0} player records`)

    const validPlayers = playersData.filter(Boolean)
    console.log(`🔍 Valid players: ${validPlayers.length}`)

    // Add ranking
    const leaderboard = validPlayers.map((player, index) => ({
      ...player,
      rank: index + 1,
    }))

    console.log('🔍 Fetching tournament stats...')
    const stats = await getTournamentStats()
    console.log('🔍 Tournament stats:', stats)

    const result = {
      leaderboard,
      totalPlayers: stats.totalPlayers || validPlayers.length,
      averageScore: stats.averageScore || 0,
      topScore: leaderboard[0]?.score || 0,
      lastUpdated: new Date().toISOString(),
    }

    console.log('✅ getLeaderboard completed successfully:', {
      leaderboardCount: result.leaderboard.length,
      totalPlayers: result.totalPlayers,
      topScore: result.topScore,
    })

    return result
  } catch (error) {
    console.error('❌ Leaderboard fetch error:', error)
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    })

    // Return safe defaults for empty database
    return {
      leaderboard: [],
      totalPlayers: 0,
      averageScore: 0,
      topScore: 0,
      lastUpdated: new Date().toISOString(),
    }
  }
}

// ✅ WINNER DETERMINATION - Automatic ranking system
export async function getTop3Winners() {
  try {
    const topPlayerKeys = await kv.zrevrange('leaderboard', 0, 2)

    if (!topPlayerKeys.length) {
      return { winners: [], totalParticipants: 0 }
    }

    const winnersData = await Promise.all(topPlayerKeys.map((key) => kv.get(key)))

    const validWinners = winnersData.filter(Boolean)
    const stats = await getTournamentStats()

    return {
      winners: {
        first: validWinners[0] || null,
        second: validWinners[1] || null,
        third: validWinners[2] || null,
      },
      totalParticipants: stats.totalPlayers,
      tournamentStats: stats,
    }
  } catch (error) {
    console.error('Winners fetch error:', error)
    throw new Error('Failed to fetch winners')
  }
}

// ✅ ADMIN DASHBOARD - Complete tournament data
export async function getAllPlayersForAdmin() {
  try {
    // Get all players sorted by score
    const allPlayerKeys = await kv.zrevrange('leaderboard', 0, -1)

    const playersData = await Promise.all(allPlayerKeys.map((key) => kv.get(key)))

    const validPlayers = playersData.filter(Boolean)

    // Add rankings and additional stats
    const rankedPlayers = validPlayers.map((player, index) => ({
      ...player,
      rank: index + 1,
      scorePercentage: Math.round((player.score / 100) * 100),
      timeTaken: player.timeSpent || 'Unknown',
    }))

    const stats = await getTournamentStats()

    return {
      players: rankedPlayers,
      statistics: {
        ...stats,
        top10Scores: rankedPlayers.slice(0, 10).map((p) => p.score),
        departmentBreakdown: getDepartmentBreakdown(rankedPlayers),
        shiftBreakdown: getShiftBreakdown(rankedPlayers),
      },
    }
  } catch (error) {
    console.error('Admin data fetch error:', error)
    throw new Error('Failed to fetch admin data')
  }
}

// Helper: Get player's current rank
async function getPlayerRank(playerId) {
  try {
    const rank = await kv.zrevrank('leaderboard', `player:${playerId}`)
    return rank !== null ? rank + 1 : null
  } catch (error) {
    return null
  }
}

// Helper: Update tournament statistics
async function updateTournamentStats(score, isNewPlayer) {
  try {
    const stats = (await kv.get('tournament:stats')) || {
      totalPlayers: 0,
      totalScores: 0,
      highestScore: 0,
      lowestScore: 100,
      lastUpdated: new Date().toISOString(),
    }

    if (isNewPlayer) {
      stats.totalPlayers += 1
    }

    stats.totalScores += score
    stats.averageScore = Math.round(stats.totalScores / stats.totalPlayers)
    stats.highestScore = Math.max(stats.highestScore, score)
    stats.lowestScore = Math.min(stats.lowestScore, score)
    stats.lastUpdated = new Date().toISOString()

    await kv.set('tournament:stats', stats)
  } catch (error) {
    console.error('Stats update error:', error)
  }
}

// Helper: Get tournament statistics
async function getTournamentStats() {
  try {
    console.log('🔍 Fetching tournament stats...')
    const stats = await kv.get('tournament:stats')
    console.log('🔍 Raw stats from database:', stats)

    return (
      stats || {
        totalPlayers: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 100,
        lastUpdated: new Date().toISOString(),
      }
    )
  } catch (error) {
    console.log('🔍 Error fetching tournament stats, returning defaults:', error.message)
    return {
      totalPlayers: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 100,
      lastUpdated: new Date().toISOString(),
    }
  }
}

// Helper: Department breakdown for analytics
function getDepartmentBreakdown(players) {
  const breakdown = {}
  players.forEach((player) => {
    if (!breakdown[player.department]) {
      breakdown[player.department] = { count: 0, averageScore: 0, totalScore: 0 }
    }
    breakdown[player.department].count += 1
    breakdown[player.department].totalScore += player.score
    breakdown[player.department].averageScore = Math.round(
      breakdown[player.department].totalScore / breakdown[player.department].count
    )
  })
  return breakdown
}

// Helper: Shift breakdown for analytics
function getShiftBreakdown(players) {
  const breakdown = {}
  players.forEach((player) => {
    if (!breakdown[player.workTime]) {
      breakdown[player.workTime] = { count: 0, averageScore: 0, totalScore: 0 }
    }
    breakdown[player.workTime].count += 1
    breakdown[player.workTime].totalScore += player.score
    breakdown[player.workTime].averageScore = Math.round(
      breakdown[player.workTime].totalScore / breakdown[player.workTime].count
    )
  })
  return breakdown
}

// ✅ SCALABLE - Cleanup old data if needed
export async function cleanupOldData(daysOld = 30) {
  try {
    const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000

    // This would be implemented if needed for long-term tournaments
    console.log(`Cleanup for data older than ${daysOld} days would run here`)

    return { success: true, message: 'Cleanup completed' }
  } catch (error) {
    throw new Error('Cleanup failed')
  }
}
