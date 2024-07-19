import { Box, createStyles, Flex, rem, Tooltip } from '@mantine/core'
import React, { FC, useEffect, useMemo, useState } from 'react'
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
import { damageTypes } from '../../../utils/constants'
import i18next from '../../../i18next'
import { TSpecimen } from '../../../@types/specimen'
import { useSpecimensOverviewStore } from '../../../slices/useSpecimensOverviewStore'
import {
  useLanguageCode,
  useMantineTableLang,
} from '../../../utils/helperHooks'
import { useMutationListQuery } from '../../../api/mutation'
import { usePublicationListQuery } from '../../../api/publication'
import { useOwnerListQuery } from '../../../api/owner'
import { TMetaTitle } from '../../../schema/metaTitle'
import { useSpecimenListQuery } from '../../../api/specimen'
import ShowInfoMessage from '../../../components/ShowInfoMessage'
import ShowError from '../../../components/ShowError'

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
  ownerId: string
}> = ({ row, ownerId }) => {
  const { classes } = useStyles()
  const { t, i18n } = useTranslation()

  return row.original.ownerId === ownerId ? (
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
  ) : undefined
}

type Props = {
  metaTitle: TMetaTitle
}

const Table: FC<Props> = ({ metaTitle }) => {
  const [localPagination, setLocalPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })
  const { t } = useTranslation()
  const { pagination, setPagination } = useSpecimensOverviewStore()
  const { mantineTableLocale } = useMantineTableLang()
  const { data: mutations } = useMutationListQuery()
  const { data: publications } = usePublicationListQuery()
  const { data: owners } = useOwnerListQuery()
  const { languageCode } = useLanguageCode()

  const {
    data: specimens,
    isFetching: specimensFetching,
    isError: specimensError,
  } = useSpecimenListQuery(metaTitle.id)

  useEffect(() => {
    setPagination(localPagination)
  }, [localPagination, setPagination])

  useEffect(() => {
    setLocalPagination(pagination)
  }, [pagination])

  const columns = useMemo<MRT_ColumnDef<TSpecimen>[]>(() => {
    const ownersArray = owners
      ? owners.map((o) => ({
          id: `owner${o.name}`,
          accessorKey: 'ownerId',
          header: o.name,
          maxSize: 0,
          Cell: ({ row }: { row: MRT_Row<TSpecimen> }) => (
            <OwnersBarCodeCell row={row} ownerId={o.id} />
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
    data: specimens?.specimens || [],
    localization: mantineTableLocale,
    enableStickyHeader: true,
    enableFilters: false,
    enableSorting: false,
    enableDensityToggle: false,
    initialState: {
      density: 'xs',
    },
    state: {
      pagination,
      showSkeletons: false,
      showProgressBars: specimensFetching,
    },
    manualPagination: true,
    rowCount: specimens?.count,
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

  if (specimensError) {
    return <ShowError />
  }

  if (!specimens?.specimens && !specimensFetching) {
    return (
      <ShowInfoMessage message={t('specimens_overview.specimens_not_found')} />
    )
  }

  return <MantineReactTable table={table} />
}

export default Table
