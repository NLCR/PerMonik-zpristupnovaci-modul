/* eslint-disable no-param-reassign */
import { create } from 'zustand'
import { produce } from 'immer'
import { Dayjs } from 'dayjs'
import {
  TEditableVolume,
  TEditableVolumePeriodicity,
  TVolumePeriodicityDays,
} from '../schema/volume'
import { filterSpecimen, TEditableSpecimen } from '../schema/specimen'
import { TPublication } from '../schema/publication'

const periodicityDays: TVolumePeriodicityDays[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

const initialPeriodicity: TEditableVolumePeriodicity[] = [
  ...periodicityDays.map((d) => ({
    numExists: false,
    publicationId: null,
    day: d,
    pagesCount: '',
    name: '',
    subName: '',
    isAttachment: false,
  })),
]

export const initialState: TVariablesState = {
  volumeState: {
    id: '',
    barCode: '',
    dateFrom: '',
    dateTo: '',
    firstNumber: '',
    lastNumber: '',
    metaTitleId: '',
    mutationId: '',
    note: '',
    ownerId: '',
    periodicity: initialPeriodicity,
    publicationMark: '',
    showAttachmentsAtTheEnd: false,
    signature: '',
    year: '',
  },
  specimensState: [],
  periodicityGenerationUsed: false,
}

interface TVariablesState {
  volumeState: TEditableVolume
  specimensState: TEditableSpecimen[]
  periodicityGenerationUsed: boolean
}

interface TState extends TVariablesState {
  setInitialState: () => void
  volumeActions: {
    setVolumeState: (value: TEditableVolume) => void
    setMetaTitleId: (value: string) => void
    setMutationId: (value: string) => void
    setPublicationMark: (value: string) => void
    setBarCode: (value: string) => void
    setSignature: (value: string) => void
    setYear: (value: string) => void
    setDateFrom: (value: Dayjs | null) => void
    setDateTo: (value: Dayjs | null) => void
    setFirstNumber: (value: string) => void
    setLastNumber: (value: string) => void
    setOwnerId: (value: string) => void
    setNote: (value: string) => void
    setShowAttachmentsAtTheEnd: (value: boolean) => void
  }
  volumePeriodicityActions: {
    setDefaultPeriodicityPublication: (values: TPublication[]) => void
    setNumExists: (value: boolean, index: number) => void
    setPublicationId: (value: string | null, index: number) => void
    setPagesCount: (value: string, index: number) => void
    setName: (value: string, index: number) => void
    setSubName: (value: string, index: number) => void
    setPeriodicityGenerationUsed: (value: boolean) => void
  }
  specimensActions: {
    setSpecimensState: (value: TEditableSpecimen[]) => void
    setSpecimen: (value: TEditableSpecimen) => void
  }
}

export const useVolumeManagementStore = create<TState>()((set) => ({
  ...initialState,
  setInitialState: () =>
    set(
      produce((state: TState) => {
        state.volumeState = initialState.volumeState
        state.specimensState = initialState.specimensState
        state.periodicityGenerationUsed = initialState.periodicityGenerationUsed
      })
    ),
  volumeActions: {
    setVolumeState: (value) =>
      set(() => ({
        volumeState: value,
      })),
    setMetaTitleId: (value) =>
      set(
        produce((state: TState) => {
          state.volumeState.metaTitleId = value
        })
      ),
    setMutationId: (value) =>
      set(
        produce((state: TState) => {
          state.volumeState.mutationId = value
        })
      ),
    setPublicationMark: (value) =>
      set(
        produce((state: TState) => {
          state.volumeState.publicationMark = value
        })
      ),
    setBarCode: (value) =>
      set(
        produce((state: TState) => {
          state.volumeState.barCode = value.trim()
        })
      ),
    setSignature: (value) =>
      set(
        produce((state: TState) => {
          state.volumeState.signature = value
        })
      ),
    setYear: (value) =>
      set(
        produce((state: TState) => {
          state.volumeState.year = value.replace(/\D/g, '')
        })
      ),
    setDateFrom: (value) =>
      set(
        produce((state: TState) => {
          state.volumeState.dateFrom = value?.isValid()
            ? value.format('YYYY-MM-DD')
            : ''
        })
      ),
    setDateTo: (value) =>
      set(
        produce((state: TState) => {
          state.volumeState.dateTo = value?.isValid()
            ? value.format('YYYY-MM-DD')
            : ''
        })
      ),
    setFirstNumber: (value) =>
      set(
        produce((state: TState) => {
          state.volumeState.firstNumber = value.replace(/\D/g, '')
        })
      ),
    setLastNumber: (value) =>
      set(
        produce((state: TState) => {
          state.volumeState.lastNumber = value.replace(/\D/g, '')
        })
      ),
    setOwnerId: (value) =>
      set(
        produce((state: TState) => {
          state.volumeState.ownerId = value
        })
      ),
    setNote: (value) =>
      set(
        produce((state: TState) => {
          state.volumeState.note = value
        })
      ),
    setShowAttachmentsAtTheEnd: (value) =>
      set(
        produce((state: TState) => {
          state.volumeState.showAttachmentsAtTheEnd = value
        })
      ),
  },
  volumePeriodicityActions: {
    setDefaultPeriodicityPublication: (values: TPublication[]) =>
      set(
        produce((state: TState) => {
          state.volumeState.periodicity = state.volumeState.periodicity.map(
            (p) => ({
              ...p,
              publicationId: values.find((pub) => pub.isDefault)?.id || '',
            })
          )
        })
      ),
    setNumExists: (value: boolean, index: number) =>
      set(
        produce((state: TState) => {
          state.volumeState.periodicity[index].numExists = value
        })
      ),
    setPublicationId: (value: string | null, index: number) =>
      set(
        produce((state: TState) => {
          state.volumeState.periodicity[index].publicationId = value
        })
      ),
    setPagesCount: (value: string, index: number) =>
      set(
        produce((state: TState) => {
          state.volumeState.periodicity[index].pagesCount = value.replace(
            /\D/g,
            ''
          )
        })
      ),
    setName: (value: string, index: number) =>
      set(
        produce((state: TState) => {
          state.volumeState.periodicity[index].name = value
        })
      ),
    setSubName: (value: string, index: number) =>
      set(
        produce((state: TState) => {
          state.volumeState.periodicity[index].subName = value
        })
      ),
    setPeriodicityGenerationUsed: (value: boolean) =>
      set(
        produce((state: TState) => {
          state.periodicityGenerationUsed = value
        })
      ),
  },
  specimensActions: {
    setSpecimensState: (value) =>
      set(() => ({
        specimensState: value,
      })),
    setSpecimen: (value) =>
      set(
        produce((state: TState) => {
          const index = state.specimensState.findIndex((s) => s.id === value.id)
          if (index >= 0) state.specimensState[index] = filterSpecimen(value)
        })
      ),
  },
}))
