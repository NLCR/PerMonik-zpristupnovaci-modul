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
import Tooltip from '@mui/material/Tooltip'

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
  ['& .MuiDataGrid-columnHeader']: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 4,
    paddingRight: 4,
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
  apiRef: MutableRefObject<GridApiPro>,
  headerName: string,
  description: string
) => {
  return (
    <HeaderWithColumnAction
      field={field}
      canEdit={canEdit}
      apiRef={apiRef}
      headerName={headerName}
      description={description}
    />
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
      width: 110,
      filterable: false,
      headerAlign: 'center',
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
      renderHeader: () => (
        <Tooltip title={t('volume_overview.is_in_volume')}>
          <Box
            dangerouslySetInnerHTML={{
              __html: t('volume_overview.is_in_volume_short'),
            }}
          />
        </Tooltip>
      ),
      width: 50,
      type: 'boolean',
      editable: canEdit,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderCheckBox(row.numExists, true, canEdit)
      },
    },
    {
      field: 'numMissing',
      renderHeader: () => (
        <Tooltip title={t('volume_overview.missing_number')}>
          <Box
            dangerouslySetInnerHTML={{
              __html: t('volume_overview.missing_number_short'),
            }}
          />
        </Tooltip>
      ),
      width: 50,
      type: 'boolean',
      editable: canEdit,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderCheckBox(row.numMissing, true, canEdit)
      },
    },
    {
      field: 'number',
      renderHeader: () => (
        <Tooltip title={t('volume_overview.number')}>
          <Box
            dangerouslySetInnerHTML={{
              __html: t('volume_overview.number_short'),
            }}
          />
        </Tooltip>
      ),
      width: 50,
      editable: canEdit,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
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
      renderHeader: () => (
        <Tooltip title={t('volume_overview.attachment_number')}>
          <Box
            dangerouslySetInnerHTML={{
              __html: t('volume_overview.attachment_number_short'),
            }}
          />
        </Tooltip>
      ),
      width: 60,
      editable: canEdit,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
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
      renderHeader: () => (
        <Tooltip title={t('volume_overview.mutation')}>
          <Box
            dangerouslySetInnerHTML={{
              __html: t('volume_overview.mutation_short'),
            }}
          />
        </Tooltip>
      ),
      width: 60,
      editable: canEdit,
      headerAlign: 'center',
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
      renderHeader: () => (
        <Tooltip title={t('volume_overview.edition')}>
          <Box
            dangerouslySetInnerHTML={{
              __html: t('volume_overview.edition_short'),
            }}
          />
        </Tooltip>
      ),
      width: 50,
      editable: canEdit,
      headerAlign: 'center',
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
      renderHeader: () => (
        <Tooltip title={t('volume_overview.name')}>
          <Box
            dangerouslySetInnerHTML={{
              __html: t('volume_overview.name_short'),
            }}
          />
        </Tooltip>
      ),
      type: 'string',
      editable: canEdit,
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderValue(row.name, row.numExists, canEdit)
      },
      // width: 1,
    },
    {
      field: 'subName',
      renderHeader: () => (
        <Tooltip title={t('volume_overview.sub_name')}>
          <Box
            dangerouslySetInnerHTML={{
              __html: t('volume_overview.sub_name_short'),
            }}
          />
        </Tooltip>
      ),
      type: 'string',
      editable: canEdit,
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderValue(row.subName, row.numExists, canEdit)
      },
      // width: 1,
    },
    {
      field: 'pagesCount',
      renderHeader: () => (
        <Tooltip title={t('volume_overview.pages_count')}>
          <Box
            dangerouslySetInnerHTML={{
              __html: t('volume_overview.pages_count_short'),
            }}
          />
        </Tooltip>
      ),
      editable: canEdit,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderValue(row.pagesCount, row.numExists, canEdit)
      },
      width: 50,
    },
    {
      /* bug fix, with the right name it hasn't updated value */
      field: 'mutationMark2',
      renderHeader: () => (
        <Tooltip title={t('volume_overview.mutation_mark')}>
          <Box
            dangerouslySetInnerHTML={{
              __html: t('volume_overview.mutation_mark_short'),
            }}
          />
        </Tooltip>
      ),
      type: 'string',
      width: 60,
      editable: canEdit,
      headerAlign: 'center',
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
          apiRef,
          t('facet_states_short.OK'),
          t('facet_states_short.OK_tooltip')
        )
      },
      type: 'boolean',
      editable: canEdit,
      filterable: false,
      disableColumnMenu: true,
      width: 52,
      headerAlign: 'center',
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
      renderHeader: () => (
        <Tooltip title={t('facet_states_short.PP_tooltip')}>
          <Box
            dangerouslySetInnerHTML={{
              __html: t('facet_states_short.PP'),
            }}
          />
        </Tooltip>
      ),
      width: 52,
      type: 'boolean',
      editable: canEdit,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
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
          apiRef,
          t('facet_states_short.Deg'),
          t('facet_states_short.Deg_tooltip')
        )
      },
      type: 'boolean',
      editable: canEdit,
      filterable: false,
      disableColumnMenu: true,
      width: 52,
      headerAlign: 'center',
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
      renderHeader: () => (
        <Tooltip title={t('facet_states_short.ChS_tooltip')}>
          <Box
            dangerouslySetInnerHTML={{
              __html: t('facet_states_short.ChS'),
            }}
          />
        </Tooltip>
      ),
      width: 52,
      type: 'boolean',
      editable: canEdit,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
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
      renderHeader: () => (
        <Tooltip title={t('facet_states_short.ChPag_tooltip')}>
          <Box
            dangerouslySetInnerHTML={{
              __html: t('facet_states_short.ChPag'),
            }}
          />
        </Tooltip>
      ),
      width: 52,
      type: 'boolean',
      editable: canEdit,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
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
      renderHeader: () => (
        <Tooltip title={t('facet_states_short.ChDatum_tooltip')}>
          <Box
            dangerouslySetInnerHTML={{
              __html: t('facet_states_short.ChDatum'),
            }}
          />
        </Tooltip>
      ),
      width: 52,
      type: 'boolean',
      editable: canEdit,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
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
      renderHeader: () => (
        <Tooltip title={t('facet_states_short.ChCis_tooltip')}>
          <Box
            dangerouslySetInnerHTML={{
              __html: t('facet_states_short.ChCis'),
            }}
          />
        </Tooltip>
      ),
      width: 52,
      type: 'boolean',
      editable: canEdit,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
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
      renderHeader: () => (
        <Tooltip title={t('facet_states_short.ChSv_tooltip')}>
          <Box
            dangerouslySetInnerHTML={{
              __html: t('facet_states_short.ChSv'),
            }}
          />
        </Tooltip>
      ),
      width: 52,
      type: 'boolean',
      editable: canEdit,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
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
          apiRef,
          t('facet_states_short.NS'),
          t('facet_states_short.NS_tooltip')
        )
      },
      type: 'boolean',
      editable: canEdit,
      filterable: false,
      disableColumnMenu: true,
      width: 52,
      headerAlign: 'center',
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
      renderHeader: () => (
        <Tooltip title={t('facet_states_short.Cz_tooltip')}>
          <Box
            dangerouslySetInnerHTML={{
              __html: t('facet_states_short.Cz'),
            }}
          />
        </Tooltip>
      ),
      width: 52,
      type: 'boolean',
      editable: canEdit,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
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
      // width: 100,
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return renderValue(row.note, row.numExists, canEdit)
      },
      headerName: t('volume_overview.note'),
      editable: canEdit,
      filterable: false,
      disableColumnMenu: true,
    },
  ]

  if (canEdit) {
    columns.unshift({
      field: 'newRow',
      renderHeader: () => (
        <Tooltip title={t('volume_overview.new_row')}>
          <Box
            sx={{
              cursor: 'pointer',
            }}
            dangerouslySetInnerHTML={{
              __html: t('volume_overview.new_row_short'),
            }}
          />
        </Tooltip>
      ),
      width: 40,
      hideable: false,
      pinnable: false,
      disableColumnMenu: true,
      sortable: false,
      filterable: false,
      headerAlign: 'center',
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
      <TableHeader apiRef={apiRef} />
      <StripedDataGrid
        columnHeaderHeight={65}
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
