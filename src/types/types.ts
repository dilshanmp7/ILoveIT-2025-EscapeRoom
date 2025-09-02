export interface Question {
  id: string
  question: string
  options: { text: string; id: string }[]
  correctOptionId: string
}

export type LevelId = 'level1' | 'level2' | 'level3'

export type LevelStatus = 'locked' | 'unlocked' | 'solved'

export interface RoomLevel {
  id: LevelId
  title: string
  questions: Question[]
  hint: string
}

export interface RoomFinalPuzzle {
  title: string
  description: string
  solution: string
}

export interface Room {
  id: 'it-security' | 'it-services' | 'it-applications'
  name: string
  backgroundImage: string
  levels: Record<LevelId, RoomLevel>
  finalPuzzle: RoomFinalPuzzle
}
