import { NextResponse } from 'next/server'

import { getQuestionsByUuid, simplifyResponseObject } from '@/lib/notion'
import type { Question } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { uuid: string } },
) {
  const uuid = params.uuid || ''
  try {
    const questionsInNotion = await getQuestionsByUuid(uuid)
    if (questionsInNotion.results.length === 0) {
      return NextResponse.json(
        { message: `Can not found any question ${uuid}`, data: null },
        { status: 400 },
      )
    }

    const results = questionsInNotion?.results || []
    // @ts-ignore
    const simpleResults: Question[] = []

    results.forEach((result) => {
      // @ts-ignore
      const properties = result.properties
      const simpleDataResponse = simplifyResponseObject<Question>(properties)

      // ONLY allow for public question data
      // @ts-ignore
      if (simpleDataResponse.public) {
        simpleResults.push(simpleDataResponse)
      }
    })

    // @ts-ignore
    return NextResponse.json({
      message: `Found ${simpleResults.length} questions for id ${uuid}`,
      data: simpleResults,
    })
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while get question by uuid' },
      { status: 500 },
    )
  }
}
