import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import clone from 'lodash/clone'
import { useTranslation } from 'react-i18next'
import { useVolumeManagementStore } from '../slices/useVolumeManagementStore'
import { repairVolume, VolumeSchema } from '../schema/volume'
import {
  repairOrCreateSpecimen,
  SpecimenSchema,
  TEditableSpecimen,
} from '../schema/specimen'
import {
  useCreateVolumeWithSpecimensMutation,
  useDeleteVolumeWithSpecimensMutation,
  useUpdateRegeneratedVolumeWithSpecimensMutation,
  useUpdateVolumeWithSpecimensMutation,
} from '../api/volume'
import { TPublication } from '../schema/publication'

// eslint-disable-next-line import/prefer-default-export
export const useVolumeManagementActions = (publications: TPublication[]) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { mutateAsync: callUpdate, status: updateStatus } =
    useUpdateVolumeWithSpecimensMutation()
  const { mutateAsync: callCreate, status: createStatus } =
    useCreateVolumeWithSpecimensMutation()
  const { mutateAsync: callDelete, status: deleteStatus } =
    useDeleteVolumeWithSpecimensMutation()
  const {
    mutateAsync: callRegeneratedUpdate,
    status: regeneratedUpdateStatus,
  } = useUpdateRegeneratedVolumeWithSpecimensMutation()

  const volumeState = useVolumeManagementStore((state) => state.volumeState)
  const specimensState = useVolumeManagementStore(
    (state) => state.specimensState
  )

  const doValidation = () => {
    const volumeClone = clone(volumeState)
    const specimensClone = clone(specimensState)

    const repairedVolume = repairVolume(volumeClone, publications || [])
    const repairedSpecimens = specimensClone.map((s) =>
      repairOrCreateSpecimen(s, repairedVolume)
    )

    const volumeValidation = VolumeSchema.safeParse(repairedVolume)
    const specimensValidation =
      SpecimenSchema.array().safeParse(repairedSpecimens)

    if (!volumeValidation.success) {
      toast.error(t('volume_overview.volume_input_data_validation_error'))
      // throw for Sentry
      throw new Error(volumeValidation.error.message)
    }
    if (!specimensValidation.success) {
      toast.error(t('volume_overview.specimens_validation_error'))
      // throw for Sentry
      throw new Error(specimensValidation.error.message)
    }

    return {
      repairedVolume,
      repairedSpecimens,
    }
  }

  const setSpecimensVerified = (
    input: TEditableSpecimen[]
  ): TEditableSpecimen[] =>
    input.map((sp) => {
      if (sp.numExists) {
        const damageTypes = new Set(sp.damageTypes)
        damageTypes.add('OK')
        return {
          ...sp,
          damageTypes: Array.from(damageTypes),
        }
      }
      return sp
    })

  const doUpdate = async (setVerified = false) => {
    try {
      const data = doValidation()

      try {
        await callUpdate({
          volume: data.repairedVolume,
          specimens: setVerified
            ? setSpecimensVerified(data.repairedSpecimens)
            : data.repairedSpecimens,
        })
        toast.success(t('volume_overview.volume_updated_successfully'))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error(t('volume_overview.volume_update_error'))
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }

  const doRegeneratedUpdate = async (setVerified = false) => {
    try {
      const data = doValidation()

      try {
        await callRegeneratedUpdate({
          volume: data.repairedVolume,
          specimens: setVerified
            ? setSpecimensVerified(data.repairedSpecimens)
            : data.repairedSpecimens,
        })
        toast.success(t('volume_overview.volume_updated_successfully'))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error(t('volume_overview.volume_update_error'))
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }

  const doCreate = async (setVerified = false) => {
    try {
      const data = doValidation()

      try {
        const id = await callCreate({
          volume: data.repairedVolume,
          specimens: setVerified
            ? setSpecimensVerified(data.repairedSpecimens)
            : data.repairedSpecimens,
        })
        toast.success(t('volume_overview.volume_created_successfully'))
        navigate(`/${i18n.resolvedLanguage}/${t('urls.volume_overview')}/${id}`)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error(t('volume_overview.volume_create_error'))
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }

  const doDelete = async () => {
    try {
      const data = doValidation()

      try {
        await callDelete(data.repairedVolume.id)
        toast.success(t('volume_overview.volume_deleted_successfully'))
        navigate(`/${i18n.resolvedLanguage}/${t('urls.volume_overview')}/`)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error(t('volume_overview.volume_deletion_error'))
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }

  return {
    doUpdate,
    doRegeneratedUpdate,
    doCreate,
    doDelete,
    pendingActions:
      updateStatus === 'pending' ||
      createStatus === 'pending' ||
      regeneratedUpdateStatus === 'pending' ||
      deleteStatus === 'pending',
  }
}
