// API endpoint to update comprehensive game progress
// Prevents cheating by maintaining authoritative game state in database

import { updateGameProgress } from '../lib/database.js'

export default async function handler(req, res) {
  // ✅ Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  console.log('🔍 Update game progress API called:', { method: req.method })

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'POST') {
    try {
      const { firstName, lastName, department, ...progressData } = req.body

      // ✅ VALIDATION
      if (!firstName || !lastName || !department) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
        })
      }

      console.log('✅ Updating comprehensive game progress...', {
        player: `${firstName} ${lastName}`,
        department,
        progressKeys: Object.keys(progressData),
      })

      // Add detailed logging for debugging
      console.log('📊 Progress data being sent:', JSON.stringify(progressData, null, 2))

      const result = await updateGameProgress(
        firstName.trim(),
        lastName.trim(),
        department.trim(),
        progressData
      )

      console.log('✅ Update game progress successful:', result)

      res.json({
        success: true,
        ...result,
      })
    } catch (error) {
      console.error('❌ Update game progress error:', error)
      console.error('❌ Error stack:', error.stack)
      console.error('❌ Request body:', req.body)

      res.status(500).json({
        success: false,
        error: 'Failed to update game progress',
        errorMessage: error.message,
        errorDetails: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      })
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }
}
