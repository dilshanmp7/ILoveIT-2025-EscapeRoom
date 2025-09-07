// API endpoint to check if player has already participated
// Used for duplicate prevention during registration

import { checkPlayerParticipation } from '../lib/database.js'

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
      const { firstName, lastName, department } = req.body

      // ✅ VALIDATION for required fields
      if (!firstName || !lastName || !department) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: firstName, lastName, department',
        })
      }

      // ✅ TOURNAMENT INTEGRITY - Check participation status
      const result = await checkPlayerParticipation(
        firstName.trim(),
        lastName.trim(),
        department.trim()
      )

      res.json({
        success: true,
        ...result,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Participation check error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to check participation status. Please try again.',
      })
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST to check participation.',
    })
  }
}
