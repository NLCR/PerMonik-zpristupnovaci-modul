import React, { ChangeEvent, FC, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import {
  DataGrid,
  gridClasses,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid'
import { alpha, Box, Button, Checkbox, Modal, Typography } from '@mui/material'
import {
  GridCellParams,
  GridRenderEditCellParams,
} from '@mui/x-data-grid/models/params/gridCellParams'
import { clone } from 'lodash-es'
import CheckIcon from '@mui/icons-material/Check'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { styled } from '@mui/material/styles'
import {
  duplicateSpecimen,
  TEditableSpecimen,
  TSpecimenDamageTypes,
} from '../../../schema/specimen'
import { useLanguageCode, useMuiTableLang } from '../../../utils/helperHooks'
import { useVolumeManagementStore } from '../../../slices/useVolumeManagementStore'
import { TMutation } from '../../../schema/mutation'
import { TPublication } from '../../../schema/publication'
import PublicationMarkSelectorModal from '../../specimensOverview/components/PublicationMarkSelectorModal'

function createArrayOfNumbers(n: number): number[] {
  // TODO: when changing pagesCount, watch for damaged and missing pages with number larger then pagesCount and delete them
  return Array.from({ length: n }, (_, i) => i + 1)
}

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

const EditModal = ({
  field,
  open,
  onClose,
  row,
  onSave,
}: {
  field: TSpecimenDamageTypes
  open: boolean
  onClose: () => void
  row: TEditableSpecimen
  onSave: (data: TEditableSpecimen) => void
}) => {
  const { t } = useTranslation()
  const [damageTypes, setDamageTypes] = useState(row.damageTypes || [])
  const [damagedPages, setDamagedPages] = useState(row.damagedPages || [])
  const [missingPages, setMissingPages] = useState(row.missingPages || [])

  const handleDamageTypeChange = (
    type: TSpecimenDamageTypes,
    isChecked: boolean
  ) => {
    const newDamageTypes = isChecked
      ? [...damageTypes, type]
      : damageTypes.filter((dt) => dt !== type)
    if (field === 'PP' && !isChecked) {
      setDamagedPages([])
    }
    if (field === 'ChS' && !isChecked) {
      setDamagedPages([])
    }
    setDamageTypes(newDamageTypes)
  }

  const handlePagesChange = (
    page: number,
    type: TSpecimenDamageTypes,
    isChecked: boolean
  ) => {
    let arrayForEdit = type === 'PP' ? clone(damagedPages) : clone(missingPages)

    if (isChecked) {
      arrayForEdit.push(page)
    } else {
      arrayForEdit = arrayForEdit.filter((p) => p !== page)
    }

    if (type === 'PP') {
      setDamagedPages(arrayForEdit)
    } else {
      setMissingPages(arrayForEdit)
    }
  }

  const handleSave = () => {
    onSave({ ...row, damageTypes, damagedPages, missingPages })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 2,
          backgroundColor: 'white',
          borderRadius: 2,
          maxWidth: 400,
          mx: 'auto',
          my: '20%',
        }}
      >
        <Box>
          {field === 'PP' ? (
            <>
              <Typography variant="h6">{t('facet_states.PP')}</Typography>
              <Typography>
                {t('common.yes')}
                <Checkbox
                  checked={damageTypes.includes('PP')}
                  onChange={(event) =>
                    handleDamageTypeChange('PP', event.target.checked)
                  }
                />
              </Typography>
              <Typography>{t('table.pages')}</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {createArrayOfNumbers(row.pagesCount).map((page) => {
                  return (
                    <Typography key={`damaged-pages-${page}`}>
                      {page}
                      <Checkbox
                        disabled={!damageTypes.some((dt) => dt === 'PP')}
                        checked={damagedPages.some((dp) => dp === page)}
                        onChange={(event) =>
                          handlePagesChange(page, 'PP', event.target.checked)
                        }
                      />
                    </Typography>
                  )
                })}
              </Box>
            </>
          ) : null}
          {field === 'ChS' ? (
            <>
              <Typography variant="h6">{t('facet_states.ChS')}</Typography>
              <Typography>
                {t('common.yes')}
                <Checkbox
                  checked={damageTypes.includes('ChS')}
                  onChange={(event) =>
                    handleDamageTypeChange('ChS', event.target.checked)
                  }
                />
              </Typography>
              <Typography>{t('table.pages')}</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {createArrayOfNumbers(row.pagesCount).map((page) => {
                  return (
                    <Typography key={`missing-pages-${page}`}>
                      {page}
                      <Checkbox
                        disabled={!damageTypes.some((dt) => dt === 'ChS')}
                        checked={missingPages.some((dp) => dp === page)}
                        onChange={(event) =>
                          handlePagesChange(page, 'ChS', event.target.checked)
                        }
                      />
                    </Typography>
                  )
                })}
              </Box>
            </>
          ) : null}
        </Box>
        <Button onClick={handleSave}>{t('administration.save')}</Button>
      </Box>
    </Modal>
  )
}

