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
import { owners, states } from '../../utils/constants'
import i18next from '../../i18next'
import { TSpecimen } from '../../@types/specimen'
// import { formatDateWithDashesToString } from '../../utils/helperFunctions'
import { useSpecimensOverviewStore } from '../../slices/useSpecimensOverviewStore'
import {
  useMantineTableLang,
  useTranslatedConstants,
} from '../../utils/helperHooks'

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
  if (sp.states) {
    if (!sp.states.length) {
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
    if (sp.states.includes('ChS')) {
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
    if (sp.states.some((st) => states.filter((s) => s !== 'OK').includes(st))) {
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
  ownerRow: 0 | 1 | 2 | 3
}> = ({ row, ownerRow }) => {
  const { classes } = useStyles()
  const { t, i18n } = useTranslation()

  return Number(row.original.owner) === owners[ownerRow].id ? (
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
          row.original.barCode
        }`}
      >
        <IconFileSymlink size={20} />
      </Link>
      {getSpecimenState(row.original)}
    </Flex>
  ) : undefined
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
  const { publications, mutations } = useTranslatedConstants()
  const [localPagination, setLocalPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })
  const { t } = useTranslation()
  const { setPagination } = useSpecimensOverviewStore()
  const { mantineTableLocale } = useMantineTableLang()

  useEffect(() => {
    setPagination(localPagination)
  }, [localPagination, setPagination])

  const columns = useMemo<MRT_ColumnDef<TSpecimen>[]>(
    () => [
      {
        accessorKey: 'mutation',
        header: t('table.mutations'),
        maxSize: 110,
        Cell: ({ cell }) =>
          mutations.find((m) => m.id === Number(cell.getValue<string>()))?.name,
      },
      {
        accessorKey: 'publicationDate',
        header: t('table.publication_date'),
        Cell: ({ cell }) =>
          dayjs(cell.getValue<string>()).format('dd DD.MM.YYYY'),
      },
      {
        accessorKey: 'name',
        header: t('table.name'),
      },
      {
        accessorKey: 'publication',
        header: t('table.publication'),
        maxSize: 110,
        Cell: ({ cell }) =>
          publications.find((p) => p.id === Number(cell.getValue<string>()))
            ?.name,
      },
      {
        accessorKey: 'number',
        header: t('table.number'),
        maxSize: 110,
      },
      {
        accessorKey: 'pagesCount',
        header: t('table.pages_count'),
        maxSize: 110,
      },
      {
        id: `owner${owners[0].name}`,
        accessorKey: 'owner',
        header: owners[0].name,
        Cell: ({ row }) => <OwnersBarCodeCell row={row} ownerRow={0} />,
      },
      {
        id: `owner${owners[1].name}`,
        accessorKey: 'owner',
        header: owners[1].name,
        Cell: ({ row }) => <OwnersBarCodeCell row={row} ownerRow={1} />,
      },
      {
        id: `owner${owners[2].name}`,
        accessorKey: 'owner',
        header: owners[2].name,
        Cell: ({ row }) => <OwnersBarCodeCell row={row} ownerRow={2} />,
      },
      {
        id: `owner${owners[3].name}`,
        accessorKey: 'owner',
        header: owners[3].name,
        Cell: ({ row }) => <OwnersBarCodeCell row={row} ownerRow={3} />,
      },
    ],
    [mutations, publications, t]
  )

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
      sx: (theme) => ({
        fontSize: `${theme.fontSizes.xs} !important`,
      }),
    },
    mantineTableHeadCellProps: {
      sx: (theme) => ({
        fontSize: `${theme.fontSizes.xs} !important`,
      }),
    },
  })

  return <MantineReactTable table={table} />
})

export default Table
