// Quick local API server for tournament
// Run this alongside your Vite dev server for immediate API functionality

const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// Simple file-based storage for local tournament
const DATA_FILE = path.join(__dirname, 'tournament-data.json')

// Initialize data file if it doesn't exist
function initializeData() {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      players: [],
      leaderboard: [
        {
          rank: 1,
          firstName: 'Malinda',
          lastName: 'Lakmal',
          department: 'HR',
          score: 100,
          workTime: '10:30 AM',
          timeSpent: '02:30:15',
          timestamp: Date.now() - 3600000,
          playerId: 'malinda-lakmal-hr',
        },
        {
          rank: 2,
          firstName: 'Dilshan',
          lastName: 'Makavitage',
          department: 'IT',
          score: 100,
          workTime: '11:15 AM',
          timeSpent: '02:35:22',
          timestamp: Date.now() - 3000000,
          playerId: 'dilshan-makavitage-it',
        },
        {
          rank: 3,
          firstName: 'Kamal',
          lastName: 'Perera',
          department: 'IT',
          score: 90,
          workTime: '12:00 PM',
          timeSpent: '02:45:18',
          timestamp: Date.now() - 1800000,
          playerId: 'kamal-perera-it',
        },
      ],
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2))
  }
}

function getData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

function generatePlayerId(firstName, lastName, department) {
  return `${firstName.toLowerCase().trim()}-${lastName.toLowerCase().trim()}-${department
    .toLowerCase()
    .replace(/\s+/g, '-')}`
}

// API Routes

// Leaderboard endpoint
app.get('/api/leaderboard', (req, res) => {
  console.log('📊 Leaderboard requested')
  try {
    const data = getData()
    const sortedLeaderboard = data.leaderboard
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return a.timestamp - b.timestamp // Earlier completion wins ties
      })
      .map((player, index) => ({ ...player, rank: index + 1 }))

    res.json({
      success: true,
      leaderboard: sortedLeaderboard,
      totalPlayers: sortedLeaderboard.length,
      topScore: sortedLeaderboard[0]?.score || 0,
      averageScore:
        Math.round(
          sortedLeaderboard.reduce((sum, p) => sum + p.score, 0) / sortedLeaderboard.length
        ) || 0,
    })
  } catch (error) {
    console.error('Leaderboard error:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' })
  }
})

// Submit score endpoint
app.post('/api/submit-score', (req, res) => {
  console.log('🏆 Score submission:', req.body)
  try {
    const { firstName, lastName, department, score, workTime, timeSpent, wrongAnswers, hintsUsed } =
      req.body

    if (!firstName || !lastName || !department || score === undefined) {
      return res.status(400).json({ success: false, error: 'Missing required fields' })
    }

    const data = getData()
    const playerId = generatePlayerId(firstName, lastName, department)

    // Check if player already exists
    const existingIndex = data.leaderboard.findIndex((p) => p.playerId === playerId)

    if (existingIndex !== -1) {
      return res.json({
        success: false,
        message:
          'You have already participated in this tournament. Only one attempt is allowed per player.',
        alreadyParticipated: true,
        previousScore: data.leaderboard[existingIndex].score,
      })
    }

    // Add new player
    const newPlayer = {
      playerId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      department: department.trim(),
      score: Number(score),
      workTime: workTime?.trim() || '',
      timeSpent: timeSpent?.trim() || '',
      wrongAnswers: Number(wrongAnswers || 0),
      hintsUsed: Number(hintsUsed || 0),
      timestamp: Date.now(),
      submittedAt: new Date().toISOString(),
    }

    data.leaderboard.push(newPlayer)

    // Sort and assign ranks
    data.leaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.timestamp - b.timestamp
    })

    const rank = data.leaderboard.findIndex((p) => p.playerId === playerId) + 1

    saveData(data)

    console.log(`✅ Score saved! Player: ${firstName} ${lastName}, Score: ${score}, Rank: ${rank}`)

    res.json({
      success: true,
      message: 'Score submitted successfully!',
      rank,
      playerId,
    })
  } catch (error) {
    console.error('Submit score error:', error)
    res.status(500).json({ success: false, error: 'Failed to submit score' })
  }
})

// Check participation endpoint
app.post('/api/check-participation', (req, res) => {
  console.log('🔍 Participation check:', req.body)
  try {
    const { firstName, lastName, department } = req.body

    if (!firstName || !lastName || !department) {
      return res.status(400).json({ success: false, error: 'Missing required fields' })
    }

    const data = getData()
    const playerId = generatePlayerId(firstName, lastName, department)
    const existingPlayer = data.leaderboard.find((p) => p.playerId === playerId)

    if (existingPlayer) {
      const rank =
        data.leaderboard
          .sort((a, b) => b.score - a.score || a.timestamp - b.timestamp)
          .findIndex((p) => p.playerId === playerId) + 1

      res.json({
        success: true,
        hasParticipated: true,
        playerData: { ...existingPlayer, rank },
      })
    } else {
      res.json({
        success: true,
        hasParticipated: false,
      })
    }
  } catch (error) {
    console.error('Participation check error:', error)
    res.status(500).json({ success: false, error: 'Failed to check participation' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Local tournament API is running',
    timestamp: new Date().toISOString(),
  })
})

// Initialize data and start server
initializeData()

app.listen(PORT, () => {
  console.log(`🚀 Local Tournament API Server running on http://localhost:${PORT}`)
  console.log(`📊 Tournament data stored in: ${DATA_FILE}`)
  console.log(`🏆 Ready to handle tournament submissions!`)
})