const DamageTypesEditCellWithModal = (
  props: GridRenderEditCellParams<TEditableSpecimen>
) => {
  const { field, row, api } = props
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const handleSave = (updatedRow: TEditableSpecimen) => {
    api.updateRows([updatedRow])
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        {t('administration.update')}
      </Button>
      <EditModal
        field={field as TSpecimenDamageTypes}
        open={open}
        onClose={() => setOpen(false)}
        row={row}
        onSave={handleSave}
      />
    </>
  )
}

const renderDamageTypesInputCellWithModal = (
  params: GridRenderEditCellParams<TEditableSpecimen>
) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <DamageTypesEditCellWithModal {...params} />
}

const DamageTypesEditCell = (
  props: GridRenderEditCellParams<TEditableSpecimen>
) => {
  const { field, row, api } = props

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked
    const currentDamageTypes = row.damageTypes || []

    const newDamageTypes = isChecked
      ? [...currentDamageTypes, field as TSpecimenDamageTypes]
      : currentDamageTypes.filter((dt) => dt !== field)

    const updatedRow = { ...row, damageTypes: newDamageTypes }
    api.updateRows([updatedRow])
  }

  return (
    <Checkbox
      onChange={handleChange}
      checked={row.damageTypes?.some((dt) => dt === field)}
    />
  )
}

const renderDamageTypesInputCell = (
  params: GridRenderEditCellParams<TEditableSpecimen>
) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <DamageTypesEditCell {...params} />
}

const PublicationMarkSelectorModalContainer = (
  props: GridRenderEditCellParams<TEditableSpecimen>
) => {
  const { row, api } = props
  const [modalOpened, setModalOpened] = useState(false)
  const { t } = useTranslation()

  const handleSave = (updatedRow: TEditableSpecimen) => {
    api.updateRows([updatedRow])
    // setModalOpened(false)
  }

  useEffect(() => {
    setModalOpened(true)
  }, [])

  return (
    <>
      <Button onClick={() => setModalOpened(true)}>
        {t('administration.update')}
      </Button>
      <PublicationMarkSelectorModal
        row={row}
        open={modalOpened}
        onClose={() => setModalOpened(false)}
        onSave={(data) => handleSave(data as TEditableSpecimen)}
      />
    </>
  )
}

