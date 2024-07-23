import { toast } from 'react-toastify'
import { clone } from 'lodash-es'
import { useVolumeManagementStore } from '../slices/useVolumeManagementStore'
import { TVolume, VolumeSchema } from '../schema/volume'
import { repairSpecimen, SpecimenSchema } from '../schema/specimen'
import { useUpdateVolumeWithSpecimensMutation } from '../api/volume'

// eslint-disable-next-line import/prefer-default-export
export const useVolumeManagementActions = () => {
  const { mutateAsync, status } = useUpdateVolumeWithSpecimensMutation()
  const volumeState = useVolumeManagementStore((state) => state.volumeState)
  const specimensState = useVolumeManagementStore(
    (state) => state.specimensState
  )

  const doUpdate = async () => {
    const volumeClone = clone(volumeState)
    let specimensclone = clone(specimensState)

    // volumeClone = repairVolume(volumeClone)
    specimensclone = specimensclone.map((s) => repairSpecimen(s, volumeClone))

    const volumeValidation = VolumeSchema.safeParse(volumeClone)
    const specimensValidation = SpecimenSchema.array().safeParse(specimensclone)

    if (!volumeValidation.success) {
      toast.error('Volume error')
      console.log(volumeValidation.error.errors)
    }
    if (!specimensValidation.success) {
      toast.error('Specimens error')
      console.log(specimensValidation.error.errors)
    }

    await mutateAsync({
      volume: volumeClone as TVolume,
      specimens: specimensclone,
    })
  }

  return {
    doUpdate,
  }
}
