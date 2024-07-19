import { create } from 'zustand'

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
  calendarDate: Date | null
  calendarMinDate: Date | undefined
}

interface TState extends TVariablesState {
  setParams: (values: typeof initialParams) => void
  setBarCodeInput: (value: string) => void
  setPagination: (value: { pageIndex: number; pageSize: number }) => void
  resetAll: () => void
  setView: (value: 'calendar' | 'table') => void
  setCalendarDate: (value: Date | null) => void
  setCalendarMinDate: (value: Date) => void
}

export const useSpecimensOverviewStore = create<TState>()((set) => ({
  params: initialParams,
  pagination: { pageIndex: 0, pageSize: 100 },
  barCodeInput: '',
  view: 'calendar',
  calendarDate: null,
  calendarMinDate: undefined,
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
      calendarDate: undefined,
      calendarMinDate: undefined,
    })),
  setView: (value) => set(() => ({ view: value })),
  setCalendarDate: (value) => set(() => ({ calendarDate: value })),
  setCalendarMinDate: (value) => set(() => ({ calendarMinDate: value })),
}))
