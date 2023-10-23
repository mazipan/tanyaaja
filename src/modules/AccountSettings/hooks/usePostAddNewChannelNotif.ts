import { useMutation } from '@tanstack/react-query'
import { User } from 'firebase/auth'

import { toast } from '@/components/ui/use-toast'
import { postAddNewChannelNotif } from '@/lib/api'
import { CreateNotifChannelArgs } from '@/lib/types'

export const usePostAddNewChannelNotif = () => {
  return useMutation({
    mutationFn: (body: { user: User; param: CreateNotifChannelArgs }) =>
      postAddNewChannelNotif(body.user, body.param),
    onSuccess: () => {
      toast({
        title: 'Perubahan berhasil disimpan',
        description: `Berhasil menyimpan perubahan notifikasi ke Telegram!`,
      })
    },
    onError: () => {
      toast({
        title: 'Gagal menyimpan',
        description: `Gagal saat mencoba menyimpan data, silahkan coba beberapa saat lagi!`,
      })
    },
  })
}
