/* eslint-disable react/prop-types */
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from 'mantine-react-table'
import { Checkbox } from '@mantine/core'
import { FC, memo, useMemo } from 'react'
import { TSpecimen } from '../../@types/specimen'
import i18next from '../../i18next'
import { formatDateWithDashesToString } from '../../utils/helperFunctions'
import { TVolumeDetail } from '../../@types/volume'
import {
  useMantineTableLang,
  useTranslatedConstants,
} from '../../utils/helperHooks'

type TProps = {
  volume: TVolumeDetail
}

const Table: FC<TProps> = memo(function Table({ volume }) {
  const { publications, mutations } = useTranslatedConstants()
  const { mantineTableLocale } = useMantineTableLang()

  const columns = useMemo<MRT_ColumnDef<TSpecimen>[]>(
    () => [
      {
        accessorKey: 'publicationDate',
        header: i18next.t('volume_overview.date'),
        maxSize: 110,
        Cell: ({ row }) =>
          formatDateWithDashesToString(row.original.publicationDate),
      },
      {
        accessorKey: 'numExists',
        header: i18next.t('volume_overview.is_in_volume'),
        maxSize: 110,
        Cell: ({ row }) => (
          <Checkbox checked={row.original.numExists} readOnly />
        ),
      },
      {
        accessorKey: 'numMissing',
        header: i18next.t('volume_overview.missing_number'),
        maxSize: 110,
        Cell: ({ row }) => (
          <Checkbox checked={row.original.numMissing} readOnly />
        ),
      },
      {
        accessorKey: 'number',
        header: i18next.t('volume_overview.number'),
        maxSize: 60,
      },
      {
        accessorKey: 'number',
        id: 'attachment_number',
        header: i18next.t('volume_overview.attachment_number'),
        maxSize: 110,
        Cell: ({ row }) =>
          row.original.isAttachment ? row.original.number : undefined,
      },
      {
        accessorKey: 'mutation',
        header: i18next.t('volume_overview.mutation'),
        maxSize: 110,
        Cell: ({ row }) =>
          mutations.find((m) => m.id === Number(row.original.mutation))?.name,
      },
      {
        accessorKey: 'publication',
        header: i18next.t('volume_overview.publication'),
        maxSize: 110,
        Cell: ({ row }) =>
          publications.find((p) => p.id === Number(row.original.publication))
            ?.name,
      },
      {
        accessorKey: 'name',
        header: i18next.t('volume_overview.name'),
        maxSize: 110,
      },
      {
        accessorKey: 'subName',
        header: i18next.t('volume_overview.sub_name'),
        maxSize: 110,
      },
      {
        accessorKey: 'pagesCount',
        header: i18next.t('volume_overview.pages_count'),
        maxSize: 110,
      },
      {
        accessorKey: 'publicationMark',
        header: i18next.t('volume_overview.publication_mark'),
        maxSize: 110,
      },
      {
        accessorKey: 'states',
        id: 'reviewed',
        header: i18next.t('facet_states.OK'),
        maxSize: 110,
        Cell: ({ row }) => (
          <Checkbox checked={row.original.states?.includes('OK')} readOnly />
        ),
      },
      {
        accessorKey: 'states',
        id: 'damaged_pages',
        header: i18next.t('facet_states.PP'),
        maxSize: 110,
        Cell: ({ row }) => (
          <Checkbox checked={row.original.states?.includes('PP')} readOnly />
        ),
      },
      {
        accessorKey: 'states',
        id: 'degradation',
        header: i18next.t('facet_states.Deg'),
        maxSize: 110,
        Cell: ({ row }) => (
          <Checkbox checked={row.original.states?.includes('Deg')} readOnly />
        ),
      },
      {
        accessorKey: 'states',
        id: 'missing_pages',
        header: i18next.t('facet_states.ChS'),
        maxSize: 110,
        Cell: ({ row }) => (
          <Checkbox checked={row.original.states?.includes('ChS')} readOnly />
        ),
      },
      {
        accessorKey: 'states',
        id: 'bad_pagination',
        header: i18next.t('facet_states.ChPag'),
        maxSize: 110,
        Cell: ({ row }) => (
          <Checkbox checked={row.original.states?.includes('ChPag')} readOnly />
        ),
      },
      {
        accessorKey: 'states',
        id: 'bad_date',
        header: i18next.t('facet_states.ChDatum'),
        maxSize: 110,
        Cell: ({ row }) => (
          <Checkbox
            checked={row.original.states?.includes('ChDatum')}
            readOnly
          />
        ),
      },
      {
        accessorKey: 'states',
        id: 'bad_numbering',
        header: i18next.t('facet_states.ChCis'),
        maxSize: 110,
        Cell: ({ row }) => (
          <Checkbox checked={row.original.states?.includes('ChCis')} readOnly />
        ),
      },
      {
        accessorKey: 'states',
        id: 'bad_bound',
        header: i18next.t('facet_states.ChSv'),
        maxSize: 110,
        Cell: ({ row }) => (
          <Checkbox checked={row.original.states?.includes('ChSv')} readOnly />
        ),
      },
      {
        accessorKey: 'states',
        id: 'cenzured',
        header: i18next.t('facet_states.Cz'),
        maxSize: 110,
        Cell: ({ row }) => (
          <Checkbox checked={row.original.states?.includes('Cz')} readOnly />
        ),
      },
      {
        accessorKey: 'note',
        header: i18next.t('volume_overview.note'),
        maxSize: 110,
      },
    ],
    [mutations, publications]
  )

  const table = useMantineReactTable({
    columns,
    data: volume.specimens.specimenList,
    localization: mantineTableLocale,
    enableStickyHeader: true,
    enableFilters: false,
    enableSorting: false,
    enablePagination: false,
    initialState: {
      density: 'xs',
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
