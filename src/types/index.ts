export interface Question {
  id: string
  question: string
  options: { text: string; id: string }[]
  correctOptionId: string
}

export interface QuestionPools {
  easy: Question[]
  medium: Question[]
  complex: Question[]
}

export type LevelId = 'level1' | 'level2' | 'level3'

export type LevelStatus = 'locked' | 'unlocked' | 'solved'

export interface HintOption {
  text: string
}

export interface RoomLevel {
  id: LevelId
  title: string
  hintOptions: Record<string, HintOption[]>
  questions?: Question[]
  questionPools?: QuestionPools
}

export interface RoomFinalPuzzle {
  title: string
  description: string
  solutions: string[]
}

export interface Room {
  id: 'it-security' | 'it-services' | 'it-applications'
  name: string
  backgroundImage: string
  levels: Record<LevelId, RoomLevel>
  finalPuzzle: RoomFinalPuzzle
}
