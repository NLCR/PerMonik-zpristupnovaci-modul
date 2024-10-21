import Box from '@mui/material/Box'
import React, { FC, MutableRefObject } from 'react'
import { useTranslation } from 'react-i18next'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import IconButton from '@mui/material/IconButton'
import clone from 'lodash/clone'
import {
  TEditableSpecimen,
  TSpecimenDamageTypes,
} from '../../../../schema/specimen'
import { useVolumeManagementStore } from '../../../../slices/useVolumeManagementStore'
import {
  GridApiPro,
  gridExpandedSortedRowEntriesSelector,
} from '@mui/x-data-grid-pro'

type HeaderWithColumnActionProps = {
  field: TSpecimenDamageTypes
  canEdit: boolean
  apiRef: MutableRefObject<GridApiPro>
}

const HeaderWithColumnAction: FC<HeaderWithColumnActionProps> = ({
  field,
  canEdit,
  apiRef,
}) => {
  const { t } = useTranslation()
  const specimensActions = useVolumeManagementStore(
    (state) => state.specimensActions
  )

  const handleDamageChange = () => {
    const filteredSpecimens = gridExpandedSortedRowEntriesSelector(apiRef).map(
      (row) => row.model
    ) as TEditableSpecimen[]
    let specimensClone = clone(filteredSpecimens)
    const specimensWithSelectedDamage = specimensClone.filter(
      (sp) => sp.numExists && sp.damageTypes?.includes(field)
    ).length
    const specimensThatExists = specimensClone.filter(
      (sp) => sp.numExists
    ).length

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

    specimensActions.setSpecimensById(specimensClone)
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

// HeaderWithColumnAction.whyDidYouRender = true

export default HeaderWithColumnAction
