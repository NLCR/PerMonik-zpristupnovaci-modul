import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import clone from 'lodash/clone'
import { useTranslation } from 'react-i18next'
import { useVolumeManagementStore } from '../slices/useVolumeManagementStore'
import { duplicateVolume, repairVolume, VolumeSchema } from '../schema/volume'
import {
  duplicateSpecimen,
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
import { TEdition } from '../schema/edition'
import { BACK_META_TITLE_ID } from '../utils/constants'
import { generateVolumeUrlWithParams } from '../utils/generateVolumeUrlWithParams'

const useVolumeManagementActions = (editions: TEdition[]) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
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

  const volumeActions = useVolumeManagementStore((state) => state.volumeActions)
  const specimensActions = useVolumeManagementStore(
    (state) => state.specimensActions
  )

  const doValidation = () => {
    //get state when is necessary → this approach doesn't cause rerender of functions and whole hook
    const volumeState = useVolumeManagementStore.getState().volumeState
    const specimensState = useVolumeManagementStore.getState().specimensState

    const volumeClone = clone(volumeState)
    const specimensClone = clone(specimensState)

    const repairedVolume = repairVolume(volumeClone, editions || [])
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

  const doDuplicate = () => {
    try {
      const data = doValidation()

      const duplicatedVolume = duplicateVolume(data.repairedVolume)
      const duplicatedSpecimens = data.repairedSpecimens.map((s) =>
        duplicateSpecimen(s, data.repairedVolume)
      )

      navigate(
        generateVolumeUrlWithParams(
          `/${i18n.resolvedLanguage}/${t('urls.volume_overview')}/duplicated`,
          searchParams.get(BACK_META_TITLE_ID) || ''
        )
      )
      specimensActions.setSpecimensState(duplicatedSpecimens, true)
      volumeActions.setVolumeState(duplicatedVolume, true)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }

  return {
    doDuplicate,
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

export default useVolumeManagementActions
