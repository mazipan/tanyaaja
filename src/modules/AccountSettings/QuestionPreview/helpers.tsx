import type { User } from 'firebase/auth'

import type { Question, UserProfile } from '@/lib/types'

export interface QuestionPreviewProps {
  question: Question | null
  user: User | null
  owner: UserProfile | null | undefined
  onOpenChange: (open: boolean) => void
  isOpen: boolean
}
