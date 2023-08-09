import { create } from 'zustand'
import { MRT_PaginationState } from 'mantine-react-table'
import { PaginationState } from '@tanstack/table-core/src/features/Pagination'

export type TParams = {
  dateStart: number
  dateEnd: number
  names: string[]
  subNames: string[]
  mutations: string[]
  publications: string[]
  publicationMarks: string[]
  owners: string[]
  states: string[]
}

export const initialParams: TParams = {
  dateStart: 0,
  dateEnd: 0,
  names: [],
  subNames: [],
  mutations: [],
  publications: [],
  publicationMarks: [],
  owners: [],
  states: [],
}

interface TVariablesState {
  params: typeof initialParams
  pagination: MRT_PaginationState
  volumeInput: string
  view: 'calendar' | 'table'
  calendarDate: Date | undefined
  calendarMinDate: Date | undefined
}

interface TState extends TVariablesState {
  setParams: (values: typeof initialParams) => void
  setVolumeInput: (value: string) => void
  setPagination: (value: PaginationState) => void
  resetAll: () => void
  setView: (value: 'calendar' | 'table') => void
  setCalendarDate: (value: Date) => void
  setCalendarMinDate: (value: Date) => void
}

export const useSpecimensOverviewStore = create<TState>()((set) => ({
  params: initialParams,
  pagination: { pageIndex: 0, pageSize: 25 },
  volumeInput: '',
  view: 'calendar',
  calendarDate: undefined,
  calendarMinDate: undefined,
  setParams: (values) => set(() => ({ params: values })),
  setVolumeInput: (value) => set(() => ({ volumeInput: value })),
  setPagination: (value) => set(() => ({ pagination: value })),
  resetAll: () =>
    set((state) => ({
      volumeInput: '',
      params: initialParams,
      pagination: { ...state.pagination, pageIndex: 0 },
      calendarDate: undefined,
      calendarMinDate: undefined,
    })),
  setView: (value) => set(() => ({ view: value })),
  setCalendarDate: (value) => set(() => ({ calendarDate: value })),
  setCalendarMinDate: (value) => set(() => ({ calendarMinDate: value })),
}))
