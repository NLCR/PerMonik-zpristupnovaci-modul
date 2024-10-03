import React, { FC, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'
import { TEditableSpecimen } from '../../../../schema/specimen'
import { TEditableVolume } from '../../../../schema/volume'
import ModalContainer from '../../../../components/ModalContainer'

const marks = ['●', '○', '■', '□', '★', '☆', '△', '▲', '✶'] as const
type TMarks = (typeof marks)[number]

interface PublicationMarkSelectorModalProps {
  row: TEditableSpecimen | TEditableVolume
  open: boolean
  onClose: () => void
  onSave: (data: TEditableSpecimen | TEditableVolume) => void
}

const PublicationMarkSelectorModal: FC<PublicationMarkSelectorModalProps> = ({
  row,
  open,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation()
  const [inputMarks, setInputMarks] = useState(row.publicationMark)

  useEffect(() => {
    if (open) setInputMarks(row.publicationMark)
  }, [open, row.publicationMark])

  const doClose = () => {
    // setInputMarks('')
    onClose()
  }

  const handleSave = () => {
    onSave({ ...row, publicationMark: inputMarks })
    doClose()
  }

  const handleSymbolSelect = (symbol: TMarks) => {
    if (inputMarks === '' || inputMarks.includes(symbol)) {
      setInputMarks((prevState) => prevState + symbol)
    }
  }

  const handleInputChange = (value: string) => {
    if (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      marks.includes(value) ||
      value === '' ||
      value.length < inputMarks.length
    )
      setInputMarks(value.trim())
  }

  return (
    <ModalContainer
      header={t('volume_overview.publication_mark')}
      opened={open}
      onClose={doClose}
      closeButton={{
        callback: () => doClose(),
      }}
      acceptButton={{
        callback: () => handleSave(),
      }}
      style="fitted"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TextField
          value={inputMarks}
          onChange={(e) => handleInputChange(e.target.value)}
        />
        <Box>
          {marks.map((mark) => (
            <Button
              disabled={inputMarks.length > 0 && !inputMarks.includes(mark)}
              key={`publication-mark-${mark}`}
              onClick={() => handleSymbolSelect(mark)}
              sx={{
                fontSize: '20px',
              }}
            >
              {mark}
            </Button>
          ))}
        </Box>
      </Box>
    </ModalContainer>
  )
}

export default PublicationMarkSelectorModal
