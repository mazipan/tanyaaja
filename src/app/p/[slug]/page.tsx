import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Twitter } from 'lucide-react'

import { ProfileAvatar } from '@/components/ProfileAvatar'
import { BASEURL, getPublicCustomOg, getPublicOwnerUser } from '@/lib/api'
import { LinkAds } from '@/modules/PublicQuestionPage/LinkAds'
import { QuestionForm } from '@/modules/PublicQuestionPage/QuestionForm'

type PublicPageProps = {
  params: { slug: string }
}

export async function generateMetadata({
  params,
}: PublicPageProps): Promise<Metadata> {
  const slug = params.slug
  const owner = await getPublicOwnerUser(slug as string)
  const customOg = await getPublicCustomOg(slug as string)
  const ownerSlug = owner?.data?.slug
  const ownerName = owner?.data?.name

  const title = `Lempar pertanyaan anonim ke ${ownerName} lewat TanyaAja`
  const description = `Mulai bertanya anonim ke ${ownerName} melalui aplikasi TanyaAja. Mudah, gratis dan terjamin rahasia.`
  const url = `${BASEURL}/p/${ownerSlug}`

  let ogImage = ''

  if (customOg && customOg?.data) {
    if (customOg.data.code_public) {
      // -- mode advanced
      ogImage = `${BASEURL}/api/og?type=custom-user&slug=${ownerSlug}`
    } else if (customOg.data.simple_text) {
      // -- mode simple
      ogImage = `${BASEURL}/api/og?type=custom-user&slug=${ownerSlug}&name=${ownerName}&theme=${customOg?.data?.theme}&text=${customOg?.data?.simple_text}`
    }
  }

  if (!ogImage) {
    // Fallback if none of the custom OG is available
    ogImage = `${BASEURL}/api/og?type=user&slug=${ownerSlug}&name=${ownerName}`
  }

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    metadataBase: new URL(BASEURL),
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      siteName: 'TanyaAja.in',
      description,
      title,
      url: url,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: 'TanyaAja.in',
      description,
      title,
      creator: '@Maz_Ipan',
      images: [
        {
          url: ogImage,
        },
      ],
    },
  }
}

export default async function PublicPage({
  params: { slug },
}: PublicPageProps) {
  const ownerData = getPublicOwnerUser(slug as string)

  const [owner] = await Promise.all([ownerData])

  if (!owner?.data) {
    notFound()
  }

  return (
    <main className="flex flex-col gap-6 items-center py-16 px-4 md:px-8">
      {owner ? (
        <>
          <ProfileAvatar
            size="96"
            image={owner?.data?.image}
            name={owner?.data?.name}
          />

          <h1 className="text-3xl font-extrabold text-center">
            Tanya ke {owner?.data?.name}
          </h1>

          {owner?.data?.x_username && (
            <a
              className="flex items-center gap-1 underline"
              href={`https://x.com/${owner.data.x_username}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="h-4 w-4" />
              {owner.data.x_username}
            </a>
          )}

          {owner && owner?.data ? <QuestionForm owner={owner?.data} /> : null}

          <LinkAds />
        </>
      ) : null}
    </main>
  )
}
