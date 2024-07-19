/* eslint-disable no-param-reassign */
import { create } from 'zustand'
import { produce } from 'immer'
import {
  TEditableVolume,
  TEditableVolumePeriodicity,
  TVolumePeriodicityDays,
} from '../schema/volume'
import { TEditableSpecimen } from '../schema/specimen'

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
    active: false,
    publication: null,
    day: d,
    pagesCount: '',
    name: '',
    subName: '',
  })),
]

export const initialState: TVariablesState = {
  volumeState: {
    id: null,
    barCode: '',
    dateFrom: '',
    dateTo: '',
    firstNumber: undefined,
    lastNumber: undefined,
    metaTitleId: null,
    mutationId: null,
    note: '',
    ownerId: null,
    periodicity: initialPeriodicity,
    publicationMark: '',
    showAttachmentsAtTheEnd: false,
    signature: '',
    year: undefined,
  },
  specimensState: [],
}

interface TVariablesState {
  volumeState: TEditableVolume
  specimensState: TEditableSpecimen[]
}

interface TState extends TVariablesState {
  volumeActions: {
    setVolumeState: (value: TEditableVolume) => void
    setMetaTitleId: (value: string | null) => void
    setMutationId: (value: string | null) => void
    setPublicationMark: (value: string) => void
    setBarCode: (value: string) => void
    setSignature: (value: string) => void
    setYear: (value: string) => void
    setDateFrom: (value: string) => void
    setDateTo: (value: string) => void
    setFirstNumber: (value: string) => void
    setLastNumber: (value: string) => void
    setOwnerId: (value: string | null) => void
    setNote: (value: string) => void
  }
  volumePeriodicityActions: {
    setActive: (value: boolean, index: number) => void
    setPublicationId: (value: string | null, index: number) => void
    setPagesCount: (value: string, index: number) => void
    setName: (value: string, index: number) => void
    setSubName: (value: string, index: number) => void
  }
  specimensActions: {
    setSpecimensState: (value: TEditableSpecimen[]) => void
    setNumExists: (value: boolean, id: string) => void
  }
}

export const useVolumeManagementStore = create<TState>()((set) => ({
  ...initialState,
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
          console.log(value, `state ${state.volumeState.publicationMark}`)
          state.volumeState.publicationMark = value

          // const currentValue = state.volumeState.publicationMark
          // console.log(value, `val ${currentValue}`)
          // if (value && (currentValue === '' || currentValue.includes(value))) {
          //   if (value.length >= currentValue.length) {
          //     state.volumeState.publicationMark += value
          //   } else {
          //     state.volumeState.publicationMark =
          //       state.volumeState.publicationMark.slice()
          //   }
          // }
        })
      ),
    setBarCode: (value) =>
      set(
        produce((state: TState) => {
          state.volumeState.barCode = value
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
          state.volumeState.year = value
        })
      ),
    setDateFrom: (value) =>
      set(
        produce((state: TState) => {
          state.volumeState.dateFrom = value
        })
      ),
    setDateTo: (value) =>
      set(
        produce((state: TState) => {
          state.volumeState.dateTo = value
        })
      ),
    setFirstNumber: (value) =>
      set(
        produce((state: TState) => {
          state.volumeState.firstNumber = value
        })
      ),
    setLastNumber: (value) =>
      set(
        produce((state: TState) => {
          state.volumeState.lastNumber = value
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
  },
  volumePeriodicityActions: {
    setActive: (value: boolean, index: number) =>
      set(
        produce((state: TState) => {
          state.volumeState.periodicity[index].active = value
        })
      ),
    setPublicationId: (value: string | null, index: number) =>
      set(
        produce((state: TState) => {
          state.volumeState.periodicity[index].publication = value
        })
      ),
    setPagesCount: (value: string, index: number) =>
      set(
        produce((state: TState) => {
          state.volumeState.periodicity[index].pagesCount = value
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
  },
  specimensActions: {
    setSpecimensState: (value) =>
      set(() => ({
        specimensState: value,
      })),
    setNumExists: (value, id) =>
      set(
        produce((state: TState) => {
          const index = state.specimensState.findIndex((s) => s.id === id)
          if (index >= 0) state.specimensState[index].numExists = value
        })
      ),
  },
}))
