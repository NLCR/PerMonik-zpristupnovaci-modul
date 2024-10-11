/* eslint-disable react/prop-types */
import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import {
  GridColDef,
  GridRenderCellParams,
  DataGridPro,
} from '@mui/x-data-grid-pro'
import CheckIcon from '@mui/icons-material/Check'
import Box from '@mui/material/Box'
import { TEditableSpecimen, TSpecimen } from '../../../schema/specimen'
import { TVolumeDetail } from '../../../schema/volume'
import { useLanguageCode, useMuiTableLang } from '../../../utils/helperHooks'
import { useMutationListQuery } from '../../../api/mutation'
import { useEditionListQuery } from '../../../api/edition'

type TProps = {
  volume?: TVolumeDetail
}

const CenteredIcon = (show: boolean) => {
  return show ? (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <CheckIcon />
    </Box>
  ) : null
}

const renderValue = (
  value: string | number | undefined | null,
  show: boolean
) => {
  return show ? value : null
}

const Table: FC<TProps> = ({ volume = undefined }) => {
  const { MuiTableLocale } = useMuiTableLang()
  const { data: mutations } = useMutationListQuery()
  const { data: editions } = useEditionListQuery()
  const { languageCode } = useLanguageCode()
  const { t } = useTranslation()

  const columns = useMemo<GridColDef<TSpecimen>[]>(() => {
    return [
      {
        field: 'publicationDate',
        headerName: t('table.publication_date'),
        flex: 1,
        minWidth: 120,
        valueFormatter: (value) => {
          return dayjs(value).format('dd DD.MM.YYYY')
        },
      },
      {
        field: 'numExists',
        headerName: t('volume_overview.is_in_volume'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return CenteredIcon(row.numExists)
        },
      },
      {
        field: 'numMissing',
        headerName: t('volume_overview.missing_number'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return CenteredIcon(row.numMissing)
        },
      },
      {
        field: 'number',
        headerName: t('volume_overview.number'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return renderValue(
            row.number,
            (row.numExists || row.numMissing) && !row.isAttachment
          )
        },
      },
      {
        field: 'attachmentNumber',
        headerName: t('volume_overview.attachment_number'),
        renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
          const { row } = params
          return renderValue(
            row.attachmentNumber,
            row.numExists && row.isAttachment
          )
        },
      },
      {
        field: 'mutationId',
        headerName: t('volume_overview.mutation'),
        renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
          const { row } = params
          return renderValue(
            mutations?.find((m) => m.id === row.mutationId)?.name[languageCode],
            row.numExists
          )
        },
      },
      {
        field: 'editionId',
        headerName: t('volume_overview.edition'),
        renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
          const { row } = params
          return renderValue(
            editions?.find((m) => m.id === row.editionId)?.name[languageCode],
            row.numExists
          )
        },
      },
      {
        field: 'name',
        headerName: t('volume_overview.name'),
        renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
          const { row } = params
          return renderValue(row.name, row.numExists)
        },
      },
      {
        field: 'subName',
        headerName: t('volume_overview.sub_name'),
        renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
          const { row } = params
          return renderValue(row.subName, row.numExists)
        },
      },
      {
        field: 'pagesCount',
        headerName: t('volume_overview.pages_count'),
        renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
          const { row } = params
          return renderValue(row.pagesCount, row.numExists)
        },
      },
      {
        field: 'mutationMark',
        headerName: t('volume_overview.mutation_mark'),
        renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
          const { row } = params
          return renderValue(row.mutationMark, row.numExists)
        },
      },
      {
        field: 'damageTypes-reviewed',
        headerName: t('facet_states.OK'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return CenteredIcon(
            !!row.damageTypes?.includes('OK') && row.numExists
          )
        },
      },
      {
        field: 'damageTypes-damaged_pages',
        headerName: t('facet_states.PP'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return CenteredIcon(
            !!row.damageTypes?.includes('PP') && row.numExists
          )
        },
      },
      {
        field: 'damageTypes-degradation',
        headerName: t('facet_states.Deg'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return CenteredIcon(
            !!row.damageTypes?.includes('Deg') && row.numExists
          )
        },
      },
      {
        field: 'damageTypes-missing_pages',
        headerName: t('facet_states.ChS'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return CenteredIcon(
            !!row.damageTypes?.includes('ChS') && row.numExists
          )
        },
      },
      {
        field: 'damageTypes-bad_pagination',
        headerName: t('facet_states.ChPag'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return CenteredIcon(
            !!row.damageTypes?.includes('ChPag') && row.numExists
          )
        },
      },
      {
        field: 'damageTypes-bad_date',
        headerName: t('facet_states.ChDatum'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return CenteredIcon(
            !!row.damageTypes?.includes('ChDatum') && row.numExists
          )
        },
      },
      {
        field: 'damageTypes-bad_numbering',
        headerName: t('facet_states.ChCis'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return CenteredIcon(
            !!row.damageTypes?.includes('ChCis') && row.numExists
          )
        },
      },
      {
        field: 'damageTypes-bad_bound',
        headerName: t('facet_states.ChSv'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return CenteredIcon(
            !!row.damageTypes?.includes('ChSv') && row.numExists
          )
        },
      },
      {
        field: 'damageTypes-unreadable_bound',
        headerName: t('facet_states.NS'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return CenteredIcon(
            !!row.damageTypes?.includes('NS') && row.numExists
          )
        },
      },
      {
        field: 'damageTypes-cenzured',
        headerName: t('facet_states.Cz'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return CenteredIcon(
            !!row.damageTypes?.includes('Cz') && row.numExists
          )
        },
      },
      {
        field: 'note',
        flex: 1,
        minWidth: 180,
        headerName: t('volume_overview.note'),
        renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
          const { row } = params
          return renderValue(row.note, row.numExists)
        },
      },
    ]
  }, [languageCode, mutations, editions, t])

  return (
    <DataGridPro
      localeText={MuiTableLocale}
      rows={volume?.specimens}
      columns={columns}
      initialState={{
        density: 'compact',
        pinnedColumns: { left: ['publicationDate'] },
      }}
      disableRowSelectionOnClick
      disableColumnSorting
    />
  )
}

export default Table
