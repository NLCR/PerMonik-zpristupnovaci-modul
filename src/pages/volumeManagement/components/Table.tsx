import React, { FC, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import {
  gridClasses,
  GridColDef,
  GridRenderCellParams,
  DataGridPro,
  GridColumnHeaderParams,
} from '@mui/x-data-grid-pro'
import Box from '@mui/material/Box'
import { alpha, styled } from '@mui/material/styles'
import Checkbox from '@mui/material/Checkbox'
import {
  GridCellParams,
  GridRenderEditCellParams,
} from '@mui/x-data-grid/models/params/gridCellParams'
import clone from 'lodash/clone'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import Typography from '@mui/material/Typography'
import { blue } from '@mui/material/colors'
import {
  duplicateSpecimen,
  filterSpecimen,
  TEditableSpecimen,
  TSpecimenDamageTypes,
} from '../../../schema/specimen'
import { useLanguageCode, useMuiTableLang } from '../../../utils/helperHooks'
import { useVolumeManagementStore } from '../../../slices/useVolumeManagementStore'
import { TMutation } from '../../../schema/mutation'
import { TPublication } from '../../../schema/publication'
import DamagedAndMissingPagesEditCell from './editCells/DamagedAndMissingPagesEditCell'
import DamageTypesEditCell from './editCells/DamageTypesEditCell'
import PublicationMarkSelectorModalContainer from './editCells/PublicationMarkSelectorModalContainer'
import RenumberableValueCell from './editCells/RenumberableValueCell'
import HeaderWithColumnAction from './editCells/HeaderWithColumnAction'

const ODD_OPACITY = 0.2

const StripedDataGrid = styled(DataGridPro)(({ theme }) => ({
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
  [`& .${gridClasses.row}`]: {
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
  },
  [`& .${gridClasses.row}.attachment`]: {
    backgroundColor: blue[100],
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
  },
})) as typeof DataGridPro

const renderCheckBox = (
  checked: boolean,
  show: boolean,
  canEdit: boolean,
  color: 'primary' | 'success' = 'primary'
) => {
  return show ? (
    <Checkbox color={color} checked={checked} readOnly disabled={!canEdit} />
  ) : null
}

const renderValue = (
  value: string | number | undefined | null,
  show: boolean,
  canEdit: boolean
) => {
  return show ? (
    <Typography
      sx={(theme) => ({
        fontSize: '14px',
        width: 'auto',
        lineHeight: '2.5',
        color: canEdit ? theme.palette.grey[900] : theme.palette.grey[600],
      })}
    >
      {value}
    </Typography>
  ) : null
}

const renderRenumberableValue = (
  row: TEditableSpecimen,
  show: boolean,
  canEdit: boolean,
  type: 'number' | 'attachmentNumber'
) => {
  return (
    <RenumberableValueCell
      row={row}
      show={show}
      canEdit={canEdit}
      type={type}
    />
  )
}

const renderHeaderWithColumnAction = (
  field: TSpecimenDamageTypes,
  canEdit: boolean
) => {
  return <HeaderWithColumnAction field={field} canEdit={canEdit} />
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

  // TODO: https://github.com/mui/mui-x/issues/7799 https://github.com/NLCR/evidence.periodik/issues/239
  // useEffect(() => {
  //   const allRows = gridPaginatedVisibleSortedGridRowEntriesSelector(apiRef)
  //   const rowIndex = allRows.findIndex(
  //     (row) => row.id === 'auto-generated-row-company/Paramount Pictures'
  //   )
  //   apiRef.current.scrollToIndexes({ rowIndex })
  // }, [])

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
      field: 'publicationDate',
      headerName: t('table.publication_date'),
      flex: 1,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderValue(
          dayjs(row.publicationDate).format('dd DD.MM.YYYY'),
          true,
          canEdit
        )
      },
    },
    {
      field: 'numExists',
      headerName: t('volume_overview.is_in_volume'),
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderCheckBox(row.numExists, true, canEdit)
      },
    },
    {
      field: 'numMissing',
      headerName: t('volume_overview.missing_number'),
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderCheckBox(row.numMissing, true, canEdit)
      },
    },
    {
      field: 'number',
      headerName: t('volume_overview.number'),
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderRenumberableValue(
          row,
          (row.numExists || row.numMissing) && !row.isAttachment,
          canEdit,
          'number'
        )
      },
    },
    {
      field: 'attachmentNumber',
      headerName: t('volume_overview.attachment_number'),
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderValue(
          row.attachmentNumber,
          row.numExists && row.isAttachment,
          canEdit
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
          row.numExists,
          canEdit
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
          row.numExists,
          canEdit
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
        return renderValue(row.name, row.numExists, canEdit)
      },
      headerName: t('volume_overview.name'),
    },
    {
      field: 'subName',
      type: 'string',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderValue(row.subName, row.numExists, canEdit)
      },
      headerName: t('volume_overview.sub_name'),
    },
    {
      field: 'pagesCount',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderValue(row.pagesCount, row.numExists, canEdit)
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
        return renderValue(row.publicationMark, row.numExists, canEdit)
      },
      renderEditCell: renderPublicationMarkEditCell,
    },
    {
      field: 'OK',
      renderHeader: (params: GridColumnHeaderParams<TEditableSpecimen>) => {
        const { field } = params
        return renderHeaderWithColumnAction(
          field as TSpecimenDamageTypes,
          canEdit
        )
      },
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderCheckBox(
          !!row.damageTypes?.includes('OK'),
          row.numExists,
          canEdit,
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
        return renderCheckBox(
          !!row.damageTypes?.includes('PP'),
          row.numExists,
          canEdit
        )
      },
      renderEditCell: renderDamagedAndMissingPagesEditCell,
    },
    {
      field: 'Deg',
      renderHeader: (params: GridColumnHeaderParams<TEditableSpecimen>) => {
        const { field } = params
        return renderHeaderWithColumnAction(
          field as TSpecimenDamageTypes,
          canEdit
        )
      },
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderCheckBox(
          !!row.damageTypes?.includes('Deg'),
          row.numExists,
          canEdit
        )
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
        return renderCheckBox(
          !!row.damageTypes?.includes('ChS'),
          row.numExists,
          canEdit
        )
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
          row.numExists,
          canEdit
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
          row.numExists,
          canEdit
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
          row.numExists,
          canEdit
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
          row.numExists,
          canEdit
        )
      },
      renderEditCell: renderDamageTypesEditCell,
    },
    {
      field: 'NS',
      renderHeader: (params: GridColumnHeaderParams<TEditableSpecimen>) => {
        const { field } = params
        return renderHeaderWithColumnAction(
          field as TSpecimenDamageTypes,
          canEdit
        )
      },
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderCheckBox(
          !!row.damageTypes?.includes('NS'),
          row.numExists,
          canEdit
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
        return renderCheckBox(
          !!row.damageTypes?.includes('Cz'),
          row.numExists,
          canEdit
        )
      },
      renderEditCell: renderDamageTypesEditCell,
    },
    {
      field: 'note',
      type: 'string',
      minWidth: 180,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderValue(row.note, row.numExists, canEdit)
      },
      headerName: t('volume_overview.note'),
      editable: canEdit,
    },
  ]

  if (canEdit) {
    columns.unshift({
      field: 'newRow',
      headerName: t('volume_overview.new_row'),
      flex: 1,
      hideable: false,
      sortable: false,
      filterable: false,
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
    })
  }

  const handleUpdate = (newRow: TEditableSpecimen) => {
    // console.log(newRow)
    specimenActions.setSpecimen(newRow)
    return filterSpecimen(newRow)
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
        density: 'compact',
        pinnedColumns: { left: ['publicationDate'] },
      }}
      disableRowSelectionOnClick
      disableColumnSorting
      isCellEditable={isCellEditable}
      processRowUpdate={handleUpdate}
    />
  )
}

export default Table
