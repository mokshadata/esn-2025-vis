function* getDaysOfYear(year) {
  let firstDay = new Date(year, 0, 1)

  let index = 1 - firstDay.getDay()

  while(firstDay.getDay() > 0) {
    firstDay.setDate(firstDay.getDate() - 1)
  }

  let lastDay = new Date(year, 11, 31)
  while(lastDay.getDay() < 6) {
    lastDay.setDate(lastDay.getDate() + 1)
  }
  lastDay.setDate(lastDay.getDate() + 1)

  let day = new Date(firstDay.valueOf())
  let monthOffsets = {}

  while(day < lastDay) {
    let dayInfo = {
      dateStr: day.toISOString().split('T')[0],
      dayOfWeek: day.getDay(),
      date: day.getDate(),
      month: day.getMonth() + 1,
      dayOfYear: index,
      year: day.getFullYear(),
    }

    dayInfo.yyyymm = `${dayInfo.year}-${(dayInfo.month + '').padStart(2, '0')}`

    if (dayInfo.date === 1 && !monthOffsets[dayInfo.yyyymm]) {
      monthOffsets[dayInfo.yyyymm] = dayInfo.dayOfWeek
    }

    dayInfo = {
      ...dayInfo,
      isWeekDay: dayInfo.dayOfWeek > 0 && dayInfo.dayOfWeek < 6,
      weekOfMonth: Math.floor((dayInfo.date + monthOffsets[dayInfo.yyyymm] - 1) / 7) || 0,
      weekOfYear: Math.floor((dayInfo.dayOfYear + monthOffsets[`${year}-01`] - 1) / 7) || 0,
      humanDateStr: `${(dayInfo.month + '').padStart(2, '0')}/${(dayInfo.date + '').padStart(2, '0')}/${year}`
    }
    yield dayInfo
    day.setDate(day.getDate() + 1)
    index ++
  }
}

function* getMonthsOfYear(year) {
  let firstDay = new Date(year, 0, 1)
  let lastDay = new Date(year, 11, 31)
  let day = new Date(firstDay.valueOf())

  while(day < lastDay) {
    let monthInfo = {
      month: day.getMonth() + 1,
      monthStartDay: day.getDay(),
    }
    day.setMonth(day.getMonth() + 1)
    day.setDate(day.getDate() - 1)

    monthInfo.yyyymm = `${year}-${(monthInfo.month + '').padStart(2, '0')}`
    monthInfo.monthEndDay = day.getDay()
    monthInfo.weeksLength = Math.ceil(day.getDate() / 7)

    yield {
      ...monthInfo,
      monthStartDayWeekdayIndex: [0, 6].includes(monthInfo.monthStartDay) && 1 || monthInfo.monthStartDay,
      monthEndDayWeekdayIndex: [0, 6].includes(monthInfo.monthEndDay) && 5 || monthInfo.monthEndDay,
    }
    day.setDate(day.getDate() + 1)
  }
}
