// API endpoint to check if player has already participated
// Used for duplicate prevention during registration

import { checkPlayerParticipation } from '../lib/database.js'

export default async function handler(req, res) {
  // ✅ PUBLIC HOSTING READY - Enable CORS for all domains
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  console.log('🔍 Check participation API called:', { method: req.method, hasBody: !!req.body })

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('🔍 OPTIONS request - returning CORS headers')
    return res.status(200).end()
  }

  if (req.method === 'POST') {
    try {
      console.log('🔍 Processing POST request with body:', req.body)
      const { firstName, lastName, department } = req.body

      // ✅ VALIDATION for required fields
      if (!firstName || !lastName || !department) {
        console.log('❌ Validation failed - missing required fields')
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: firstName, lastName, department',
        })
      }

      console.log('✅ Validation passed - calling checkPlayerParticipation...')
      // ✅ TOURNAMENT INTEGRITY - Check participation status
      const result = await checkPlayerParticipation(
        firstName.trim(),
        lastName.trim(),
        department.trim()
      )

      console.log('✅ checkPlayerParticipation returned:', result)
      res.json({
        success: true,
        ...result,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('❌ Participation check error:', error)
      console.error('❌ Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })
      res.status(500).json({
        success: false,
        error: 'Failed to check participation status. Please try again.',
        errorDetails: process.env.NODE_ENV === 'development' ? error.message : undefined,
      })
    }
  } else {
    console.log(`❌ Method ${req.method} not allowed`)
    res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST to check participation.',
    })
  }
}
