import { create } from 'zustand'
import { Dayjs } from 'dayjs'

export type TParams = {
  dateStart: number
  dateEnd: number
  names: string[]
  subNames: string[]
  mutationIds: string[]
  publicationIds: string[]
  publicationMarks: string[]
  ownerIds: string[]
  damageTypes: string[]
}

export const initialParams: TParams = {
  dateStart: 0,
  dateEnd: 0,
  names: [],
  subNames: [],
  mutationIds: [],
  publicationIds: [],
  publicationMarks: [],
  ownerIds: [],
  damageTypes: [],
}

interface TVariablesState {
  params: typeof initialParams
  pagination: { pageIndex: number; pageSize: number }
  barCodeInput: string
  view: 'calendar' | 'table'
  calendarDate: Dayjs | null
  calendarMinDate: Dayjs | null
  lastViewedMetaTitleId: string
  sliderRange: [number, number] | null
}

interface TState extends TVariablesState {
  setParams: (values: typeof initialParams) => void
  setBarCodeInput: (value: string) => void
  setPagination: (value: { pageIndex: number; pageSize: number }) => void
  resetAll: () => void
  setView: (value: 'calendar' | 'table') => void
  setCalendarDate: (value: Dayjs) => void
  setCalendarMinDate: (value: Dayjs) => void
  setLastViewedMetaTitleId: (value: string) => void
  setSliderRange: (value: [number, number]) => void
}

export const useSpecimensOverviewStore = create<TState>()((set) => ({
  params: initialParams,
  pagination: { pageIndex: 0, pageSize: 100 },
  barCodeInput: '',
  view: 'calendar',
  calendarDate: null,
  calendarMinDate: null,
  lastViewedMetaTitleId: '',
  sliderRange: null,
  setParams: (values) =>
    set((state) => ({
      params: values,
      pagination: { ...state.pagination, pageIndex: 0 },
    })),
  setBarCodeInput: (value) =>
    set((state) => ({
      barCodeInput: value,
      pagination: { ...state.pagination, pageIndex: 0 },
    })),
  setPagination: (value) => set(() => ({ pagination: value })),
  resetAll: () =>
    set((state) => ({
      barCodeInput: '',
      params: initialParams,
      pagination: { ...state.pagination, pageIndex: 0 },
    })),
  setView: (value) => set(() => ({ view: value })),
  setCalendarDate: (value) => set(() => ({ calendarDate: value })),
  setCalendarMinDate: (value) => set(() => ({ calendarMinDate: value })),
  setLastViewedMetaTitleId: (value) =>
    set(() => ({ lastViewedMetaTitleId: value })),
  setSliderRange: (value) => set(() => ({ sliderRange: value })),
}))
