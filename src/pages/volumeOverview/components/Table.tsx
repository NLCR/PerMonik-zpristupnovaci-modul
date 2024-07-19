/* eslint-disable react/prop-types */
import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import CheckIcon from '@mui/icons-material/Check'
import { csCZ } from '@mui/x-data-grid/locales'
import { TSpecimen } from '../../../schema/specimen'
import { TVolumeDetail } from '../../../schema/volume'
import { useLanguageCode } from '../../../utils/helperHooks'
import { useMutationListQuery } from '../../../api/mutation'
import { usePublicationListQuery } from '../../../api/publication'

type TProps = {
  volume?: TVolumeDetail
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
        valueFormatter: (value) => {
          return dayjs(value).format('dd DD.MM.YYYY')
        },
      },
      {
        field: 'numExists',
        headerName: t('volume_overview.is_in_volume'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return row.numExists ? <CheckIcon /> : null
        },
      },
      {
        field: 'numMissing',
        headerName: t('volume_overview.missing_number'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return row.numMissing ? <CheckIcon /> : null
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
          return row.damageTypes.includes('OK') ? <CheckIcon /> : null
        },
      },
      {
        field: 'damageTypes-damaged_pages',
        headerName: t('facet_states.PP'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return row.damageTypes.includes('PP') ? <CheckIcon /> : null
        },
      },
      {
        field: 'damageTypes-degradation',
        headerName: t('facet_states.Deg'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return row.damageTypes.includes('Deg') ? <CheckIcon /> : null
        },
      },
      {
        field: 'damageTypes-missing_pages',
        headerName: t('facet_states.ChS'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return row.damageTypes.includes('ChS') ? <CheckIcon /> : null
        },
      },
      {
        field: 'damageTypes-bad_pagination',
        headerName: t('facet_states.ChPag'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return row.damageTypes.includes('ChPag') ? <CheckIcon /> : null
        },
      },
      {
        field: 'damageTypes-bad_date',
        headerName: t('facet_states.ChDatum'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return row.damageTypes.includes('ChDatum') ? <CheckIcon /> : null
        },
      },
      {
        field: 'damageTypes-bad_numbering',
        headerName: t('facet_states.ChCis'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return row.damageTypes.includes('ChCis') ? <CheckIcon /> : null
        },
      },
      {
        field: 'damageTypes-bad_bound',
        headerName: t('facet_states.ChSv'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return row.damageTypes.includes('ChSv') ? <CheckIcon /> : null
        },
      },
      {
        field: 'damageTypes-cenzured',
        headerName: t('facet_states.Cz'),
        renderCell: (params: GridRenderCellParams<TSpecimen>) => {
          const { row } = params
          return row.damageTypes.includes('Cz') ? <CheckIcon /> : null
        },
      },
      {
        field: 'note',
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
