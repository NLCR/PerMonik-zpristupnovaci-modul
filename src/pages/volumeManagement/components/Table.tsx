/* eslint-disable react/jsx-props-no-spreading */
import React, { FC, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import {
  DataGrid,
  gridClasses,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid'
import { alpha, Box, Checkbox } from '@mui/material'
import {
  GridCellParams,
  GridRenderEditCellParams,
} from '@mui/x-data-grid/models/params/gridCellParams'
import { clone } from 'lodash-es'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { styled } from '@mui/material/styles'
import { duplicateSpecimen, TEditableSpecimen } from '../../../schema/specimen'
import { useLanguageCode, useMuiTableLang } from '../../../utils/helperHooks'
import { useVolumeManagementStore } from '../../../slices/useVolumeManagementStore'
import { TMutation } from '../../../schema/mutation'
import { TPublication } from '../../../schema/publication'
import DamagedAndMissingPagesEditCell from './editCells/DamagedAndMissingPagesEditCell'
import DamageTypesEditCell from './editCells/DamageTypesEditCell'
import PublicationMarkSelectorModalContainer from './editCells/PublicationMarkSelectorModalContainer'

const ODD_OPACITY = 0.2

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[100],
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      '&:hover': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
  [`& .${gridClasses.row}.attachment`]: {
    backgroundColor: theme.palette.blue[100],
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
  },
}))

const renderCheckBox = (
  checked: boolean,
  show: boolean,
  color: 'primary' | 'success' = 'primary'
) => {
  return show ? <Checkbox color={color} checked={checked} readOnly /> : null
}

const renderValue = (
  value: string | number | undefined | null,
  show: boolean
) => {
  return show ? value : null
}

const renderDamagedAndMissingPagesEditCell = (
  params: GridRenderEditCellParams<TEditableSpecimen>
) => {
  return <DamagedAndMissingPagesEditCell {...params} />
}

const renderDamageTypesEditCell = (
  params: GridRenderEditCellParams<TEditableSpecimen>
) => {
  return <DamageTypesEditCell {...params} />
}

const renderPublicationMarkEditCell = (
  params: GridRenderEditCellParams<TEditableSpecimen>
) => {
  return <PublicationMarkSelectorModalContainer {...params} />
}

interface TableProps {
  canEdit: boolean
  mutations: TMutation[]
  publications: TPublication[]
}

