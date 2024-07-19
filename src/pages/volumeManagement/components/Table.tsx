/* eslint-disable react/prop-types */
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from 'mantine-react-table'
import { Checkbox, Flex, TextInput, Title } from '@mantine/core'
import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { TEditableSpecimen } from '../../../schema/specimen'
import {
  useLanguageCode,
  useMantineTableLang,
} from '../../../utils/helperHooks'
import { useVolumeManagementStore } from '../../../slices/useVolumeManagementStore'
import { TMutation } from '../../../schema/mutation'
import { TPublication } from '../../../schema/publication'

interface TableProps {
  canEdit: boolean
  mutations: TMutation[]
  publications: TPublication[]
}

const Table: FC<TableProps> = ({ canEdit, mutations, publications }) => {
  const { languageCode } = useLanguageCode()
  const { mantineTableLocale } = useMantineTableLang()
  const { t } = useTranslation()

  const specimensState = useVolumeManagementStore(
    (state) => state.specimensState
  )
  const specimenActions = useVolumeManagementStore(
    (state) => state.specimensActions
  )
  // const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({})

  const columns = useMemo<MRT_ColumnDef<TEditableSpecimen>[]>(
    () => [
      {
        accessorKey: 'publicationDate',
        header: t('volume_overview.date'),
        maxSize: 0,
        Cell: ({ row }) =>
          dayjs(row.original.publicationDate).format('dd DD.MM.YYYY'),
        Edit: ({ row }) => (
          <TextInput
            disabled
            value={dayjs(row.original.publicationDate).format('dd DD.MM.YYYY')}
          />
        ),
      },
      {
        accessorKey: 'numExists',
        header: t('volume_overview.is_in_volume'),
        maxSize: 0,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) => (
          <Checkbox
            // disabled={!canEdit}
            checked={row.original.numExists}
            // onChange={(e) =>
            //   specimenActions.setNumExists(e.target.checked, row.original.id)
            // >
          />
        ),
      },
      {
        accessorKey: 'numMissing',
        header: t('volume_overview.missing_number'),
        maxSize: 0,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) =>
          row.original.numMissing ? (
            <Checkbox checked={row.original.numMissing} />
          ) : null,
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
            <Checkbox checked={row.original.damageTypes?.includes('OK')} />
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
            <Checkbox checked={row.original.damageTypes?.includes('PP')} />
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
            <Checkbox checked={row.original.damageTypes?.includes('Deg')} />
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
            <Checkbox checked={row.original.damageTypes?.includes('ChS')} />
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
            <Checkbox checked={row.original.damageTypes?.includes('ChPag')} />
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
            <Checkbox checked={row.original.damageTypes?.includes('ChDatum')} />
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
            <Checkbox checked={row.original.damageTypes?.includes('ChCis')} />
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
            <Checkbox checked={row.original.damageTypes?.includes('ChSv')} />
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
            <Checkbox checked={row.original.damageTypes?.includes('Cz')} />
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
    data: specimensState,
    localization: mantineTableLocale,
    enableStickyHeader: true,
    enableHiding: false,
    enableFilters: false,
    enableSorting: false,
    enablePagination: false,
    enableColumnActions: false,
    editDisplayMode: 'modal',
    onEditingRowSave: undefined,
    enableEditing: canEdit,
    // enableRowVirtualization: true,
    // enableRowSelection: true,
    // onRowSelectionChange: setRowSelection,
    enableDensityToggle: false,
    initialState: {
      density: 'xs',
    },
    // state: { showSkeletons: !specimens },
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
        // writingMode: 'vertical-lr',
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

  return (
    <Flex
      direction="column"
      sx={(theme) => ({
        height: '100%',
        maxHeight: '80vh',
        padding: theme.spacing.md,
        backgroundColor: 'white',
        borderRadius: theme.spacing.xs,
        boxShadow: theme.shadows.xs,
        // width: '64%',
        width: '76%',
      })}
    >
      <Title
        order={5}
        sx={(theme) => ({
          marginBottom: theme.spacing.xs,
          color: theme.colors.blue[9],
        })}
      >
        {t('volume_overview.volume_description')}
      </Title>
      <MantineReactTable table={table} />
    </Flex>
  )
}

export default Table
