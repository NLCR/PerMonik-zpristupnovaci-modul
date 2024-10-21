import React, {
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import {
  gridClasses,
  GridColDef,
  GridRenderCellParams,
  DataGridPro,
  GridColumnHeaderParams,
  useGridApiRef,
  GridApiPro,
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
import { blue } from '@mui/material/colors'
import {
  TEditableSpecimen,
  TSpecimenDamageTypes,
} from '../../../schema/specimen'
import { useVolumeManagementStore } from '../../../slices/useVolumeManagementStore'
import { TMutation } from '../../../schema/mutation'
import { TEdition } from '../../../schema/edition'
import DamagedAndMissingPagesEditCell from './editCells/DamagedAndMissingPagesEditCell'
import DamageTypesEditCell from './editCells/DamageTypesEditCell'
import MutationMarkSelectorModalContainer from './editCells/MutationMarkSelectorModalContainer'
import RenumberableValueCell from './editCells/RenumberableValueCell'
import HeaderWithColumnAction from './editCells/HeaderWithColumnAction'
import { useSearchParams } from 'react-router-dom'
import { JUMP_TO_SPECIMEN_WITH_ID } from '../../../utils/constants'
import { useLanguageCode } from '../../../hooks/useLanguageCode'
import { useMuiTableLang } from '../../../hooks/useMuiTableLang'
import {
  checkAttachmentChange,
  copySpecimen,
  filterSpecimen,
} from '../../../utils/specimen'
import { validate as uuidValidate } from 'uuid'
import TableHeader from './TableHeader'

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
    <Box
      sx={(theme) => ({
        color: canEdit ? theme.palette.grey[900] : theme.palette.grey[600],
      })}
    >
      {value}
    </Box>
  ) : null
}

const renderRenumberableValue = (
  row: TEditableSpecimen,
  show: boolean,
  canEdit: boolean,
  type: 'number' | 'attachmentNumber',
  apiRef: MutableRefObject<GridApiPro>
) => {
  return (
    <RenumberableValueCell
      row={row}
      show={show}
      canEdit={canEdit}
      type={type}
      apiRef={apiRef}
    />
  )
}

const renderHeaderWithColumnAction = (
  field: TSpecimenDamageTypes,
  canEdit: boolean,
  apiRef: MutableRefObject<GridApiPro>
) => {
  return (
    <HeaderWithColumnAction field={field} canEdit={canEdit} apiRef={apiRef} />
  )
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

const renderMutationMarkEditCell = (
  params: GridRenderEditCellParams<TEditableSpecimen>
) => {
  return <MutationMarkSelectorModalContainer {...params} />
}

interface TableProps {
  canEdit: boolean
  mutations: TMutation[]
  editions: TEdition[]
}

const Table: FC<TableProps> = ({ canEdit, mutations, editions }) => {
  const { languageCode } = useLanguageCode()
  const { MuiTableLocale } = useMuiTableLang()
  const { t } = useTranslation()
  const apiRef = useGridApiRef()

  const [searchParams] = useSearchParams()

  const scrolledToRow = useRef<boolean>(false)

  const specimensState = useVolumeManagementStore(
    (state) => state.specimensState
  )
  const specimenActions = useVolumeManagementStore(
    (state) => state.specimensActions
  )

  useEffect(() => {
    const timeout = undefined
    if (
      !scrolledToRow.current &&
      apiRef.current &&
      uuidValidate(searchParams.get(JUMP_TO_SPECIMEN_WITH_ID) || '')
    ) {
      const rowIndex = specimensState.findIndex(
        (s) => s.id === searchParams.get(JUMP_TO_SPECIMEN_WITH_ID)
      )

      if (rowIndex >= 0) {
        setTimeout(() => {
          apiRef.current.scrollToIndexes({ rowIndex: rowIndex })
          scrolledToRow.current = true
        }, 250)
      }
    }
    return () => clearTimeout(timeout)
  }, [apiRef, searchParams, specimensState])

  const duplicateRow = useCallback(
    (row: TEditableSpecimen) => {
      const specimensStateClone = clone(specimensState)
      const copiedSpecimen = copySpecimen(row)
      const originalSpecimenIndex = specimensState.findIndex(
        (s) => s.id === row.id
      )

      if (originalSpecimenIndex >= 0) {
        specimensStateClone.splice(originalSpecimenIndex + 1, 0, copiedSpecimen)
        specimenActions.setSpecimensState(specimensStateClone, true)
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
        specimenActions.setSpecimensState(specimensStateClone, true)
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
      filterable: false,
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
      filterable: false,
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
      filterable: false,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderCheckBox(row.numMissing, true, canEdit)
      },
    },
    {
      field: 'number',
      headerName: t('volume_overview.number'),
      editable: canEdit,
      filterable: false,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderRenumberableValue(
          row,
          (row.numExists || row.numMissing) && !row.isAttachment,
          canEdit,
          'number',
          apiRef
        )
      },
    },
    {
      field: 'attachmentNumber',
      headerName: t('volume_overview.attachment_number'),
      editable: canEdit,
      filterable: false,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderRenumberableValue(
          row,
          (row.numExists || row.numMissing) && row.isAttachment,
          canEdit,
          'attachmentNumber',
          apiRef
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
      field: 'editionId',
      headerName: t('volume_overview.edition'),
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderValue(
          editions.find((m) => m.id === row.editionId)?.name[languageCode],
          row.numExists,
          canEdit
        )
      },
      valueOptions: editions.map((v) => ({
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
      filterable: false,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderValue(row.pagesCount, row.numExists, canEdit)
      },
      headerName: t('volume_overview.pages_count'),
    },
    {
      /* bug fix, with the right name it hasn't updated value */
      field: 'mutationMark2',
      type: 'string',
      headerName: t('volume_overview.mutation_mark'),
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderValue(row.mutationMark, row.numExists, canEdit)
      },
      renderEditCell: renderMutationMarkEditCell,
    },
    {
      field: 'OK',
      renderHeader: (params: GridColumnHeaderParams<TEditableSpecimen>) => {
        const { field } = params
        return renderHeaderWithColumnAction(
          field as TSpecimenDamageTypes,
          canEdit,
          apiRef
        )
      },
      type: 'boolean',
      editable: canEdit,
      filterable: false,
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
      filterable: false,
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
          canEdit,
          apiRef
        )
      },
      type: 'boolean',
      editable: canEdit,
      filterable: false,
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
      filterable: false,
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
      filterable: false,
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
      filterable: false,
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
      filterable: false,
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
      filterable: false,
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
          canEdit,
          apiRef
        )
      },
      type: 'boolean',
      editable: canEdit,
      filterable: false,
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
      filterable: false,
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
      filterable: false,
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
        return (
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
        )
      },
    })
  }

  const handleUpdate = (newRow: TEditableSpecimen) => {
    const row = checkAttachmentChange(editions, newRow)
    // console.log(row)
    specimenActions.setSpecimen(row)
    return filterSpecimen(row)
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
    <>
      <TableHeader />
      <StripedDataGrid
        apiRef={apiRef}
        localeText={MuiTableLocale}
        getRowClassName={(params) => {
          let classes =
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          if (params.row.isAttachment) {
            classes += ' attachment'
          }
          return classes
        }}
        rows={specimensState}
        columns={columns}
        initialState={{
          density: 'compact',
          pinnedColumns: { left: ['publicationDate'] },
        }}
        disableRowSelectionOnClick
        disableColumnSorting
        isCellEditable={isCellEditable}
        processRowUpdate={handleUpdate}
        hideFooter
      />
    </>
  )
}

export default Table
