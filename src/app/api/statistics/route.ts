import { NextResponse } from 'next/server'

import { countDatabaseRows } from '@/lib/notion'

const DB_USER = process.env.NOTION_DB_USERS_ID || ''

export async function GET(request: Request) {
  try {
    const usersCount = await countDatabaseRows({ databaseId: DB_USER })

    return NextResponse.json({
      message: `Public statistics`,
      data: {
        usersCount,
      },
    })
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while get public statistics' },
      { status: 500 },
    )
  }
}
