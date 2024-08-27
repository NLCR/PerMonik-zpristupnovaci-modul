import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import React, { FC, useState } from 'react'
import clone from 'lodash/clone'
import { toast } from 'react-toastify'
import Backdrop from '@mui/material/Backdrop'
import Fade from '@mui/material/Fade'
import Box from '@mui/material-pigment-css/Box'
import { blue } from '@mui/material/colors'
import Modal from '@mui/material/Modal'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import { useVolumeManagementStore } from '../../../../slices/useVolumeManagementStore'
import { TEditableSpecimen } from '../../../../schema/specimen'

const modalStyle = {
  overflowY: 'hidden',
  position: 'absolute' as const,
  maxHeight: '230px',
  height: '80vh',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '550px',
  bgcolor: 'background.paper',
  borderRadius: '4px',
  boxShadow: 24,
  p: 4,
}

type RenumberableValueCellProps = {
  row: TEditableSpecimen
  show: boolean
  canEdit: boolean
  type: 'number' | 'attachmentNumber'
}

const RenumberableValueCell: FC<RenumberableValueCellProps> = ({
  row,
  show,
  canEdit,
  type,
}) => {
  const { t } = useTranslation()
  const specimens = useVolumeManagementStore((state) => state.specimensState)
  const specimensActions = useVolumeManagementStore(
    (state) => state.specimensActions
  )
  const [modalOpened, setModalOpened] = useState(false)

  const getWillBeRenumbered = (renumberType: 'number' | 'attachmentNumber') => {
    const specimenIndex = specimens.findIndex((sp) => sp.id === row.id)
    const max = specimens.length
    let willBeRenumbered = 0

    for (let i = specimenIndex; i < max; i += 1) {
      if (specimens[i].numExists || specimens[i].numMissing) {
        if (renumberType === 'number' && !specimens[i].isAttachment) {
          willBeRenumbered += 1
        }
        if (renumberType === 'attachmentNumber' && specimens[i].isAttachment) {
          willBeRenumbered += 1
        }
      }
    }

    return willBeRenumbered
  }

  const doRenumber = (renumberType: 'number' | 'attachmentNumber') => {
    const specimenIndex = specimens.findIndex((sp) => sp.id === row.id)
    const max = specimens.length
    let firstNumber = -1
    let currentNumber =
      renumberType === 'number'
        ? Number(specimens[specimenIndex].number || 0)
        : Number(specimens[specimenIndex].attachmentNumber || 0)
    const willBeRenumbered = getWillBeRenumbered(renumberType)

    const specimensClone = clone(specimens)

    for (let i = specimenIndex; i < max; i += 1) {
      if (specimens[i].numExists || specimens[i].numMissing) {
        if (firstNumber < 0) {
          firstNumber = currentNumber
        }
        if (renumberType === 'number' && !specimens[i].isAttachment) {
          specimensClone[i] = {
            ...specimens[i],
            number: currentNumber.toString(),
          }
        }
        if (renumberType === 'attachmentNumber' && specimens[i].isAttachment) {
          specimensClone[i] = {
            ...specimens[i],
            attachmentNumber: currentNumber.toString(),
          }
        }
        currentNumber += 1
      }
    }

    specimensActions.setSpecimensState(specimensClone)
    toast.success(
      t('volume_overview.renumbered_correctly', {
        willBeRenumbered,
        firstNumber,
        lastNumber: currentNumber - 1,
      })
    )
  }

  return show ? (
    <>
      <Typography
        sx={(theme) => ({
          fontSize: '14px',
          width: 'auto',
          lineHeight: '2.5',
          color: canEdit ? theme.palette.grey[900] : theme.palette.grey[600],
        })}
      >
        {type === 'number' ? row.number : row.attachmentNumber}
        <IconButton
          color="primary"
          disabled={!canEdit}
          onClick={() => setModalOpened(true)}
        >
          <KeyboardArrowDownIcon />
        </IconButton>
      </Typography>
      {modalOpened ? (
        <Modal
          open={modalOpened}
          onClose={() => setModalOpened(false)}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              color: '#fff',
              timeout: 500,
            },
          }}
        >
          <Fade in={modalOpened}>
            <Box sx={modalStyle}>
              <Typography
                sx={{
                  color: blue['900'],
                  fontSize: '24px',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                }}
              >
                {t('volume_overview.renumber_header')}
              </Typography>
              <Typography
                sx={{
                  marginBottom: '5px',
                  fontWeight: '600',
                }}
              >
                {t('volume_overview.renumber_text', {
                  value: getWillBeRenumbered(type),
                })}
              </Typography>
              <Button
                sx={{
                  marginTop: '50px',
                }}
                variant="contained"
                disabled={!canEdit}
                onClick={() => {
                  setModalOpened(false)
                  doRenumber(type)
                }}
              >
                {t('volume_overview.do_renumber')}
              </Button>
            </Box>
          </Fade>
        </Modal>
      ) : null}
    </>
  ) : null
}

export default RenumberableValueCell
