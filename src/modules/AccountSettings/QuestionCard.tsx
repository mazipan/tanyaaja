import { useQueryClient } from '@tanstack/react-query'
import { CalendarDays, Lock, Unlock } from 'lucide-react'

import { CopyButton } from '@/components/CopyButton'
import { RedirectButton } from '@/components/RedirectButton'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Toggle } from '@/components/ui/toggle'
import { useToast } from '@/components/ui/use-toast'
import { BASEURL } from '@/lib/api'
import { trackEvent } from '@/lib/firebase'
import { Question, UserProfile } from '@/lib/types'

import { usePatchQuestionAsPublicOrPrivate } from './hooks/usePatchQuestionAsPublicOrPrivate'

interface QuestionPanelProps {
  question: Question | null
  owner: UserProfile | null | undefined
  onClick: (q: Question) => void
  index: number
}

export const QuestionPanel = ({
  question,
  onClick,
  index,
  owner,
}: QuestionPanelProps) => {
  const { toast } = useToast()

  const patchQuestionAsPublicOrPrivateMutation =
    usePatchQuestionAsPublicOrPrivate()

  const queryClient = useQueryClient()

  const handleTogglePrivacy = () => {
    trackEvent('click toggle public access')

    patchQuestionAsPublicOrPrivateMutation.mutate(question, {
      onSuccess: () => {
        // Find the question and update state
        queryClient.setQueryData<{ data: Question[] }>(
          ['/questions', owner?.uid],
          (oldData) => {
            const defaultData: { data: Question[] } = { data: [] }
            if (!oldData) return defaultData

            const updatedData = oldData?.data.map((questionItem) =>
              questionItem.uuid === question?.uuid
                ? { ...questionItem, public: !questionItem.public }
                : questionItem,
            )

            return { ...oldData, data: updatedData }
          },
        )
      },
      onError: () => {
        toast({
          title: 'Gagal menyimpan perubahan',
          description: `Gagal saat mencoba mengubah hak akses publik ke laman pertanyaan, coba sesaat lagi!`,
        })
      },
    })
  }

  return (
    <Card className="relative min-h-[200px] flex flex-col">
      {question ? (
        <>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle className="text-2xl">Pertanyaan #{index}</CardTitle>

              <Toggle
                defaultPressed={question?.public}
                pressed={question?.public}
                variant="outline"
                aria-label="Toggle italic"
                className="data-[state=on]:bg-success"
                onPressedChange={handleTogglePrivacy}
                disabled={patchQuestionAsPublicOrPrivateMutation.isLoading}
              >
                {question?.public ? (
                  <Unlock className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
              </Toggle>
            </div>

            <CardDescription className="flex gap-1 items-center">
              {question.public ? (
                <Unlock className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              <span className="text-sm">
                {question.public
                  ? 'Bisa diakses publik'
                  : 'Tidak bisa diakses public'}
              </span>
            </CardDescription>

            <CardDescription className="flex gap-1 items-center">
              <CalendarDays className="w-4 h-4" />
              {new Date(question.submitted_date).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1">
            <p className="">
              {question.question.length > 100
                ? `${question.question.substring(0, 300)}...`
                : question.question}
            </p>
          </CardContent>

          <CardFooter className="justify-end gap-2 flex-wrap">
            {question?.public ? (
              <>
                <RedirectButton
                  url={`${BASEURL}/p/${owner?.slug}/${question?.uuid}`}
                  external
                />
                <CopyButton
                  text={`${BASEURL}/p/${owner?.slug}/${question?.uuid}`}
                  withLabel
                />
              </>
            ) : null}

            <Button
              type="button"
              onClick={() => {
                onClick(question)
              }}
            >
              Selengkapnya
            </Button>
          </CardFooter>
        </>
      ) : null}
    </Card>
  )
}
