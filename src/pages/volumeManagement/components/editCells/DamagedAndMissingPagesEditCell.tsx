import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'
import { clone } from 'lodash-es'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import { GridRenderEditCellParams } from '@mui/x-data-grid/models/params/gridCellParams'
import {
  TEditableSpecimen,
  TSpecimenDamageTypes,
} from '../../../../schema/specimen'

function createArrayOfNumbers(n: number): number[] {
  // TODO: when changing pagesCount, watch for damaged and missing pages with number larger then pagesCount and delete them
  return Array.from({ length: n }, (_, i) => i + 1)
}

const DamagedPagesAndMissingPagesEditModal = ({
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

const DamagedAndMissingPagesEditCell = (
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
      <DamagedPagesAndMissingPagesEditModal
        field={field as TSpecimenDamageTypes}
        open={open}
        onClose={() => setOpen(false)}
        row={row}
        onSave={handleSave}
      />
    </>
  )
}

export default DamagedAndMissingPagesEditCell
