/* eslint-disable react/prop-types */
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from 'mantine-react-table'
import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { IconCheck } from '@tabler/icons-react'
import { TSpecimen } from '../../../schema/specimen'
import { TVolumeDetail } from '../../../schema/volume'
import {
  useLanguageCode,
  useMantineTableLang,
} from '../../../utils/helperHooks'
import { useMutationListQuery } from '../../../api/mutation'
import { usePublicationListQuery } from '../../../api/publication'

type TProps = {
  volume?: TVolumeDetail
}

const Table: FC<TProps> = ({ volume = undefined }) => {
  const { data: mutations } = useMutationListQuery()
  const { data: publications } = usePublicationListQuery()
  const { languageCode } = useLanguageCode()
  const { mantineTableLocale } = useMantineTableLang()
  const { t } = useTranslation()

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
        accessorKey: 'mutationId',
        header: t('volume_overview.mutation'),
        maxSize: 0,
        Cell: ({ row }) =>
          mutations?.find((m) => m.id === row.original.mutationId)?.name[
            languageCode
          ],
      },
      {
        accessorKey: 'publicationId',
        header: t('volume_overview.publication'),
        maxSize: 0,
        Cell: ({ row }) =>
          publications?.find((p) => p.id === row.original.publicationId)?.name[
            languageCode
          ],
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
        accessorKey: 'damageTypes',
        id: 'reviewed',
        header: t('facet_states.OK'),
        maxSize: 0,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) =>
          row.original.damageTypes?.includes('OK') ? (
            <IconCheck size="1rem" />
          ) : null,
      },
      {
        accessorKey: 'damageTypes',
        id: 'damaged_pages',
        header: t('facet_states.PP'),
        maxSize: 0,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) =>
          row.original.damageTypes?.includes('PP') ? (
            <IconCheck size="1rem" />
          ) : null,
      },
      {
        accessorKey: 'damageTypes',
        id: 'degradation',
        header: t('facet_states.Deg'),
        maxSize: 0,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) =>
          row.original.damageTypes?.includes('Deg') ? (
            <IconCheck size="1rem" />
          ) : null,
      },
      {
        accessorKey: 'damageTypes',
        id: 'missing_pages',
        header: t('facet_states.ChS'),
        maxSize: 0,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) =>
          row.original.damageTypes?.includes('ChS') ? (
            <IconCheck size="1rem" />
          ) : null,
      },
      {
        accessorKey: 'damageTypes',
        id: 'bad_pagination',
        header: t('facet_states.ChPag'),
        maxSize: 0,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) =>
          row.original.damageTypes?.includes('ChPag') ? (
            <IconCheck size="1rem" />
          ) : null,
      },
      {
        accessorKey: 'damageTypes',
        id: 'bad_date',
        header: t('facet_states.ChDatum'),
        maxSize: 0,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) =>
          row.original.damageTypes?.includes('ChDatum') ? (
            <IconCheck size="1rem" />
          ) : null,
      },
      {
        accessorKey: 'damageTypes',
        id: 'bad_numbering',
        header: t('facet_states.ChCis'),
        maxSize: 0,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) =>
          row.original.damageTypes?.includes('ChCis') ? (
            <IconCheck size="1rem" />
          ) : null,
      },
      {
        accessorKey: 'damageTypes',
        id: 'bad_bound',
        header: t('facet_states.ChSv'),
        maxSize: 0,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) =>
          row.original.damageTypes?.includes('ChSv') ? (
            <IconCheck size="1rem" />
          ) : null,
      },
      {
        accessorKey: 'damageTypes',
        id: 'cenzured',
        header: t('facet_states.Cz'),
        maxSize: 0,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) =>
          row.original.damageTypes?.includes('Cz') ? (
            <IconCheck size="1rem" />
          ) : null,
      },
      {
        accessorKey: 'note',
        header: t('volume_overview.note'),
        maxSize: 0,
      },
    ],
    [languageCode, mutations, publications, t]
  )

  const table = useMantineReactTable({
    columns,
    data: volume?.specimens || [],
    localization: mantineTableLocale,
    enableStickyHeader: true,
    enableFilters: false,
    enableSorting: false,
    enablePagination: false,
    enableDensityToggle: false,
    initialState: {
      density: 'xs',
    },
    state: { showSkeletons: !volume },
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
          zIndex: 2,
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
          zIndex: 2,
        },
      }),
    },
  })

  return <MantineReactTable table={table} />
}

export default Table