const renderPublicationMarkInputCell = (
  params: GridRenderEditCellParams<TEditableSpecimen>
) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
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

  const sortedSpecimensState = clone(specimensState)

  if (showAttachmentsAtTheEnd) {
    sortedSpecimensState.sort((a, b) => {
      if (a.isAttachment && !b.isAttachment) return 1
      if (!a.isAttachment && b.isAttachment) return -1
      return 0 // Keep the original order if both are attachments or both are not
    })
  }

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
        return CenteredIcon(canEdit && !row.numMissing && row.numExists)
      },
    },
    {
      field: 'numMissing',
      headerName: t('volume_overview.missing_number'),
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return CenteredIcon(canEdit && !row.numExists && row.numMissing)
      },
    },
    {
      field: 'number',
      headerName: t('volume_overview.number'),
      type: 'number',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return row.numExists && !row.isAttachment ? row.number : null
      },
      // TODO: edit cell, call on editEnd
      // renderEditCell: (params: GridRenderEditCellParams<TEditableSpecimen>) => {
      //   const { row, api } = params
      //
      //   return (
      //     <TextField
      //       size="small"
      //       value={row.number}
      //       onChange={(event) => {
      //         api.updateRows([
      //           { ...row, number: event.target.value.replace(/\D/g, '') },
      //         ])
      //       }}
      //     />
      //   )
      // },
    },
    {
      field: 'attachmentNumber',
      headerName: t('volume_overview.attachment_number'),
      type: 'number',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return row.isAttachment ? row.number : null
      },
      // TODO: edit cell, call on editEnd
      // renderEditCell: (params: GridRenderEditCellParams<TEditableSpecimen>) => {
      //   const { row, api } = params
      //
      //   return (
      //     <TextField
      //       size="small"
      //       value={row.number}
      //       onChange={(event) => {
      //         api.updateRows([
      //           { ...row, number: event.target.value.replace(/\D/g, '') },
      //         ])
      //       }}
      //     />
      //   )
      // },
    },
    {
      field: 'mutationId',
      headerName: t('volume_overview.mutation'),
      editable: canEdit,
      valueFormatter: (value) => {
        return mutations.find((m) => m.id === value)?.name[languageCode]
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
      valueFormatter: (value) => {
        return publications.find((m) => m.id === value)?.name[languageCode]
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
      headerName: t('volume_overview.name'),
    },
    {
      field: 'subName',
      type: 'string',
      editable: canEdit,
      headerName: t('volume_overview.sub_name'),
    },
    {
      field: 'pagesCount',
      type: 'number',
      editable: canEdit,
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
        return row.publicationMark
      },
      renderEditCell: renderPublicationMarkInputCell,
    },
    {
      field: 'OK',
      headerName: t('facet_states.OK'),
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return CenteredIcon(!!row.damageTypes?.includes('OK'))
      },
      renderEditCell: renderDamageTypesInputCell,
    },
    {
      field: 'PP',
      headerName: t('facet_states.PP'),
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return CenteredIcon(!!row.damageTypes?.includes('PP'))
      },
      renderEditCell: renderDamageTypesInputCellWithModal,
    },
    {
      field: 'Deg',
      headerName: t('facet_states.Deg'),
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return CenteredIcon(!!row.damageTypes?.includes('Deg'))
      },
      renderEditCell: renderDamageTypesInputCell,
    },
    {
      field: 'ChS',
      headerName: t('facet_states.ChS'),
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return CenteredIcon(!!row.damageTypes?.includes('ChS'))
      },
      renderEditCell: renderDamageTypesInputCellWithModal,
    },
    {
      field: 'ChPag',
      headerName: t('facet_states.ChPag'),
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return CenteredIcon(!!row.damageTypes?.includes('ChPag'))
      },
      renderEditCell: renderDamageTypesInputCell,
    },
    {
      field: 'ChDatum',
      headerName: t('facet_states.ChDatum'),
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return CenteredIcon(!!row.damageTypes?.includes('ChDatum'))
      },
      renderEditCell: renderDamageTypesInputCell,
    },
    {
      field: 'ChCis',
      headerName: t('facet_states.ChCis'),
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return CenteredIcon(!!row.damageTypes?.includes('ChCis'))
      },
      renderEditCell: renderDamageTypesInputCell,
    },
    {
      field: 'ChSv',
      headerName: t('facet_states.ChSv'),
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return CenteredIcon(!!row.damageTypes?.includes('ChSv'))
      },
      renderEditCell: renderDamageTypesInputCell,
    },
    {
      field: 'Cz',
      headerName: t('facet_states.Cz'),
      type: 'boolean',
      editable: canEdit,
      renderCell: (params: GridRenderCellParams<TEditableSpecimen>) => {
        const { row } = params
        return CenteredIcon(!!row.damageTypes?.includes('Cz'))
      },
      renderEditCell: renderDamageTypesInputCell,
    },
    {
      field: 'note',
      type: 'string',
      flex: 1,
      minWidth: 180,
      headerName: t('volume_overview.note'),
      editable: canEdit,
    },
  ]

  const handleUpdate = (newRow: TEditableSpecimen) => {
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
      }}
      pageSizeOptions={[100]}
      disableRowSelectionOnClick
      isCellEditable={isCellEditable}
      processRowUpdate={handleUpdate}
    />
  )
}

export default Table
