import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { archivePage, deleteQuestionsByUid, getUserByUid } from '@/lib/notion'

export async function DELETE() {
  // Get the User uid
  const headersInstance = headers()
  const uid = headersInstance.get('user-id') as string

  // Get the User record on Notion
  const [user] = (await getUserByUid(uid)).results

  if (!user) {
    return NextResponse.json(
      { message: 'User does not exist' },
      { status: 404 },
    )
  }

  // Archive Questions and User
  await Promise.allSettled([deleteQuestionsByUid(uid), archivePage(user.id)])

  return new Response(null, {
    status: 204,
  })
}
