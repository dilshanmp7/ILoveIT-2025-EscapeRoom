// Local API Server with Real Upstash Redis Database Connection
// This provides immediate API functionality with the actual tournament database

const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// ✅ REAL DATABASE CONNECTION - Upstash Redis KV
// Using REST API approach (no additional dependencies needed)
const UPSTASH_REST_URL = 'https://renewing-sailfish-13452.upstash.io'
const UPSTASH_TOKEN = 'ATSMAAIncDEzNTIxMzFmYmIxMGM0MjExOWYzYTY0YWE3NmQzNmIwZnAxMTM0NTI'

// Upstash REST API helper
async function upstashCommand(command) {
  try {
    const response = await fetch(UPSTASH_REST_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    return result.result
  } catch (error) {
    console.error('Upstash command error:', error)
    throw error
  }
}

// Generate unique player ID for duplicate prevention
function generatePlayerId(firstName, lastName, department) {
  return `${firstName.toLowerCase().trim()}-${lastName.toLowerCase().trim()}-${department
    .toLowerCase()
    .replace(/\s+/g, '-')}`
}

// Get player rank from sorted set
async function getPlayerRank(playerId) {
  try {
    const rank = await upstashCommand(['ZREVRANK', 'leaderboard', `player:${playerId}`])
    return rank !== null ? rank + 1 : null
  } catch (error) {
    console.error('Error getting player rank:', error)
    return null
  }
}

// Update tournament statistics
async function updateTournamentStats(score, isNewPlayer = true) {
  try {
    if (isNewPlayer) {
      await upstashCommand(['INCR', 'tournament:totalPlayers'])
    }
    await upstashCommand(['LPUSH', 'tournament:scores', score])

    // Update top score if needed
    const currentTop = await upstashCommand(['GET', 'tournament:topScore'])
    if (!currentTop || score > parseInt(currentTop)) {
      await upstashCommand(['SET', 'tournament:topScore', score])
    }
  } catch (error) {
    console.error('Error updating tournament stats:', error)
  }
}

// Get tournament statistics
async function getTournamentStats() {
  try {
    const totalPlayers = (await upstashCommand(['GET', 'tournament:totalPlayers'])) || 0
    const topScore = (await upstashCommand(['GET', 'tournament:topScore'])) || 0
    const allScores = (await upstashCommand(['LRANGE', 'tournament:scores', 0, -1])) || []

    let averageScore = 0
    if (allScores.length > 0) {
      const sum = allScores.reduce((acc, score) => acc + parseInt(score), 0)
      averageScore = Math.round(sum / allScores.length)
    }

    return {
      totalPlayers: parseInt(totalPlayers),
      topScore: parseInt(topScore),
      averageScore,
    }
  } catch (error) {
    console.error('Error getting tournament stats:', error)
    return { totalPlayers: 0, topScore: 0, averageScore: 0 }
  }
}

// ✅ CHECK PARTICIPATION ENDPOINT
app.post('/api/check-participation', async (req, res) => {
  try {
    const { firstName, lastName, department } = req.body

    if (!firstName || !lastName || !department) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: firstName, lastName, department',
      })
    }

    const playerId = generatePlayerId(firstName, lastName, department)
    const existingPlayer = await upstashCommand(['GET', `player:${playerId}`])

    if (existingPlayer) {
      const rank = await getPlayerRank(playerId)
      return res.json({
        success: true,
        hasParticipated: true,
        playerData: {
          ...JSON.parse(existingPlayer),
          rank,
        },
      })
    }

    res.json({
      success: true,
      hasParticipated: false,
    })
  } catch (error) {
    console.error('Check participation error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to check participation status',
    })
  }
})

// ✅ SUBMIT SCORE ENDPOINT
app.post('/api/submit-score', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      department,
      workTime,
      score,
      timeSpent,
      wrongAnswers,
      hintsUsed,
      completionTime,
    } = req.body

    // Validation
    if (!firstName || !lastName || !department || score === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: firstName, lastName, department, score',
      })
    }

    if (typeof score !== 'number' || score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        error: 'Score must be a number between 0 and 100',
      })
    }

    const playerId = generatePlayerId(firstName, lastName, department)
    const existingPlayer = await upstashCommand(['GET', `player:${playerId}`])

    // ✅ TOURNAMENT INTEGRITY - One participation only
    if (existingPlayer) {
      const existingData = JSON.parse(existingPlayer)
      const rank = await getPlayerRank(playerId)

      return res.json({
        success: false,
        message:
          'You have already participated in this tournament. Only one attempt is allowed per player.',
        previousScore: existingData.score,
        previousRank: rank,
        alreadyParticipated: true,
        participationDate: existingData.submittedAt,
      })
    }

    const newPlayerData = {
      playerId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      department: department.trim(),
      workTime: workTime?.trim(),
      score: Number(score),
      timeSpent: timeSpent?.trim(),
      wrongAnswers: Number(wrongAnswers || 0),
      hintsUsed: Number(hintsUsed || 0),
      completionTime: completionTime || new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      timestamp: Date.now(),
    }

    // Save player data
    await upstashCommand(['SET', `player:${playerId}`, JSON.stringify(newPlayerData)])

    // Add to sorted leaderboard (higher scores first)
    await upstashCommand(['ZADD', 'leaderboard', score, `player:${playerId}`])

    // Update tournament statistics
    await updateTournamentStats(score, true)

    const rank = await getPlayerRank(playerId)

    res.json({
      success: true,
      playerId,
      message: 'Score submitted successfully to tournament!',
      rank,
      timestamp: new Date().toISOString(),
    })

    console.log(
      `✅ New player added: ${firstName} ${lastName} (${department}) - Score: ${score}, Rank: #${rank}`
    )
  } catch (error) {
    console.error('Submit score error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to submit score. Please try again.',
    })
  }
})

// ✅ LEADERBOARD ENDPOINT
app.get('/api/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50

    // Get top players from sorted set (highest scores first)
    const topPlayerKeys = (await upstashCommand(['ZREVRANGE', 'leaderboard', 0, limit - 1])) || []

    if (topPlayerKeys.length === 0) {
      return res.json({
        success: true,
        leaderboard: [],
        totalPlayers: 0,
        topScore: 0,
        averageScore: 0,
        lastUpdated: new Date().toISOString(),
      })
    }

    // Get full player data
    const playersData = []
    for (const key of topPlayerKeys) {
      try {
        const playerData = await upstashCommand(['GET', key])
        if (playerData) {
          playersData.push(JSON.parse(playerData))
        }
      } catch (error) {
        console.error(`Error fetching player data for ${key}:`, error)
      }
    }

    // Add ranking
    const leaderboard = playersData.map((player, index) => ({
      ...player,
      rank: index + 1,
    }))

    const stats = await getTournamentStats()

    res.json({
      success: true,
      leaderboard,
      totalPlayers: stats.totalPlayers,
      topScore: leaderboard[0]?.score || 0,
      averageScore: stats.averageScore,
      lastUpdated: new Date().toISOString(),
    })

    console.log(`📊 Leaderboard fetched: ${leaderboard.length} players`)
  } catch (error) {
    console.error('Leaderboard fetch error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard data',
      leaderboard: [],
      totalPlayers: 0,
    })
  }
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Local Tournament API Server running on http://localhost:${PORT}`)
  console.log(`📡 Connected to Upstash Redis: ${UPSTASH_REST_URL}`)
  console.log('🏆 Ready to handle tournament data!')
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Local Tournament API Server...')
  process.exit(0)
})
