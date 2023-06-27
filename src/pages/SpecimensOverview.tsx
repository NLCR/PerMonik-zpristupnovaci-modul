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
import { IconFileSymlink } from '@tabler/icons-react'
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
}

const SpecimensOverview = () => {
  const { metaTitleId } = useParams()
  const { classes } = useStyles()
  const { t } = useTranslation()
  const [params, setParams] = useState<TParams>({
    dateStart: 0,
    dateEnd: 0,
  })
  const [volumeInput, setVolumeInput] = useDebouncedState('', 300)
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
    ...params,
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
      isLoading: specimensRefetching,
    },
    manualPagination: true,
    rowCount: specimens?.count,
    onPaginationChange: setPagination,
    mantinePaginationProps: {
      rowsPerPageOptions: ['25', '50', '100', '250'],
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
            <Text mt={10} fz="sm" fw={700}>
              {t('specimens_overview.date')}
            </Text>
            <RangeSlider
              mt="sm"
              step={1}
              min={datesMin}
              max={datesMax}
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
              onChange={(event) => setVolumeInput(event.target.value)}
            />
            <Text mt={10} mb={5} fz="sm" fw={700}>
              {t('specimens_overview.name')}
            </Text>
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
