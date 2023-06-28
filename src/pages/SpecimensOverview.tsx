/* eslint-disable react/prop-types */
import {
  Box,
  Text,
  createStyles,
  Flex,
  RangeSlider,
  Title,
  // LoadingOverlay,
  Tooltip,
  Divider,
  TextInput,
  Button,
} from '@mantine/core'
import { Link, useParams } from 'react-router-dom'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_Row,
  useMantineReactTable,
} from 'mantine-react-table'
import { MRT_Localization_CS } from 'mantine-react-table/locales/cs'
import { IconEraser, IconFileSymlink } from '@tabler/icons-react'
import { useDebouncedState } from '@mantine/hooks'
import useMetaTitleQuery from '../api/query/useMetaTitleQuery'
import useSpecimensWithFacetsQuery from '../api/query/useSpecimensWithFacetsQuery'
import Loader from '../components/reusableComponents/Loader'
import ShowError from '../components/reusableComponents/ShowError'
import ShowInfoMessage from '../components/reusableComponents/ShowInfoMessage'
import { TSpecimen } from '../@types/specimen'
import { mutations, owners, publications, states } from '../utils/constants'
import i18next from '../i18next'
import { formatDateWithDashes } from '../utils/helperFunctions'
import FacetGroup from '../components/reusableComponents/FacetGroup'

const useStyles = createStyles((theme) => ({
  flexWrapper: {
    gap: theme.spacing.md,
    height: '100%',
    maxHeight: '80vh',
    position: 'relative',
  },
  facets: {
    width: '20%',
    maxWidth: 280,
    // color: theme.colors.dark[9],
    padding: theme.spacing.md,
    backgroundColor: 'white',
    textAlign: 'left',
    borderRadius: theme.spacing.xs,
    boxShadow: theme.shadows.xs,
    display: 'flex',
    flexDirection: 'column',
  },
  tableWrapper: {
    width: '80%',
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    backgroundColor: 'white',
    borderRadius: theme.spacing.xs,
    boxShadow: theme.shadows.xs,
  },
  link: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.colors.blue[5],
    transition: 'color 0.1s',
    ':hover': {
      color: theme.colors.blue[9],
    },
  },
  facetCheckboxLabelWrapper: {
    width: '100%',
  },
}))

const getSpecimenState = (sp: TSpecimen) => {
  if (sp.states) {
    if (!sp.states.length) {
      return (
        <Tooltip label={i18next.t('tooltip_states.uncontrolled')}>
          <Box
            sx={(theme) => ({
              width: 15,
              height: 15,
              borderRadius: '50%',
              border: `1px solid ${theme.colors.gray[7]}`,
              backgroundColor: theme.colors.gray[0],
            })}
          />
        </Tooltip>
      )
    }
    if (sp.states.includes('ChS')) {
      return (
        <Tooltip label={i18next.t('tooltip_states.missing_page')}>
          <Box
            sx={(theme) => ({
              width: 15,
              height: 15,
              borderRadius: '50%',
              border: `1px solid ${theme.colors.gray[7]}`,
              backgroundColor: theme.colors.red[7],
            })}
          />
        </Tooltip>
      )
    }
    if (sp.states.some((st) => states.filter((s) => s !== 'OK').includes(st))) {
      return (
        <Tooltip label={i18next.t('tooltip_states.damaged_document')}>
          <Box
            sx={(theme) => ({
              width: 15,
              height: 15,
              borderRadius: '50%',
              border: `1px solid ${theme.colors.gray[7]}`,
              backgroundColor: theme.colors.orange[7],
            })}
          />
        </Tooltip>
      )
    }

    return (
      <Tooltip label={i18next.t('tooltip_states.complete')}>
        <Box
          sx={(theme) => ({
            width: 15,
            height: 15,
            borderRadius: '50%',
            border: `1px solid ${theme.colors.gray[7]}`,
            backgroundColor: theme.colors.green[7],
          })}
        />
      </Tooltip>
    )
  }

  return (
    <Tooltip label={i18next.t('tooltip_states.uncontrolled')}>
      <Box
        sx={(theme) => ({
          width: 15,
          height: 15,
          borderRadius: '50%',
          border: `1px solid ${theme.colors.gray[7]}`,
          backgroundColor: theme.colors.gray[0],
        })}
      />
    </Tooltip>
  )
}

