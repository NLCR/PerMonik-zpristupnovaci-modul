import { GridRenderEditCellParams } from '@mui/x-data-grid/models/params/gridCellParams'
import React, { useEffect, useState } from 'react'
import { TEditableSpecimen } from '../../../../schema/specimen'
import PublicationMarkSelectorModal from './PublicationMarkSelectorModal'

const PublicationMarkSelectorModalContainer = (
  props: GridRenderEditCellParams<TEditableSpecimen>
) => {
  const { row, api } = props
  const [modalOpened, setModalOpened] = useState(false)
  // const { t } = useTranslation()

  const handleSave = (updatedRow: TEditableSpecimen) => {
    api.updateRows([updatedRow])
    // setModalOpened(false)
  }

  useEffect(() => {
    setModalOpened(true)
  }, [])

  return (
    <>
      {/* <Button onClick={() => setModalOpened(true)}> */}
      {/*  {t('administration.update')} */}
      {/* </Button> */}
      {row.publicationMark}
      <PublicationMarkSelectorModal
        row={row}
        open={modalOpened}
        onClose={() => setModalOpened(false)}
        onSave={(data) => handleSave(data as TEditableSpecimen)}
      />
    </>
  )
}

export default PublicationMarkSelectorModalContainer
