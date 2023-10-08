import { Metadata } from 'next'
import { notFound } from 'next/navigation'

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
  const ownerData = getPublicOwnerUser(slug as string)
  const customOgData = getPublicCustomOg(slug as string)

  const [owner, customOg] = await Promise.all([ownerData, customOgData])

  const title = `Lempar pertanyaan anonim ke ${owner?.data?.name} lewat TanyaAja`
  const description = `Mulai bertanya anonim ke ${owner?.data?.name} melalui aplikasi TanyaAja. Mudah, gratis dan terjamin rahasia.`
  const url = `${BASEURL}/p/${owner?.data?.slug}`

  let ogImage = `${BASEURL}/api/og?type=user&slug=${owner?.data?.slug}`

  if (customOg && customOg?.data) {
    // -- mode simple
    ogImage = `${BASEURL}/api/og?type=custom-user&slug=${owner?.data?.slug}&theme=${customOg?.data?.theme}&text=${customOg?.data?.simple_text}`
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

          {owner && owner?.data ? <QuestionForm owner={owner?.data} /> : null}

          <LinkAds />
        </>
      ) : null}
    </main>
  )
}
