/* eslint-disable react/prop-types */
import { Box, createStyles, Flex, rem, Tooltip } from '@mantine/core'
import { FC, memo, useEffect, useMemo, useState } from 'react'
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_Row,
  useMantineReactTable,
} from 'mantine-react-table'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { IconFileSymlink } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { damageTypes } from '../../utils/constants'
import i18next from '../../i18next'
import { TSpecimen } from '../../@types/specimen'
import { useSpecimensOverviewStore } from '../../slices/useSpecimensOverviewStore'
import { useLanguageCode, useMantineTableLang } from '../../utils/helperHooks'
import { useMutationListQuery } from '../../api/mutation'
import { usePublicationListQuery } from '../../api/publication'
import { useOwnerListQuery } from '../../api/owner'

const useStyles = createStyles((theme) => ({
  link: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.colors.blue[5],
    transition: 'color 0.1s',
    ':hover': {
      color: theme.colors.blue[9],
    },
  },
}))

const getSpecimenState = (sp: TSpecimen) => {
  if (sp.damageTypes) {
    if (!sp.damageTypes.length) {
      return (
        <Tooltip label={i18next.t('tooltip_states.uncontrolled')}>
          <Box
            sx={(theme) => ({
              width: rem(15),
              height: rem(15),
              borderRadius: '50%',
              border: `${rem(1)} solid ${theme.colors.gray[7]}`,
              backgroundColor: theme.colors.gray[0],
            })}
          />
        </Tooltip>
      )
    }
    if (sp.damageTypes.includes('ChS')) {
      return (
        <Tooltip label={i18next.t('tooltip_states.missing_page')}>
          <Box
            sx={(theme) => ({
              width: rem(15),
              height: rem(15),
              borderRadius: '50%',
              border: `${rem(1)} solid ${theme.colors.gray[7]}`,
              backgroundColor: theme.colors.red[7],
            })}
          />
        </Tooltip>
      )
    }
    if (sp.damageTypes.some((st) => damageTypes.includes(st) && st !== 'OK')) {
      return (
        <Tooltip label={i18next.t('tooltip_states.damaged_document')}>
          <Box
            sx={(theme) => ({
              width: rem(15),
              height: rem(15),
              borderRadius: '50%',
              border: `${rem(1)} solid ${theme.colors.gray[7]}`,
              backgroundColor: theme.colors.orange[7],
            })}
          />
        </Tooltip>
      )
    }

    return (
      <Tooltip label={i18next.t('tooltip_states.complete')}>
        <Box
          sx={(theme) => ({
            width: rem(15),
            height: rem(15),
            borderRadius: '50%',
            border: `${rem(1)} solid ${theme.colors.gray[7]}`,
            backgroundColor: theme.colors.green[7],
          })}
        />
      </Tooltip>
    )
  }

  return (
    <Tooltip label={i18next.t('tooltip_states.uncontrolled')}>
      <Box
        sx={(theme) => ({
          width: rem(15),
          height: rem(15),
          borderRadius: '50%',
          border: `${rem(1)} solid ${theme.colors.gray[7]}`,
          backgroundColor: theme.colors.gray[0],
        })}
      />
    </Tooltip>
  )
}

const OwnersBarCodeCell: FC<{
  row: MRT_Row<TSpecimen>
}> = ({ row }) => {
  const { classes } = useStyles()
  const { t, i18n } = useTranslation()

  return (
    <Flex
      sx={(theme) => ({
        gap: theme.spacing.xs,
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      {row.original.barCode}
      <Link
        className={classes.link}
        to={`/${i18n.resolvedLanguage}/${t('urls.volume_overview')}/${
          row.original.volumeId
        }`}
      >
        <IconFileSymlink size={20} />
      </Link>
      {getSpecimenState(row.original)}
    </Flex>
  )
}

type TProps = {
  specimens: TSpecimen[]
  count: number
  specimensRefetching: boolean
}

const Table: FC<TProps> = memo(function Table({
  specimens,
  count,
  specimensRefetching,
}) {
  const [localPagination, setLocalPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })
  const { t } = useTranslation()
  const { setPagination } = useSpecimensOverviewStore()
  const { mantineTableLocale } = useMantineTableLang()
  const { data: mutations } = useMutationListQuery()
  const { data: publications } = usePublicationListQuery()
  const { data: owners } = useOwnerListQuery()
  const { languageCode } = useLanguageCode()

  useEffect(() => {
    setPagination(localPagination)
  }, [localPagination, setPagination])

  const columns = useMemo<MRT_ColumnDef<TSpecimen>[]>(() => {
    const ownersArray = owners
      ? owners.map((o) => ({
          id: `owner${o.name}`,
          accessorKey: 'owner',
          header: o.name,
          maxSize: 0,
          Cell: ({ row }: { row: MRT_Row<TSpecimen> }) => (
            <OwnersBarCodeCell row={row} />
          ),
        }))
      : []

    return [
      {
        accessorKey: 'mutationId',
        header: t('table.mutations'),
        maxSize: 0,
        Cell: ({ cell }) =>
          mutations?.find((m) => m.id === cell.getValue<string>())?.name[
            languageCode
          ],
      },
      {
        accessorKey: 'publicationDate',
        header: t('table.publication_date'),
        maxSize: 0,
        Cell: ({ cell }) =>
          dayjs(cell.getValue<string>()).format('dd DD.MM.YYYY'),
      },
      {
        accessorKey: 'name',
        header: t('table.name'),
        maxSize: 0,
      },
      {
        accessorKey: 'publicationId',
        header: t('table.publication'),
        maxSize: 0,
        Cell: ({ cell }) =>
          publications?.find((p) => p.id === cell.getValue<string>())?.name[
            languageCode
          ],
      },
      {
        accessorKey: 'number',
        header: t('table.number'),
        maxSize: 0,
      },
      {
        accessorKey: 'pagesCount',
        header: t('table.pages_count'),
        maxSize: 0,
      },
      ...ownersArray,
    ]
  }, [languageCode, mutations, owners, publications, t])

  const table = useMantineReactTable({
    columns,
    data: specimens || [],
    localization: mantineTableLocale,
    enableStickyHeader: true,
    enableFilters: false,
    enableSorting: false,
    initialState: {
      density: 'xs',
    },
    state: {
      pagination: localPagination,
      showSkeletons: false,
      showProgressBars: specimensRefetching,
    },
    manualPagination: true,
    rowCount: count,
    onPaginationChange: setLocalPagination,
    mantinePaginationProps: {
      rowsPerPageOptions: ['25', '50', '100'],
    },
    mantineTableHeadRowProps: {
      sx: (theme) => ({
        boxShadow: `${theme.shadows.xs} !important`,
      }),
    },
    mantineTableContainerProps: {
      sx: () => ({
        boxShadow: `none !important`,
      }),
    },
    mantinePaperProps: {
      sx: () => ({
        border: `none !important`,
        boxShadow: `none !important`,
        display: 'flex',
        flexDirection: 'column',
      }),
    },
    mantineTableProps: {
      striped: false,
      highlightOnHover: true,
      withBorder: false,
      withColumnBorders: true,
    },
    mantineTableBodyCellProps: {
      sx: () => ({
        fontSize: `11px !important`,
      }),
    },
    mantineTableHeadCellProps: {
      sx: () => ({
        fontSize: `11px !important`,
      }),
    },
  })

  return <MantineReactTable table={table} />
})

export default Table
