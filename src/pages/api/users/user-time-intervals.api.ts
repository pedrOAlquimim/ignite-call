import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth].api'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const timeIntervalsFormSchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTimeInMinutes: z.number(),
      endTimeInMinutes: z.number(),
    }),
  ),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const session = await getServerSession(req, res, authOptions(req, res))

  if (!session) {
    return res.status(401).end()
  }

  const { intervals } = timeIntervalsFormSchema.parse(req.body)

  await Promise.all(
    intervals.map((interval) => {
      return prisma.userTimeIntervals.create({
        data: {
          week_day: interval.weekDay,
          start_time_in_minutes: interval.startTimeInMinutes,
          end_time_in_minutes: interval.endTimeInMinutes,
          user_id: session.user?.id,
        },
      })
    }),
  )

  return res.status(201).end()
}
