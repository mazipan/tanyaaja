import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { verifyIdToken } from '@/lib/firebase-admin'
import { addUser, getUserByUid, incrementStatisticUser } from '@/lib/notion'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const res = await request.json()
  const headersInstance = headers()
  const token = headersInstance.get('Authorization')

  try {
    let shouldAddUser = true
    if (token) {
      const decodedToken = await verifyIdToken(token)

      const userInNotion = await getUserByUid(decodedToken?.uid)

      shouldAddUser = userInNotion.results.length === 0
    }

    if (shouldAddUser) {
      setTimeout(async () => {
        try {
          await incrementStatisticUser()
        } catch (error) {
          console.error('Error while incrementing statistic user', error)
        }
      }, 0)
      await addUser(res)
      return NextResponse.json({ message: 'New user added', isNewUser: true })
    }

    return NextResponse.json(
      { message: 'User is already exist' },
      { status: 400 },
    )
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while adding user' },
      { status: 500 },
    )
  }
}