const OwnersBarCodeCell: FC<{
  row: MRT_Row<TSpecimen>
  ownerRow: 0 | 1 | 2 | 3
}> = ({ row, ownerRow }) => {
  const { classes } = useStyles()
  const { t } = useTranslation()

  return Number(row.original.owner) === owners[ownerRow].id ? (
    <Flex
      sx={(theme) => ({
        gap: theme.spacing.xs,
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      {row.original.barCode}
      <Link
        className={classes.link}
        to={`/${t('urls.volume')}/${row.original.barCode}`}
      >
        <IconFileSymlink size={20} />
      </Link>
      {getSpecimenState(row.original)}
    </Flex>
  ) : undefined
}

const columns: MRT_ColumnDef<TSpecimen>[] = [
  {
    accessorKey: 'mutation',
    header: i18next.t('table.mutations'),
    maxSize: 110,
    Cell: ({ cell }) =>
      mutations.find((m) => m.id === Number(cell.getValue<string>()))?.name,
  },
  {
    accessorKey: 'publicationDate',
    header: i18next.t('table.publication_date'),
    Cell: ({ cell }) => formatDateWithDashes(cell.getValue<string>()),
  },
  {
    accessorKey: 'name',
    header: i18next.t('table.name'),
  },
  {
    accessorKey: 'publication',
    header: i18next.t('table.publication'),
    maxSize: 110,
    Cell: ({ cell }) =>
      publications.find((p) => p.id === Number(cell.getValue<string>()))?.name,
  },
  {
    accessorKey: 'number',
    header: i18next.t('table.number'),
    maxSize: 110,
  },
  {
    accessorKey: 'pagesCount',
    header: i18next.t('table.pages_count'),
    maxSize: 110,
  },
  {
    id: `owner${owners[0].name}`,
    accessorKey: 'owner',
    header: owners[0].name,
    Cell: ({ row }) => <OwnersBarCodeCell row={row} ownerRow={0} />,
  },
  {
    id: `owner${owners[1].name}`,
    accessorKey: 'owner',
    header: owners[1].name,
    Cell: ({ row }) => <OwnersBarCodeCell row={row} ownerRow={1} />,
  },
  {
    id: `owner${owners[2].name}`,
    accessorKey: 'owner',
    header: owners[2].name,
    Cell: ({ row }) => <OwnersBarCodeCell row={row} ownerRow={2} />,
  },
  {
    id: `owner${owners[3].name}`,
    accessorKey: 'owner',
    header: owners[3].name,
    Cell: ({ row }) => <OwnersBarCodeCell row={row} ownerRow={3} />,
  },
]

export type TParams = {
  dateStart: number
  dateEnd: number
  names: string[]
  mutations: string[]
  publications: string[]
  publicationMarks: string[]
  owners: string[]
  states: string[]
}

const initialParams = {
  dateStart: 0,
  dateEnd: 0,
  names: [],
  mutations: [],
  publications: [],
  publicationMarks: [],
  owners: [],
  states: [],
}

const SpecimensOverview = () => {
  const { metaTitleId } = useParams()
  const { classes } = useStyles()
  const { t } = useTranslation()
  const [params, setParams] = useState<TParams>(initialParams)
  const [volumeInput, setVolumeInput] = useDebouncedState('', 250)
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })

  const {
    data: metaTitle,
    isLoading: metaTitleLoading,
    isError: metaTitleError,
  } = useMetaTitleQuery(metaTitleId as string)
  const {
    data: specimens,
    isLoading: specimensLoading,
    isError: specimensError,
    isRefetching: specimensRefetching,
  } = useSpecimensWithFacetsQuery({
    idTitle: metaTitleId as string,
    ...pagination,
    params,
    volume: volumeInput,
  })

  const table = useMantineReactTable({
    columns,
    data: specimens?.specimens || [],
    localization: MRT_Localization_CS,
    enableStickyHeader: true,
    enableFilters: false,
    enableSorting: false,
    // enableRowVirtualization: true,
    initialState: {
      density: 'xs',
    },
    state: {
      pagination,
      showSkeletons: false,
      showProgressBars: specimensRefetching,
    },
    manualPagination: true,
    rowCount: specimens?.count,
    onPaginationChange: setPagination,
    mantinePaginationProps: {
      rowsPerPageOptions: ['25', '50', '100'],
    },
    mantineTableHeadRowProps: {
      sx: (theme) => ({
        boxShadow: `${theme.shadows.xs} !important`,
      }),
    },
    mantineTableBodyProps: {
      // sx: (theme) => ({
      //   maxHeight: `100% !important`,
      // }),
    },
    mantineTableContainerProps: {
      sx: () => ({
        boxShadow: `none !important`,
      }),
    },
    mantinePaperProps: {
      sx: () => ({
        border: `none !important`,
        boxShadow: `none !important`,
        display: 'flex',
        flexDirection: 'column',
      }),
    },
    mantineTableProps: {
      // sx: () => ({
      //
      // }),
      striped: false,
      highlightOnHover: true,
      withBorder: false,
      withColumnBorders: true,
    },
    mantineTableBodyCellProps: {
      sx: (theme) => ({
        fontSize: `${theme.fontSizes.xs} !important`,
      }),
    },
    mantineTableHeadCellProps: {
      sx: (theme) => ({
        fontSize: `${theme.fontSizes.xs} !important`,
      }),
    },
  })

  const datesMin = Number(specimens?.publicationDayMin?.substring(0, 4)) || 1900
  const datesMax = Number(specimens?.publicationDayMax?.substring(0, 4)) || 2023

  return (
    <Flex className={classes.flexWrapper}>
      {/* <LoadingOverlay */}
      {/*  visible={specimensRefetching} */}
      {/*  loader={<Loader />} */}
      {/*  overlayBlur={2} */}
      {/*  transitionDuration={300} */}
      {/* /> */}
      <Box className={classes.facets}>
        {specimens && metaTitle ? (
          <>
            <Title size="h4" color="blue.9">
              {metaTitle.name}
            </Title>
            <Divider mt={10} mb={10} />
            <Text fz="sm" fw={700}>
              {t('specimens_overview.date')}
            </Text>
            <RangeSlider
              mt="sm"
              step={1}
              min={datesMin}
              max={datesMax}
              disabled={specimensRefetching}
              onChangeEnd={(value) =>
                setParams((prevState) => ({
                  ...prevState,
                  dateStart: value[0],
                  dateEnd: value[1],
                }))
              }
              // labelAlwaysOn
              marks={[
                {
                  value: datesMin,
                  label: datesMin,
                },
                {
                  value: datesMax,
                  label: datesMax,
                },
              ]}
            />
            <Text mt={40} mb={5} fz="sm" fw={700}>
              {t('specimens_overview.volume')}
            </Text>
            <TextInput
              defaultValue={volumeInput}
              // disabled={specimensRefetching}
              onChange={(event) => setVolumeInput(event.target.value)}
            />
            <Divider mt={10} />
            <Box sx={{ overflowY: 'auto', width: '100%' }}>
              <FacetGroup
                disabled={specimensRefetching}
                facets={specimens.facets.names}
                header={t('specimens_overview.name')}
                onChange={(value) =>
                  setParams((prevState) => ({ ...prevState, names: value }))
                }
                values={params.names}
              />
              <FacetGroup
                disabled={specimensRefetching}
                facets={specimens.facets.mutations.map((m) => ({
                  name: m.name,
                  count: m.count,
                  displayedName: mutations.find(
                    (mc) => mc.id === Number(m.name)
                  )?.name,
                }))}
                header={t('specimens_overview.mutation')}
                onChange={(value) =>
                  setParams((prevState) => ({ ...prevState, mutations: value }))
                }
                values={params.mutations}
              />
              <FacetGroup
                disabled={specimensRefetching}
                facets={specimens.facets.publications.map((m) => ({
                  name: m.name,
                  count: m.count,
                  displayedName: publications.find(
                    (mc) => mc.id === Number(m.name)
                  )?.name,
                }))}
                header={t('specimens_overview.publication')}
                onChange={(value) =>
                  setParams((prevState) => ({
                    ...prevState,
                    publications: value,
                  }))
                }
                values={params.publications}
              />
              <FacetGroup
                disabled={specimensRefetching}
                facets={specimens.facets.publicationMarks}
                header={t('specimens_overview.publication_mark')}
                onChange={(value) =>
                  setParams((prevState) => ({
                    ...prevState,
                    publicationMarks: value,
                  }))
                }
                values={params.publicationMarks}
              />
              <FacetGroup
                disabled={specimensRefetching}
                facets={specimens.facets.owners.map((m) => ({
                  name: m.name,
                  count: m.count,
                  displayedName: owners.find((mc) => mc.id === Number(m.name))
                    ?.name,
                }))}
                header={t('specimens_overview.owner')}
                onChange={(value) =>
                  setParams((prevState) => ({
                    ...prevState,
                    owners: value,
                  }))
                }
                values={params.owners}
              />
              <FacetGroup
                disabled={specimensRefetching}
                facets={specimens.facets.states.map((m) => ({
                  name: m.name,
                  count: m.count,
                  displayedName: t(
                    `facet_states.${m.name as (typeof states)[number]}`
                  ),
                }))}
                header={t('specimens_overview.state')}
                onChange={(value) =>
                  setParams((prevState) => ({
                    ...prevState,
                    states: value,
                  }))
                }
                values={params.states}
              />
            </Box>
            <Divider mb={10} />
            <Button
              leftIcon={<IconEraser />}
              variant="white"
              color="red"
              onClick={() => setParams(initialParams)}
            >
              {t('specimens_overview.delete_filters')}
            </Button>
          </>
        ) : null}
      </Box>
      <Flex className={classes.tableWrapper}>
        {metaTitleLoading || specimensLoading ? <Loader /> : null}
        {metaTitleError || specimensError ? <ShowError /> : null}
        {!metaTitle && !metaTitleLoading && !metaTitleError ? (
          <ShowInfoMessage
            message={t('specimens_overview.meta_title_not_found')}
          />
        ) : null}
        {!specimens?.specimens.length &&
        !specimensLoading &&
        !specimensError &&
        metaTitle ? (
          <ShowInfoMessage
            message={t('specimens_overview.specimens_not_found')}
          />
        ) : null}
        {specimens?.specimens.length && metaTitle ? (
          <MantineReactTable table={table} />
        ) : null}
      </Flex>
    </Flex>
  )
}

export default SpecimensOverview
