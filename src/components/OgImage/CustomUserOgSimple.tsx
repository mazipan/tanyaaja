import { BASEURL } from '@/lib/api'
import { GRADIENTS } from '@/lib/utils'

import { LogoSvg } from './LogoSvg'

export function CustomUserOgSimple({
  slug,
  theme,
  text,
}: {
  slug: string
  theme: string
  text: string
}) {
  return (
    <div
      tw={`flex p-8 flex-col w-full h-full items-center justify-between`}
      style={{
        backgroundImage: GRADIENTS.find((g) => g.id === theme)?.cssNative,
      }}
    >
      <div tw="flex font-bold text-2xl">
        {BASEURL.replace('https://www.', '')}/p/{slug}
      </div>
      <div tw="flex flex-col justify-center items-center text-center font-extrabold text-6xl tracking-tight w-full">
        <div tw="flex">{text}</div>
      </div>
      <div tw="flex mb-2 items-center justify-center mt-10 w-full">
        <LogoSvg />
      </div>
    </div>
  )
}