const Table: FC<TableProps> = ({ canEdit, mutations, publications }) => {
  const { languageCode } = useLanguageCode()
  const { MuiTableLocale } = useMuiTableLang()
  const { t } = useTranslation()

  const showAttachmentsAtTheEnd = useVolumeManagementStore(
    (state) => state.volumeState.showAttachmentsAtTheEnd
  )

  const specimensState = useVolumeManagementStore(
    (state) => state.specimensState
  )
  const specimenActions = useVolumeManagementStore(
    (state) => state.specimensActions
  )

  const sortedSpecimensState = useMemo(() => {
    const clonedSpecimens = clone(specimensState)
    if (showAttachmentsAtTheEnd) {
      clonedSpecimens.sort((a, b) => {
        if (a.isAttachment && !b.isAttachment) return 1
        if (!a.isAttachment && b.isAttachment) return -1
        return 0 // Keep the original order if both are attachments or both are not
      })
    }
    return clonedSpecimens
  }, [specimensState, showAttachmentsAtTheEnd])

  const duplicateRow = useCallback(
    (row: TEditableSpecimen) => {
      const specimensStateClone = clone(specimensState)
      const duplicatedSpecimen = duplicateSpecimen(row)
      const originalSpecimenIndex = specimensState.findIndex(
        (s) => s.id === row.id
      )

      if (originalSpecimenIndex >= 0) {
        specimensStateClone.splice(
          originalSpecimenIndex + 1,
          0,
          duplicatedSpecimen
        )
        specimenActions.setSpecimensState(specimensStateClone)
      }
    },
    [specimenActions, specimensState]
  )

  const removeRow = useCallback(
    (id: string) => {
      const specimensStateClone = clone(specimensState)
      const specimenIndex = specimensState.findIndex((s) => s.id === id)

      if (specimenIndex >= 0) {
        specimensStateClone.splice(specimenIndex, 1)
        specimenActions.setSpecimensState(specimensStateClone)
      }
    },
    [specimenActions, specimensState]
  )

  const columns: GridColDef<TEditableSpecimen>[] = [
    {
      field: 'newRow',
      headerName: '',
      flex: 1,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return canEdit ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            {row.duplicated ? (
              <DeleteOutlineIcon
                onClick={() => removeRow(row.id)}
                sx={{
                  cursor: 'pointer',
                }}
              />
            ) : (
              <AddCircleOutlineIcon
                onClick={() => duplicateRow(row)}
                sx={{
                  cursor: 'pointer',
                }}
              />
            )}
          </Box>
        ) : null
      },
    },
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
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderCheckBox(row.numExists, true)
      },
    },
    {
      field: 'numMissing',
      headerName: t('volume_overview.missing_number'),
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderCheckBox(row.numMissing, true)
      },
    },
    {
      field: 'number',
      headerName: t('volume_overview.number'),
      type: 'number',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderValue(row.number, row.numExists && !row.isAttachment)
      },
    },
    {
      field: 'attachmentNumber',
      headerName: t('volume_overview.attachment_number'),
      type: 'number',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderValue(
          row.attachmentNumber,
          row.numExists && row.isAttachment
        )
      },
      // renderEditCell: renderAttachmentNumberEditCell,
    },
    {
      field: 'mutationId',
      headerName: t('volume_overview.mutation'),
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderValue(
          mutations.find((m) => m.id === row.mutationId)?.name[languageCode],
          row.numExists
        )
      },
      valueOptions: mutations.map((v) => ({
        value: v.id,
        label: v.name[languageCode],
      })),
      type: 'singleSelect',
    },
    {
      field: 'publicationId',
      headerName: t('volume_overview.publication'),
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderValue(
          publications.find((m) => m.id === row.publicationId)?.name[
            languageCode
          ],
          row.numExists
        )
      },
      valueOptions: publications.map((v) => ({
        value: v.id,
        label: v.name[languageCode],
      })),
      type: 'singleSelect',
    },
    {
      field: 'name',
      type: 'string',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderValue(row.name, row.numExists)
      },
      headerName: t('volume_overview.name'),
    },
    {
      field: 'subName',
      type: 'string',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderValue(row.subName, row.numExists)
      },
      headerName: t('volume_overview.sub_name'),
    },
    {
      field: 'pagesCount',
      type: 'number',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderValue(row.pagesCount, row.numExists)
      },
      headerName: t('volume_overview.pages_count'),
    },
    {
      /* bug fix, with the right name it hasn't updated value */
      field: 'publicationMark2',
      type: 'string',
      headerName: t('volume_overview.publication_mark'),
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderValue(row.publicationMark, row.numExists)
      },
      renderEditCell: renderPublicationMarkEditCell,
    },
    {
      field: 'OK',
      headerName: t('facet_states.OK'),
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderCheckBox(
          !!row.damageTypes?.includes('OK'),
          row.numExists,
          'success'
        )
      },
      renderEditCell: renderDamageTypesEditCell,
    },
    {
      field: 'PP',
      headerName: t('facet_states.PP'),
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderCheckBox(!!row.damageTypes?.includes('PP'), row.numExists)
      },
      renderEditCell: renderDamagedAndMissingPagesEditCell,
    },
    {
      field: 'Deg',
      headerName: t('facet_states.Deg'),
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderCheckBox(!!row.damageTypes?.includes('Deg'), row.numExists)
      },
      renderEditCell: renderDamageTypesEditCell,
    },
    {
      field: 'ChS',
      headerName: t('facet_states.ChS'),
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderCheckBox(!!row.damageTypes?.includes('ChS'), row.numExists)
      },
      renderEditCell: renderDamagedAndMissingPagesEditCell,
    },
    {
      field: 'ChPag',
      headerName: t('facet_states.ChPag'),
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderCheckBox(
          !!row.damageTypes?.includes('ChPag'),
          row.numExists
        )
      },
      renderEditCell: renderDamageTypesEditCell,
    },
    {
      field: 'ChDatum',
      headerName: t('facet_states.ChDatum'),
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderCheckBox(
          !!row.damageTypes?.includes('ChDatum'),
          row.numExists
        )
      },
      renderEditCell: renderDamageTypesEditCell,
    },
    {
      field: 'ChCis',
      headerName: t('facet_states.ChCis'),
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderCheckBox(
          !!row.damageTypes?.includes('ChCis'),
          row.numExists
        )
      },
      renderEditCell: renderDamageTypesEditCell,
    },
    {
      field: 'ChSv',
      headerName: t('facet_states.ChSv'),
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderCheckBox(
          !!row.damageTypes?.includes('ChSv'),
          row.numExists
        )
      },
      renderEditCell: renderDamageTypesEditCell,
    },
    {
      field: 'Cz',
      headerName: t('facet_states.Cz'),
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderCheckBox(!!row.damageTypes?.includes('Cz'), row.numExists)
      },
      renderEditCell: renderDamageTypesEditCell,
    },
    {
      field: 'note',
      type: 'string',
      flex: 1,
      minWidth: 180,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderValue(row.note, row.numExists)
      },
      headerName: t('volume_overview.note'),
      editable: canEdit,
    },
  ]

  const handleUpdate = (newRow: TEditableSpecimen) => {
    // console.log(newRow)
    specimenActions.setSpecimen(newRow)
    return newRow
  }

  const isCellEditable = (params: GridCellParams<TEditableSpecimen>) => {
    const { row, field } = params
    if (field === 'numExists') {
      return canEdit && !row.numMissing
    }
    if (field === 'numMissing') {
      return canEdit && !row.numExists
    }
    if (field === 'publicationDate' || !row.numExists) {
      return false
    }
    if (field === 'number') {
      return canEdit && !row.isAttachment
    }
    if (field === 'attachmentNumber') {
      return canEdit && row.isAttachment
    }

    return canEdit
  }

  return (
    <StripedDataGrid
      localeText={MuiTableLocale}
      density="compact"
      getRowClassName={(params) => {
        let classes =
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        if (params.row.isAttachment) {
          classes += ' attachment'
        }
        return classes
      }}
      rows={sortedSpecimensState}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 100,
            page: 0,
          },
        },
        density: 'compact',
      }}
      pageSizeOptions={[100]}
      disableRowSelectionOnClick
      isCellEditable={isCellEditable}
      processRowUpdate={handleUpdate}
    />
  )
}

export default Table
