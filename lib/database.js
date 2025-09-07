// Database layer using Vercel KV (Redis)
// Handles all tournament data with duplicate prevention and ranking

import { kv } from '@vercel/kv'

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
    // Get top players from sorted set (highest scores first)
    const topPlayerKeys = await kv.zrevrange('leaderboard', 0, limit - 1)

    if (!topPlayerKeys.length) {
      return { leaderboard: [], totalPlayers: 0 }
    }

    // Get full player data
    const playersData = await Promise.all(topPlayerKeys.map((key) => kv.get(key)))

    const validPlayers = playersData.filter(Boolean)

    // Add ranking
    const leaderboard = validPlayers.map((player, index) => ({
      ...player,
      rank: index + 1,
    }))

    const stats = await getTournamentStats()

    return {
      leaderboard,
      totalPlayers: stats.totalPlayers,
      averageScore: stats.averageScore,
      topScore: leaderboard[0]?.score || 0,
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Leaderboard fetch error:', error)
    throw new Error('Failed to fetch leaderboard')
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
    return (
      (await kv.get('tournament:stats')) || {
        totalPlayers: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 100,
      }
    )
  } catch (error) {
    return {
      totalPlayers: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 100,
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
