'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { patchQuestionAsDone } from '@/lib/api'
import { trackEvent } from '@/lib/firebase'
import { Question } from '@/lib/types'

import { QuestionPreviewProps } from './helpers'

export const ButtonAction = ({
  question,
  user,
  onOpenChange,
  onRefetch,
}: Omit<QuestionPreviewProps, 'isOpen' | 'owner'>) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const { toast } = useToast()

  const markAsDone = async (question: Question) => {
    trackEvent('click mark as done')
    if (user) {
      try {
        setIsSubmitting(true)
        await patchQuestionAsDone(question.uuid, user)

        toast({
          title: 'Berhasil menandai pertanyaan',
          description: `Berhasil menandai pertanyaan sebagai sudah dijawab!`,
        })

        setIsSubmitting(false)
        onRefetch?.()
        setTimeout(() => {
          onOpenChange(false)
        }, 500)
      } catch (error) {
        setIsSubmitting(false)
        toast({
          title: 'Gagal menyimpan perubahan',
          description: `Gagal saat mencoba menandai pertanyaan sebagai sudah dijawab, coba sesaat lagi!`,
        })
      }
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <Button
        type="button"
        disabled={isSubmitting}
        onClick={() => {
          if (question) {
            markAsDone(question)
          }
        }}
      >
        Tandai sudah dijawab
      </Button>
    </div>
  )
}
