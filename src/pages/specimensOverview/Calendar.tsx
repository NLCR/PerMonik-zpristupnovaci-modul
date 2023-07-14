/* eslint-disable react/prop-types */
import { Flex, Grid, rem, Text } from '@mantine/core'
import { FC, memo } from 'react'
import _ from 'lodash'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { TSpecimen } from '../../@types/specimen'
import { useSpecimensOverviewStore } from '../../slices/useSpecimensOverviewStore'
import { mutations } from '../../utils/constants'

type TProps = {
  specimens: TSpecimen[]
}

const Calendar: FC<TProps> = memo(function Calendar({ specimens }) {
  const { t } = useTranslation()
  const { calendarDate } = useSpecimensOverviewStore()
  const dayJs = dayjs(calendarDate)
  const daysInMonth = dayJs.daysInMonth()
  const daysArray: string[] = []
  for (let i = 1; i <= daysInMonth; i += 1) {
    daysArray.push(dayJs.set('date', i).format('YYYY-MM-DD'))
  }

  const groupedSpecimensByDay = _(specimens)
    .groupBy((s) => s.publicationDate)
    .map((value, key) => ({ day: key, specimens: value }))
    .value()

  const specimensInDay: { day: string; specimens: TSpecimen[][] }[] = []

  daysArray.forEach((day) => {
    const found = groupedSpecimensByDay.find((group) => group.day === day)
    if (found) {
      const groupedBySameAttributes = Object.values(
        _.groupBy(
          found.specimens,
          (obj) =>
            `${obj.mutation}_${obj.publicationMark}_${obj.number}_${obj.state}`
        )
      )
      specimensInDay.push({ day, specimens: groupedBySameAttributes })
    } else {
      specimensInDay.push({ day, specimens: [] })
    }
  })

  return (
    <Grid
      sx={(theme) => ({
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.md,
        height: '100%',
        overflowY: 'auto',
      })}
    >
      {specimensInDay.map((d) => (
        <Grid.Col
          span={2}
          key={d.day}
          sx={(theme) => ({
            backgroundColor: theme.colors.gray[1],
            border: '2px solid white',
            borderRadius: theme.radius.sm,
            paddingTop: rem(2),
          })}
        >
          <Text size="sm">
            <Text color="blue.9" mb={4}>
              {dayjs(d.day).format('dd DD')}
            </Text>
            {/* grouping by same values and displaying same specimens on one line (when clicked, individual specimens are shown) */}
            {d.specimens.map((a) => {
              const first = a.find(Boolean)
              if (first) {
                return (
                  <Flex
                    key={first.id}
                    my={2}
                    py={2}
                    px={6}
                    bg={first.state === 'ok' ? 'green.7' : 'orange.7'}
                    sx={(theme) => ({
                      borderRadius: theme.radius.sm,
                      color: theme.colors.gray[0],
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: rem(13),
                    })}
                  >
                    <Text>
                      {first.number}{' '}
                      {
                        mutations.find((m) => m.id === Number(first.mutation))
                          ?.name
                      }{' '}
                      {first.publicationMark.length
                        ? first.publicationMark
                        : t('specimens_overview.without_mark')}
                    </Text>
                    <Flex
                      sx={(theme) => ({
                        backgroundColor: theme.colors.gray[0],
                        borderRadius: '50%',
                        color: theme.colors.gray[9],
                        width: rem(16),
                        height: rem(16),
                        alignItems: 'center',
                        justifyContent: 'center',
                      })}
                    >
                      {a.length}
                    </Flex>
                  </Flex>
                )
              }
              return null
            })}
          </Text>
        </Grid.Col>
      ))}
    </Grid>
  )
})

export default Calendar
