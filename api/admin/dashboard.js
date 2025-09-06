// Admin API endpoint for complete tournament dashboard
// Provides comprehensive analytics and all participant data

import { getAllPlayersForAdmin } from '../../lib/database.js'

export default async function handler(req, res) {
  // ✅ ADMIN DASHBOARD - Secure access
  const { password } = req.query

  if (password !== 'DHL2025Admin!') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized access. Admin password required.',
    })
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    try {
      // ✅ SCALABLE - Get all tournament data with analytics
      const tournamentData = await getAllPlayersForAdmin()

      const response = {
        success: true,
        tournament: {
          name: 'DHL IT Lockdown Championship',
          ...tournamentData,
          data_export: {
            csv_ready: true,
            excel_ready: true,
            total_records: tournamentData.players.length,
          },
        },
        admin_tools: {
          winner_announcement_ready: tournamentData.players.length >= 3,
          data_backup_status: 'Current',
          analytics_ready: true,
        },
        generated_at: new Date().toISOString(),
      }

      // Add CSV export capability
      if (req.query.format === 'csv') {
        const csvData = generateCSV(tournamentData.players)
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', 'attachment; filename="tournament-results.csv"')
        return res.send(csvData)
      }

      res.json(response)
    } catch (error) {
      console.error('Admin dashboard error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch tournament data',
        players: [],
        statistics: {},
      })
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET to fetch tournament data.',
    })
  }
}

// Helper: Generate CSV for easy winner analysis
function generateCSV(players) {
  const headers =
    'Rank,First Name,Last Name,Department,Work Time,Score,Time Spent,Wrong Answers,Hints Used,Submitted At'

  const rows = players
    .map(
      (player) =>
        `${player.rank},"${player.firstName}","${player.lastName}","${player.department}","${player.workTime}",${player.score},"${player.timeTaken}",${player.wrongAnswers},${player.hintsUsed},"${player.submittedAt}"`
    )
    .join('\n')

  return headers + '\n' + rows
}
