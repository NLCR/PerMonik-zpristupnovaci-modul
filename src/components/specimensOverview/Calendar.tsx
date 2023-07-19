/* eslint-disable react/prop-types */
import { Box, Flex, rem, SimpleGrid, Text } from '@mantine/core'
import { FC } from 'react'
import { flow, groupBy, map } from 'lodash-es'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'
import { TSpecimen } from '../../@types/specimen'
import { useSpecimensOverviewStore } from '../../slices/useSpecimensOverviewStore'
import Modal from './Modal'
import { TMetaTitle } from '../../@types/metaTitle'

import { useTranslatedConstants } from '../../utils/helperHooks'

type TProps = {
  specimens: TSpecimen[]
  metaTitle: TMetaTitle
}

const Calendar: FC<TProps> = ({ specimens, metaTitle }) => {
  const { t } = useTranslation()
  const { calendarDate } = useSpecimensOverviewStore()
  const { mutations } = useTranslatedConstants()
  const dayJs = dayjs(calendarDate)
  const daysInMonth = dayJs.daysInMonth()
  const daysArray: string[] = []
  for (let i = 1; i <= daysInMonth; i += 1) {
    daysArray.push(dayJs.set('date', i).format('YYYY-MM-DD'))
  }

  const groupedSpecimensByDay = flow(
    (rawSpecimens: TSpecimen[]) =>
      groupBy(rawSpecimens, (s) => s.publicationDate),
    (groupedSpecimens) =>
      map(groupedSpecimens, (value, key) => ({ day: key, specimens: value }))
  )(specimens)

  const specimensInDay: { day: string; specimens: TSpecimen[][] }[] = []

  daysArray.forEach((day) => {
    const found = groupedSpecimensByDay.find((group) => group.day === day)
    if (found) {
      const groupedBySameAttributes = Object.values(
        groupBy(
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
    <SimpleGrid
      cols={7}
      spacing={2}
      verticalSpacing={2}
      sx={(theme) => ({
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.md,
        height: '100%',
        overflowY: 'auto',
      })}
    >
      {specimensInDay.map((day) => (
        <Box
          key={day.day}
          sx={(theme) => ({
            backgroundColor: theme.colors.gray[1],
            border: `${rem(2)} solid white`,
            borderRadius: theme.radius.sm,
            paddingTop: rem(4),
            paddingLeft: rem(8),
            paddingRight: rem(8),
            paddingBottom: rem(8),
          })}
        >
          <Text size="sm">
            <Text color="blue.9" mb={4}>
              {dayjs(day.day).format('dd DD')}
            </Text>
            {/* specimens grouped by same values and displayed on one line (when clicked, individual specimens are shown) */}
            {day.specimens.map((row) => {
              const firstInRow = row.find(Boolean)
              if (firstInRow) {
                return (
                  <Flex
                    key={firstInRow.id}
                    my={2}
                    py={2}
                    px={6}
                    bg={firstInRow.state === 'ok' ? 'green.7' : 'orange.7'}
                    sx={(theme) => ({
                      borderRadius: theme.radius.sm,
                      color: theme.colors.gray[0],
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: rem(13),
                      cursor: 'pointer',
                    })}
                    onClick={() => {
                      modals.open({
                        centered: true,
                        size: 'auto',
                        title: (
                          <>
                            <Text
                              sx={(theme) => ({
                                color: theme.colors.blue[9],
                                fontSize: theme.fontSizes.xl,
                                fontWeight: 'bold',
                              })}
                            >
                              {metaTitle.name}
                            </Text>
                            {dayjs(day.day).format('dddd DD.MM.YYYY')}
                          </>
                        ),
                        children: <Modal row={row} />,
                      })
                    }}
                  >
                    <Text>
                      {firstInRow.number}{' '}
                      {
                        mutations.find(
                          (m) => m.id === Number(firstInRow.mutation)
                        )?.name
                      }{' '}
                      {firstInRow.publicationMark.length
                        ? firstInRow.publicationMark
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
                      {row.length}
                    </Flex>
                  </Flex>
                )
              }
              return null
            })}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  )
}

export default Calendar
