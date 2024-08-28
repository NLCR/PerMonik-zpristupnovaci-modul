import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { GridColDef, GridRenderCellParams, DataGrid } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { Link as RouterLink } from 'react-router-dom'
import { blue, green, grey, orange, red } from '@mui/material/colors'
import { TFunction } from 'i18next'
import { TMetaTitle } from '../../../schema/metaTitle'
import { useLanguageCode, useMuiTableLang } from '../../../utils/helperHooks'
import { useMutationListQuery } from '../../../api/mutation'
import { usePublicationListQuery } from '../../../api/publication'
import { useOwnerListQuery } from '../../../api/owner'
import { useSpecimenListQuery } from '../../../api/specimen'
import { TSpecimen } from '../../../schema/specimen'
import { damageTypes } from '../../../utils/constants'
import { useSpecimensOverviewStore } from '../../../slices/useSpecimensOverviewStore'

const getSpecimenState = (sp: TSpecimen, t: TFunction) => {
  if (sp.damageTypes) {
    if (!sp.damageTypes.length) {
      return (
        <Tooltip title={t('tooltip_states.uncontrolled')}>
          <Box
            sx={(theme) => ({
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              border: `1px solid ${theme.palette.grey['700']}`,
              backgroundColor: grey['100'],
            })}
          />
        </Tooltip>
      )
    }
    if (sp.damageTypes.includes('ChS')) {
      return (
        <Tooltip title={t('tooltip_states.missing_page')}>
          <Box
            sx={(theme) => ({
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              border: `1px solid ${theme.palette.grey['700']}`,
              backgroundColor: red['700'],
            })}
          />
        </Tooltip>
      )
    }
    if (sp.damageTypes.some((st) => damageTypes.includes(st) && st !== 'OK')) {
      return (
        <Tooltip title={t('tooltip_states.damaged_document')}>
          <Box
            sx={(theme) => ({
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              border: `1px solid ${theme.palette.grey['700']}`,
              backgroundColor: orange['700'],
            })}
          />
        </Tooltip>
      )
    }

    return (
      <Tooltip title={t('tooltip_states.complete')}>
        <Box
          sx={(theme) => ({
            width: '15px',
            height: '15px',
            borderRadius: '50%',
            border: `1px solid ${theme.palette.grey['700']}`,
            backgroundColor: green['700'],
          })}
        />
      </Tooltip>
    )
  }

  return (
    <Tooltip title={t('tooltip_states.uncontrolled')}>
      <Box
        sx={(theme) => ({
          width: '15px',
          height: '15px',
          borderRadius: '50%',
          border: `1px solid ${theme.palette.grey['700']}`,
          backgroundColor: theme.palette.grey['100'],
        })}
      />
    </Tooltip>
  )
}

const OwnersBarCodeCell: FC<{
  row: TSpecimen
  ownerId: string
}> = ({ row, ownerId }) => {
  const { t, i18n } = useTranslation()

  return row.ownerId === ownerId ? (
    <Grid
      container
      spacing={1}
      alignItems="center"
      justifyContent="center"
      flexWrap="nowrap"
    >
      <Grid
        item
        sx={{
          textDecoration: 'none',
          color: blue['700'],
          transition: 'color 0.1s',
          ':hover': {
            color: blue['900'],
          },
        }}
        component={RouterLink}
        to={`/${i18n.resolvedLanguage}/${t('urls.volume_overview')}/${
          row.volumeId
        }`}
      >
        {row.barCode}
      </Grid>
      <Grid item>{getSpecimenState(row, t)}</Grid>
    </Grid>
  ) : undefined
}

type Props = {
  metaTitle: TMetaTitle
}

const Table: FC<Props> = ({ metaTitle }) => {
  const { t } = useTranslation()
  const { MuiTableLocale } = useMuiTableLang()
  const pagination = useSpecimensOverviewStore((state) => state.pagination)
  const setPagination = useSpecimensOverviewStore(
    (state) => state.setPagination
  )
  const { data: mutations } = useMutationListQuery()
  const { data: publications } = usePublicationListQuery()
  const { data: owners } = useOwnerListQuery()
  const { languageCode } = useLanguageCode()

  const {
    data: specimens,
    isFetching: specimensFetching,
    // isError: specimensError,
  } = useSpecimenListQuery(metaTitle.id)

  const columns = useMemo<GridColDef<TSpecimen>[]>(() => {
    return [
      {
        field: 'mutationId',
        headerName: t('table.mutations'),
        valueFormatter: (value) => {
          return mutations?.find((m) => m.id === value)?.name[languageCode]
        },
      },
      {
        field: 'publicationDate',
        headerName: t('table.publication_date'),
        flex: 1,
        valueFormatter: (value) => {
          return dayjs(value).format('dd DD.MM.YYYY')
        },
      },
      {
        field: 'name',
        headerName: t('table.name'),
        flex: 1,
      },
      {
        field: 'publicationId',
        headerName: t('table.publication'),
        flex: 1,
        valueFormatter: (value) => {
          return publications?.find((m) => m.id === value)?.name[languageCode]
        },
      },
      {
        field: 'number',
        headerName: t('table.number'),
      },
      {
        field: 'pagesCount',
        headerName: t('table.pages_count'),
      },
      ...(owners
        ? owners.map((o) => ({
            field: `owner${o.id}`,
            flex: 1,
            headerName: o.name,
            renderCell: (params: GridRenderCellParams<TSpecimen>) => {
              const { row } = params
              return <OwnersBarCodeCell row={row} ownerId={o.id} />
            },
          }))
        : []),
    ]
  }, [languageCode, mutations, owners, publications, t])

  return (
    <DataGrid
      localeText={MuiTableLocale}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: pagination.pageSize,
            page: pagination.pageIndex,
          },
        },
        density: 'compact',
      }}
      disableColumnFilter
      disableColumnSorting
      rows={specimens?.specimens || []}
      rowCount={specimens?.count || 0}
      paginationMode="server"
      loading={specimensFetching}
      onPaginationModelChange={(model) =>
        setPagination({ pageSize: model.pageSize, pageIndex: model.page })
      }
      columns={columns}
      pageSizeOptions={[25, 50, 100]}
      disableRowSelectionOnClick
    />
  )
}

export default Table
