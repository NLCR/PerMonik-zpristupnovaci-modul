/* eslint-disable react/prop-types */
import {
  MantineReactTable,
  MRT_ColumnDef,
  // MRT_RowSelectionState,
  useMantineReactTable,
} from 'mantine-react-table'
// import { Checkbox } from '@mantine/core'
import { FC, memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { IconCheck } from '@tabler/icons-react'
import { TSpecimen } from '../../@types/specimen'
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
  const { t } = useTranslation()
  // const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({})

  const columns = useMemo<MRT_ColumnDef<TSpecimen>[]>(
    () => [
      {
        accessorKey: 'publicationDate',
        header: t('volume_overview.date'),
        maxSize: 0,
        Cell: ({ row }) =>
          dayjs(row.original.publicationDate).format('dd DD.MM.YYYY'),
      },
      {
        accessorKey: 'numExists',
        header: t('volume_overview.is_in_volume'),
        maxSize: 0,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) =>
          row.original.numExists ? <IconCheck size="1rem" /> : null,
        // <Checkbox checked={row.original.numExists} readOnly />
      },
      {
        accessorKey: 'numMissing',
        header: t('volume_overview.missing_number'),
        maxSize: 0,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) =>
          row.original.numMissing ? <IconCheck size="1rem" /> : null,
        // <Checkbox checked={row.original.numMissing} readOnly />
      },
      {
        accessorKey: 'number',
        header: t('volume_overview.number'),
        maxSize: 0,
        Cell: ({ row }) =>
          row.original.numExists && !row.original.isAttachment
            ? row.original.number
            : null,
      },
      {
        accessorKey: 'number',
        id: 'attachment_number',
        header: t('volume_overview.attachment_number'),
        maxSize: 0,
        Cell: ({ row }) =>
          row.original.isAttachment ? row.original.number : undefined,
      },
      {
        accessorKey: 'mutation',
        header: t('volume_overview.mutation'),
        maxSize: 0,
        Cell: ({ row }) =>
          mutations.find((m) => m.id === Number(row.original.mutation))?.name,
      },
      {
        accessorKey: 'publication',
        header: t('volume_overview.publication'),
        maxSize: 0,
        Cell: ({ row }) =>
          publications.find((p) => p.id === Number(row.original.publication))
            ?.name,
      },
      {
        accessorKey: 'name',
        header: t('volume_overview.name'),
        maxSize: 0,
      },
      {
        accessorKey: 'subName',
        header: t('volume_overview.sub_name'),
        maxSize: 0,
      },
      {
        accessorKey: 'pagesCount',
        header: t('volume_overview.pages_count'),
        maxSize: 0,
      },
      {
        accessorKey: 'publicationMark',
        header: t('volume_overview.publication_mark'),
        maxSize: 0,
      },
      {
        accessorKey: 'states',
        id: 'reviewed',
        header: t('facet_states.OK'),
        maxSize: 0,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) =>
          row.original.states?.includes('OK') ? (
            <IconCheck size="1rem" />
          ) : null,
        // <Checkbox checked={row.original.states?.includes('OK')} readOnly />
      },
      {
        accessorKey: 'states',
        id: 'damaged_pages',
        header: t('facet_states.PP'),
        maxSize: 0,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) =>
          row.original.states?.includes('PP') ? (
            <IconCheck size="1rem" />
          ) : null,
        // <Checkbox checked={row.original.states?.includes('PP')} readOnly />
      },
      {
        accessorKey: 'states',
        id: 'degradation',
        header: t('facet_states.Deg'),
        maxSize: 0,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) =>
          row.original.states?.includes('Deg') ? (
            <IconCheck size="1rem" />
          ) : null,
        // <Checkbox checked={row.original.states?.includes('Deg')} readOnly />
      },
      {
        accessorKey: 'states',
        id: 'missing_pages',
        header: t('facet_states.ChS'),
        maxSize: 0,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) =>
          row.original.states?.includes('ChS') ? (
            <IconCheck size="1rem" />
          ) : null,
        // <Checkbox checked={row.original.states?.includes('ChS')} readOnly />
      },
      {
        accessorKey: 'states',
        id: 'bad_pagination',
        header: t('facet_states.ChPag'),
        maxSize: 0,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) =>
          row.original.states?.includes('ChPag') ? (
            <IconCheck size="1rem" />
          ) : null,
        // <Checkbox checked={row.original.states?.includes('ChPag')} readOnly />
      },
      {
        accessorKey: 'states',
        id: 'bad_date',
        header: t('facet_states.ChDatum'),
        maxSize: 0,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) =>
          row.original.states?.includes('ChDatum') ? (
            <IconCheck size="1rem" />
          ) : null,
        // <Checkbox
        //   checked={row.original.states?.includes('ChDatum')}
        //   readOnly
        // />
      },
      {
        accessorKey: 'states',
        id: 'bad_numbering',
        header: t('facet_states.ChCis'),
        maxSize: 0,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) =>
          row.original.states?.includes('ChCis') ? (
            <IconCheck size="1rem" />
          ) : null,
        // <Checkbox checked={row.original.states?.includes('ChCis')} readOnly />
      },
      {
        accessorKey: 'states',
        id: 'bad_bound',
        header: t('facet_states.ChSv'),
        maxSize: 0,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) =>
          row.original.states?.includes('ChSv') ? (
            <IconCheck size="1rem" />
          ) : null,
        // <Checkbox checked={row.original.states?.includes('ChSv')} readOnly />
      },
      {
        accessorKey: 'states',
        id: 'cenzured',
        header: t('facet_states.Cz'),
        maxSize: 0,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) =>
          row.original.states?.includes('Cz') ? (
            <IconCheck size="1rem" />
          ) : null,
        // <Checkbox checked={row.original.states?.includes('Cz')} readOnly />
      },
      {
        accessorKey: 'note',
        header: t('volume_overview.note'),
        maxSize: 0,
      },
    ],
    [mutations, publications, t]
  )

  const table = useMantineReactTable({
    columns,
    data: volume.specimens.specimenList,
    localization: mantineTableLocale,
    enableStickyHeader: true,
    enableFilters: false,
    enableSorting: false,
    enablePagination: false,
    // enableRowSelection: true,
    // onRowSelectionChange: setRowSelection,
    initialState: {
      density: 'xs',
    },
    // state: { rowSelection },
    // mantineTableBodyRowProps: ({ row }) => ({
    //   onClick: () =>
    //     setRowSelection((prev) => ({
    //       ...prev,
    //       [row.id]: !prev[row.id],
    //     })),
    //   selected: rowSelection[row.id],
    //   sx: {
    //     cursor: 'pointer',
    //   },
    // }),
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
    mantineTableBodyProps: {
      sx: (theme) => ({
        '& tr td:first-child': {
          position: 'sticky',
          left: 0,
          backgroundColor: theme.colors.blue[0],
        },
      }),
    },
    mantineTableBodyCellProps: {
      sx: () => ({
        fontSize: `11px !important`,
      }),
    },
    mantineTableHeadCellProps: {
      sx: (theme) => ({
        fontSize: `11px !important`,
        '&:first-child': {
          position: 'sticky',
          left: 0,
          backgroundColor: theme.colors.blue[0],
          borderColor: theme.colors.blue[9],
        },
      }),
    },
  })

  return <MantineReactTable table={table} />
})

export default Table
