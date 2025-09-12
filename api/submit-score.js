// API endpoint for score submission
// Handles centralized data collection with duplicate prevention

import { savePlayerScore } from '../lib/database.js'

// Helper function to get Copenhagen local time
const getCopenhagenTime = () => {
  return (
    new Date()
      .toLocaleString('sv-SE', {
        timeZone: 'Europe/Copenhagen',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      .replace(' ', 'T') + '+02:00'
  ) // Adding timezone offset for CEST
}

export default async function handler(req, res) {
  // ✅ PUBLIC HOSTING READY - Enable CORS for all domains
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  console.log('🔍 Submit score API called:', { method: req.method, hasBody: !!req.body })

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('🔍 OPTIONS request - returning CORS headers')
    return res.status(200).end()
  }

  if (req.method === 'POST') {
    try {
      console.log('🔍 Processing POST request with body:', req.body)
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
        console.log('❌ Validation failed - missing required fields')
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: firstName, lastName, department, score',
        })
      }

      if (typeof score !== 'number' || score < 0 || score > 100) {
        console.log('❌ Validation failed - invalid score:', score)
        return res.status(400).json({
          success: false,
          error: 'Score must be a number between 0 and 100',
        })
      }

      console.log('✅ Validation passed - calling savePlayerScore...')
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

      console.log('✅ savePlayerScore returned:', result)
      // Return success with rank information
      res.json({
        ...result,
        timestamp: getCopenhagenTime(),
      })
    } catch (error) {
      console.error('❌ Score submission error:', error)
      console.error('❌ Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })
      res.status(500).json({
        success: false,
        error: 'Failed to submit score. Please try again.',
        errorDetails: process.env.NODE_ENV === 'development' ? error.message : undefined,
      })
    }
  } else {
    console.log(`❌ Method ${req.method} not allowed`)
    res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST to submit scores.',
    })
  }
}
