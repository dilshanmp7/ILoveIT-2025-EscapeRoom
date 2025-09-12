// API endpoint to mark game start and prevent cheating
// Records when a player starts the game to prevent re-registration

import { startPlayerGame } from '../lib/database.js'

export default async function handler(req, res) {
  // ✅ Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  console.log('🔍 Start game API called:', { method: req.method })

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'POST') {
    try {
      const { firstName, lastName, department, gameStartTime } = req.body

      // ✅ VALIDATION
      if (!firstName || !lastName || !department) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
        })
      }

      console.log('✅ Marking game start for player...')
      const result = await startPlayerGame(
        firstName.trim(),
        lastName.trim(),
        department.trim(),
        gameStartTime
      )

      res.json({
        success: true,
        ...result,
      })
    } catch (error) {
      console.error('❌ Start game error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to start game',
      })
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }
}
