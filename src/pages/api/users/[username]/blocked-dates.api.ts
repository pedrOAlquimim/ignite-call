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

  const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`
    SELECT 
      EXTRACT(DAY FROM S.date) AS date,
      COUNT(S.date) AS scheduledTimes,
      ((UTI.end_time_in_minutes - UTI.start_time_in_minutes) / 60) AS size

    FROM schedulings S

    LEFT JOIN user_time_intervals UTI
      ON UTI.week_day = WEEKDAY(DATE_ADD(S.date, INTERVAL 1 DAY))

    WHERE S.user_id = ${user?.id}
      AND DATE_FORMAT(S.date, "%Y-%m") = ${`${year}-${month}`}

    GROUP BY EXTRACT(DAY FROM S.date),
    ((UTI.end_time_in_minutes - UTI.start_time_in_minutes) / 60)

    HAVING scheduledTimes >= size
  `

  const blockedDates = blockedDatesRaw.map((item) => {
    return item.date
  })

  return res.json({ blockedWeekDays, blockedDates })
}
