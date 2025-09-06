// API endpoint for score submission
// Handles centralized data collection with duplicate prevention

import { savePlayerScore } from '../lib/database.js'

export default async function handler(req, res) {
  // ✅ PUBLIC HOSTING READY - Enable CORS for all domains
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'POST') {
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

      // ✅ VALIDATION for data integrity
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

      // ✅ CENTRALIZED DATA COLLECTION + DUPLICATE PREVENTION
      const result = await savePlayerScore({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        department: department.trim(),
        workTime: workTime?.trim(),
        score: Number(score),
        timeSpent: timeSpent?.trim(),
        wrongAnswers: Number(wrongAnswers || 0),
        hintsUsed: Number(hintsUsed || 0),
        completionTime: completionTime || new Date().toISOString(),
      })

      // Return success with rank information
      res.json({
        ...result,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Score submission error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to submit score. Please try again.',
      })
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST to submit scores.',
    })
  }
}
