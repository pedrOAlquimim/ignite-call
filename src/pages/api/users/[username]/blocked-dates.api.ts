import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  const { year, month } = req.query

  if (!year || !month) {
    return res.status(400).json({ message: 'Year or month not specified.' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) res.status(400).json({ message: 'User does not exist.' })

  const availableWeekDays = await prisma.userTimeIntervals.findMany({
    select: {
      week_day: true,
    },
    where: {
      user_id: user?.id,
    },
  })

  const blockedWeekDays = Array.from({ length: 7 })
    .map((_, i) => {
      return i
    })
    .filter((weekDay) => {
      return !availableWeekDays.some((days) => {
        return days.week_day === weekDay
      })
    })

  return res.json({ blockedWeekDays })
}
