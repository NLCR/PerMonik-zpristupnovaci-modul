import Box from '@mui/material-pigment-css/Box'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import IconButton from '@mui/material/IconButton'
import clone from 'lodash/clone'
import { TSpecimenDamageTypes } from '../../../../schema/specimen'
import { useVolumeManagementStore } from '../../../../slices/useVolumeManagementStore'

type HeaderWithColumnActionProps = {
  field: TSpecimenDamageTypes
  canEdit: boolean
}

const HeaderWithColumnAction: FC<HeaderWithColumnActionProps> = ({
  field,
  canEdit,
}) => {
  const { t } = useTranslation()
  const specimens = useVolumeManagementStore((state) => state.specimensState)
  const specimensActions = useVolumeManagementStore(
    (state) => state.specimensActions
  )

  const handleDamageChange = () => {
    let specimensClone = clone(specimens)
    const specimensWithSelectedDamage = specimens.filter(
      (sp) => sp.numExists && sp.damageTypes?.includes(field)
    ).length
    const specimensThatExists = specimens.filter((sp) => sp.numExists).length

    if (field === 'OK') {
      specimensClone = specimensClone.map((sp) => {
        if (sp.numExists) {
          const damageTypes = new Set(sp.damageTypes)
          damageTypes.add(field)
          return {
            ...sp,
            damageTypes: Array.from(damageTypes),
          }
        }
        return sp
      })
      specimensActions.setSpecimensState(specimensClone)
      return
    }

    if (
      !specimensWithSelectedDamage ||
      specimensWithSelectedDamage !== specimensThatExists
    ) {
      specimensClone = specimensClone.map((sp) => {
        if (sp.numExists) {
          const damageTypes = new Set(sp.damageTypes)
          damageTypes.add(field)
          return {
            ...sp,
            damageTypes: Array.from(damageTypes),
          }
        }
        return sp
      })
    } else {
      specimensClone = specimensClone.map((sp) => {
        if (sp.numExists) {
          const damageTypes = new Set(sp.damageTypes)
          damageTypes.delete(field)
          return {
            ...sp,
            damageTypes: Array.from(damageTypes),
          }
        }
        return sp
      })
    }

    specimensActions.setSpecimensState(specimensClone)
  }

  const doAction = () => {
    switch (field) {
      case 'OK':
        handleDamageChange()
        break
      case 'Deg':
        handleDamageChange()
        break
      case 'NS':
        handleDamageChange()
        break

      default:
    }
  }

  return (
    <Box>
      <IconButton
        color="primary"
        disabled={!canEdit}
        onClick={() => doAction()}
      >
        <KeyboardArrowDownIcon />
      </IconButton>
      {t(`facet_states.${field}`)}
    </Box>
  )
}

export default HeaderWithColumnAction
