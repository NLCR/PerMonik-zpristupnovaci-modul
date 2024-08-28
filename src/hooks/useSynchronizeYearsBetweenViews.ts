import { useSpecimensOverviewStore } from '../slices/useSpecimensOverviewStore'
import { useSpecimenListQuery } from '../api/specimen'
import dayjs from 'dayjs'

const useSynchronizeYearsBetweenViews = (metaTitleId?: string) => {
  const { data: specimens } = useSpecimenListQuery(metaTitleId)

  const setCalendarDate = useSpecimensOverviewStore(
    (state) => state.setCalendarDate
  )
  const setSliderRange = useSpecimensOverviewStore(
    (state) => state.setSliderRange
  )
  const setParams = useSpecimensOverviewStore((state) => state.setParams)
  const setPagination = useSpecimensOverviewStore(
    (state) => state.setPagination
  )

  useSpecimensOverviewStore.subscribe((state, prevState) => {
    if (
      state.view !== prevState.view &&
      state.synchronizeYearsBetweenViews &&
      specimens?.specimens.length
    ) {
      if (state.view === 'calendar') {
        setCalendarDate(dayjs(specimens.specimens[0].publicationDate))
      }
      if (state.view === 'table') {
        const publicationDateYear = Number(
          specimens.specimens[0].publicationDate.substring(0, 4)
        )
        const publicationYearMax = Number(
          specimens.publicationDayMax?.substring(0, 4)
        )

        setPagination({ ...state.pagination, pageIndex: 0 })
        setParams({
          ...state.params,
          dateStart:
            publicationDateYear < publicationYearMax
              ? publicationDateYear
              : publicationYearMax,
          dateEnd: state.params.dateEnd
            ? state.params.dateEnd
            : publicationYearMax,
        })
        setSliderRange([
          publicationDateYear,
          state.sliderRange ? state.sliderRange[1] : publicationYearMax,
        ])
      }
    }
  })
}

export default useSynchronizeYearsBetweenViews
