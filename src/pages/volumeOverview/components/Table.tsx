/* eslint-disable react/prop-types */
import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import CheckIcon from '@mui/icons-material/Check'
import { csCZ } from '@mui/x-data-grid/locales'
import { Box } from '@mui/material'
import { TSpecimen } from '../../../schema/specimen'
import { TVolumeDetail } from '../../../schema/volume'
import { useLanguageCode } from '../../../utils/helperHooks'
import { useMutationListQuery } from '../../../api/mutation'
import { usePublicationListQuery } from '../../../api/publication'

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

const Table: FC<TProps> = ({ volume = undefined }) => {
  const { data: mutations } = useMutationListQuery()
  const { data: publications } = usePublicationListQuery()
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
          return row.numExists && !row.isAttachment ? row.number : null
        },
      },
      {
        field: 'attachment_number',
        headerName: t('volume_overview.attachment_number'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return row.isAttachment ? row.number : null
        },
      },
      {
        field: 'mutationId',
        headerName: t('volume_overview.mutation'),
        valueFormatter: (value) => {
          return mutations?.find((m) => m.id === value)?.name[languageCode]
        },
      },
      {
        field: 'publicationId',
        headerName: t('volume_overview.publication'),
        valueFormatter: (value) => {
          return publications?.find((m) => m.id === value)?.name[languageCode]
        },
      },
      {
        field: 'name',
        headerName: t('volume_overview.name'),
      },
      {
        field: 'subName',
        headerName: t('volume_overview.sub_name'),
      },
      {
        field: 'pagesCount',
        headerName: t('volume_overview.pages_count'),
      },
      {
        field: 'publicationMark',
        headerName: t('volume_overview.publication_mark'),
      },
      {
        field: 'damageTypes-reviewed',
        headerName: t('facet_states.OK'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return CenteredIcon(!!row.damageTypes?.includes('OK'))
        },
      },
      {
        field: 'damageTypes-damaged_pages',
        headerName: t('facet_states.PP'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return CenteredIcon(!!row.damageTypes?.includes('PP'))
        },
      },
      {
        field: 'damageTypes-degradation',
        headerName: t('facet_states.Deg'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return CenteredIcon(!!row.damageTypes?.includes('Deg'))
        },
      },
      {
        field: 'damageTypes-missing_pages',
        headerName: t('facet_states.ChS'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return CenteredIcon(!!row.damageTypes?.includes('ChS'))
        },
      },
      {
        field: 'damageTypes-bad_pagination',
        headerName: t('facet_states.ChPag'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return CenteredIcon(!!row.damageTypes?.includes('ChPag'))
        },
      },
      {
        field: 'damageTypes-bad_date',
        headerName: t('facet_states.ChDatum'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return CenteredIcon(!!row.damageTypes?.includes('ChDatum'))
        },
      },
      {
        field: 'damageTypes-bad_numbering',
        headerName: t('facet_states.ChCis'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return CenteredIcon(!!row.damageTypes?.includes('ChCis'))
        },
      },
      {
        field: 'damageTypes-bad_bound',
        headerName: t('facet_states.ChSv'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return CenteredIcon(!!row.damageTypes?.includes('ChSv'))
        },
      },
      {
        field: 'damageTypes-cenzured',
        headerName: t('facet_states.Cz'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return CenteredIcon(!!row.damageTypes?.includes('Cz'))
        },
      },
      {
        field: 'note',
        flex: 1,
        minWidth: 180,
        headerName: t('volume_overview.note'),
      },
    ]
  }, [languageCode, mutations, publications, t])

  return (
    <DataGrid
      localeText={csCZ.components.MuiDataGrid.defaultProps.localeText}
      density="compact"
      rows={volume?.specimens}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 100,
            page: 0,
          },
        },
      }}
      pageSizeOptions={[100]}
      disableRowSelectionOnClick
    />
  )
}

export default Table
