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

      const result = await updateGameProgress(
        firstName.trim(),
        lastName.trim(),
        department.trim(),
        progressData
      )

      res.json({
        success: true,
        ...result,
      })
    } catch (error) {
      console.error('❌ Update game progress error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to update game progress',
      })
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }
}
