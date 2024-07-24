import { toast } from 'react-toastify'
import { clone } from 'lodash-es'
import { useTranslation } from 'react-i18next'
import { useVolumeManagementStore } from '../slices/useVolumeManagementStore'
import { repairVolume, VolumeSchema } from '../schema/volume'
import { repairSpecimen, SpecimenSchema } from '../schema/specimen'
import { useUpdateVolumeWithSpecimensMutation } from '../api/volume'
import { TPublication } from '../schema/publication'

// eslint-disable-next-line import/prefer-default-export
export const useVolumeManagementActions = (publications: TPublication[]) => {
  const { t } = useTranslation()
  const { mutateAsync, status } = useUpdateVolumeWithSpecimensMutation()
  const volumeState = useVolumeManagementStore((state) => state.volumeState)
  const specimensState = useVolumeManagementStore(
    (state) => state.specimensState
  )

  const doUpdate = async () => {
    const volumeClone = clone(volumeState)
    const specimensClone = clone(specimensState)

    const repairedVolume = repairVolume(volumeClone, publications || [])
    const repairedSpecimens = specimensClone.map((s) =>
      repairSpecimen(s, repairedVolume)
    )

    const volumeValidation = VolumeSchema.safeParse(repairedVolume)
    const specimensValidation =
      SpecimenSchema.array().safeParse(repairedSpecimens)

    if (!volumeValidation.success) {
      toast.error(t('volume_overview.volume_input_data_validation_error'))
      throw new Error(volumeValidation.error.message)
    }
    if (!specimensValidation.success) {
      toast.error(t('volume_overview.specimens_validation_error'))
      throw new Error(specimensValidation.error.message)
    }

    try {
      await mutateAsync({
        volume: repairedVolume,
        specimens: repairedSpecimens,
      })
      toast.success(t('volume_overview.volume_updated_successfully'))
    } catch (error) {
      toast.error(t('volume_overview.volume_update_error'))
    }
  }

  return {
    doUpdate,
    pendingActions: status === 'pending',
  }
}
