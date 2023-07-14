/* eslint-disable react/prop-types */
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Checkbox, createStyles, Flex, Table, Title } from '@mantine/core'
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from 'mantine-react-table'
import { MRT_Localization_CS } from 'mantine-react-table/locales/cs'
import useVolumeDetailQuery from '../../api/query/useVolumeDetailQuery'
import Loader from '../../components/reusableComponents/Loader'
import ShowError from '../../components/reusableComponents/ShowError'
import ShowInfoMessage from '../../components/reusableComponents/ShowInfoMessage'
import { mutations, owners, publications } from '../../utils/constants'
import { formatDateWithDashesToString } from '../../utils/helperFunctions'
import { TSpecimen } from '../../@types/specimen'
import i18next from '../../i18next'

const useStyles = createStyles(() => ({
  borderBottomNone: {
    borderBottom: 'none !important',
  },
  verticalText: { writingMode: 'vertical-lr' },
}))

const columns: MRT_ColumnDef<TSpecimen>[] = [
  {
    accessorKey: 'publicationDate',
    header: i18next.t('volume_overview.date'),
    maxSize: 110,
    Cell: ({ row }) =>
      formatDateWithDashesToString(row.original.publicationDate),
  },
  {
    accessorKey: 'numExists',
    header: i18next.t('volume_overview.is_in_volume'),
    maxSize: 110,
    Cell: ({ row }) => <Checkbox checked={row.original.numExists} />,
  },
  {
    accessorKey: 'numMissing',
    header: i18next.t('volume_overview.missing_number'),
    maxSize: 110,
    Cell: ({ row }) => <Checkbox checked={row.original.numMissing} />,
  },
  {
    accessorKey: 'number',
    header: i18next.t('volume_overview.number'),
    maxSize: 110,
  },
  {
    accessorKey: 'number',
    id: 'attachment_number',
    header: i18next.t('volume_overview.attachment_number'),
    maxSize: 110,
    Cell: ({ row }) =>
      row.original.isAttachment ? row.original.number : undefined,
  },
  {
    accessorKey: 'mutation',
    header: i18next.t('volume_overview.mutation'),
    maxSize: 110,
    Cell: ({ row }) =>
      mutations.find((m) => m.id === Number(row.original.mutation))?.name,
  },
  {
    accessorKey: 'publication',
    header: i18next.t('volume_overview.publication'),
    maxSize: 110,
    Cell: ({ row }) =>
      publications.find((m) => m.id === Number(row.original.publication))?.name,
  },
  {
    accessorKey: 'name',
    header: i18next.t('volume_overview.name'),
    maxSize: 110,
  },
  {
    accessorKey: 'subName',
    header: i18next.t('volume_overview.sub_name'),
    maxSize: 110,
  },
  {
    accessorKey: 'pagesCount',
    header: i18next.t('volume_overview.pages_count'),
    maxSize: 110,
  },
  {
    accessorKey: 'publicationMark',
    header: i18next.t('volume_overview.publication_mark'),
    maxSize: 110,
  },
  {
    accessorKey: 'states',
    id: 'reviewed',
    header: i18next.t('facet_states.OK'),
    maxSize: 110,
    Cell: ({ row }) => (
      <Checkbox checked={row.original.states?.includes('OK')} />
    ),
  },
  {
    accessorKey: 'states',
    id: 'damaged_pages',
    header: i18next.t('facet_states.PP'),
    maxSize: 110,
    Cell: ({ row }) => (
      <Checkbox checked={row.original.states?.includes('PP')} />
    ),
  },
  {
    accessorKey: 'states',
    id: 'degradation',
    header: i18next.t('facet_states.Deg'),
    maxSize: 110,
    Cell: ({ row }) => (
      <Checkbox checked={row.original.states?.includes('Deg')} />
    ),
  },
  {
    accessorKey: 'states',
    id: 'missing_pages',
    header: i18next.t('facet_states.ChS'),
    maxSize: 110,
    Cell: ({ row }) => (
      <Checkbox checked={row.original.states?.includes('ChS')} />
    ),
  },
  {
    accessorKey: 'states',
    id: 'bad_pagination',
    header: i18next.t('facet_states.ChPag'),
    maxSize: 110,
    Cell: ({ row }) => (
      <Checkbox checked={row.original.states?.includes('ChPag')} />
    ),
  },
  {
    accessorKey: 'states',
    id: 'bad_date',
    header: i18next.t('facet_states.ChDatum'),
    maxSize: 110,
    Cell: ({ row }) => (
      <Checkbox checked={row.original.states?.includes('ChDatum')} />
    ),
  },
  {
    accessorKey: 'states',
    id: 'bad_numbering',
    header: i18next.t('facet_states.ChCis'),
    maxSize: 110,
    Cell: ({ row }) => (
      <Checkbox checked={row.original.states?.includes('ChCis')} />
    ),
  },
  {
    accessorKey: 'states',
    id: 'bad_bound',
    header: i18next.t('facet_states.ChSv'),
    maxSize: 110,
    Cell: ({ row }) => (
      <Checkbox checked={row.original.states?.includes('ChSv')} />
    ),
  },
  {
    accessorKey: 'states',
    id: 'cenzured',
    header: i18next.t('facet_states.Cz'),
    maxSize: 110,
    Cell: ({ row }) => (
      <Checkbox checked={row.original.states?.includes('Cz')} />
    ),
  },
  {
    accessorKey: 'note',
    header: i18next.t('volume_overview.note'),
    maxSize: 110,
  },
]

const VolumeOverview = () => {
  const { classes } = useStyles()
  const { volumeId } = useParams()
  const { t } = useTranslation()
  const {
    data: volume,
    isLoading: volumeLoading,
    isError: volumeError,
  } = useVolumeDetailQuery(volumeId as string)

  const table = useMantineReactTable({
    columns,
    data: volume?.specimens.specimenList || [],
    localization: MRT_Localization_CS,
    enableStickyHeader: true,
    enableFilters: false,
    enableSorting: false,
    enablePagination: false,
    // enableRowVirtualization: true,
    initialState: {
      density: 'xs',
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

  if (volumeLoading) return <Loader />
  if (volumeError) return <ShowError />
  if (!volume)
    return <ShowInfoMessage message={t('volume_overview.not_found')} />

  return (
    <Flex
      gap={20}
      sx={{
        alignItems: 'stretch',
      }}
    >
      <Flex
        direction="column"
        gap={20}
        sx={() => ({
          width: '35%',
          maxHeight: '80vh',
        })}
      >
        <Flex
          direction="column"
          sx={(theme) => ({
            maxHeight: '48%',
            // marginBottom: theme.spacing.md,
            padding: theme.spacing.md,
            backgroundColor: 'white',
            borderRadius: theme.spacing.xs,
            boxShadow: theme.shadows.xs,
            // maxHeight: '400px',
          })}
        >
          <Title
            order={5}
            sx={(theme) => ({
              marginBottom: theme.spacing.xs,
              color: theme.colors.blue[9],
            })}
          >
            {t('volume_overview.input_data')}
          </Title>
          <Table verticalSpacing="xs" fontSize="xs">
            <thead>
              <tr>
                <th className={classes.borderBottomNone}>
                  {t('volume_overview.name')}
                </th>
                <th className={classes.borderBottomNone}>
                  {t('volume_overview.value')}
                </th>
              </tr>
            </thead>
          </Table>
          <Flex
            direction="column"
            sx={(theme) => ({
              overflowY: 'auto',
              maxHeight: '100%',
              border: `1px solid ${theme.colors.gray[3]}`,
            })}
          >
            <Table verticalSpacing="xs" fontSize="xs">
              <tbody>
                <tr>
                  <td>{t('volume_overview.meta_title')}</td>
                  <td>{volume.metaTitle.name}</td>
                </tr>
                <tr>
                  <td>{t('volume_overview.mutation')}</td>
                  <td>
                    {
                      mutations.find(
                        (m) => m.id === Number(volume.volume.mutation)
                      )?.name
                    }
                  </td>
                </tr>
                <tr>
                  <td>{t('volume_overview.publication_mark')}</td>
                  <td>{volume.volume.publicationMark}</td>
                </tr>
                <tr>
                  <td>{t('volume_overview.bar_code')}</td>
                  <td>{volume.volume.barCode}</td>
                </tr>
                <tr>
                  <td>{t('volume_overview.signature')}</td>
                  <td>{volume.volume.signature}</td>
                </tr>
                <tr>
                  <td>{t('volume_overview.year')}</td>
                  <td>{volume.volume.year}</td>
                </tr>
                <tr>
                  <td>{t('volume_overview.date_from')}</td>
                  <td>
                    {formatDateWithDashesToString(volume.volume.dateFrom)}
                  </td>
                </tr>
                <tr>
                  <td>{t('volume_overview.date_to')}</td>
                  <td>{formatDateWithDashesToString(volume.volume.dateTo)}</td>
                </tr>
                <tr>
                  <td>{t('volume_overview.first_number')}</td>
                  <td>{volume.volume.firstNumber}</td>
                </tr>
                <tr>
                  <td>{t('volume_overview.last_number')}</td>
                  <td>{volume.volume.lastNumber}</td>
                </tr>
                <tr>
                  <td>{t('volume_overview.owner')}</td>
                  <td>
                    {
                      owners.find((o) => o.id === Number(volume.volume.owner))
                        ?.name
                    }
                  </td>
                </tr>
                <tr>
                  <td>{t('volume_overview.note')}</td>
                  <td>{volume.volume.note}</td>
                </tr>
              </tbody>
            </Table>
          </Flex>
        </Flex>
        <Flex
          direction="column"
          sx={(theme) => ({
            maxHeight: '48%',
            padding: theme.spacing.md,
            backgroundColor: 'white',
            borderRadius: theme.spacing.xs,
            boxShadow: theme.shadows.xs,
            // maxHeight: '400px',
          })}
        >
          <Title
            order={5}
            sx={(theme) => ({
              marginBottom: theme.spacing.xs,
              color: theme.colors.blue[9],
            })}
          >
            {t('volume_overview.daily_releases')}
          </Title>
          {/* <Table verticalSpacing="xs" fontSize="xs"> */}
          {/*  <thead> */}
          {/*    <tr> */}
          {/*      <th className={classes.borderBottomNone}> */}
          {/*        {t('volume_overview.releasing')} */}
          {/*      </th> */}
          {/*      <th className={classes.borderBottomNone}> */}
          {/*        {t('volume_overview.is_in_volume')} */}
          {/*      </th> */}
          {/*      <th className={classes.borderBottomNone}> */}
          {/*        {t('volume_overview.publication')} */}
          {/*      </th> */}
          {/*      <th className={classes.borderBottomNone}> */}
          {/*        {t('volume_overview.pages_count')} */}
          {/*      </th> */}
          {/*      <th className={classes.borderBottomNone}> */}
          {/*        {t('volume_overview.name')} */}
          {/*      </th> */}
          {/*      <th className={classes.borderBottomNone}> */}
          {/*        {t('volume_overview.sub_name')} */}
          {/*      </th> */}
          {/*    </tr> */}
          {/*  </thead> */}
          {/* </Table> */}
          <Flex
            direction="column"
            sx={() => ({
              overflowY: 'auto',
              maxHeight: '100%',
              // border: `1px solid ${theme.colors.gray[3]}`,
            })}
          >
            <Table verticalSpacing="xs" fontSize="xs">
              <thead>
                <tr>
                  <th>{t('volume_overview.releasing')}</th>
                  <th>{t('volume_overview.is_in_volume')}</th>
                  <th>{t('volume_overview.publication')}</th>
                  <th>{t('volume_overview.pages_count')}</th>
                  <th>{t('volume_overview.name')}</th>
                  <th>{t('volume_overview.sub_name')}</th>
                </tr>
              </thead>
              <tbody>
                {volume.volume.periodicity.map((p) => (
                  <tr key={p.day}>
                    <td>{t(`volume_overview.days.${p.day}`)}</td>
                    <td>
                      <Checkbox checked={p.active} />
                    </td>
                    <td>
                      {
                        publications.find(
                          (pb) => pb.id === Number(p.publication)
                        )?.name
                      }
                    </td>
                    <td>{p.pagesCount}</td>
                    <td>{p.name}</td>
                    <td>{p.subName}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Flex>
        </Flex>
      </Flex>

      <Flex
        direction="column"
        sx={(theme) => ({
          height: '100%',
          maxHeight: '80vh',
          // marginBottom: theme.spacing.md,
          padding: theme.spacing.md,
          backgroundColor: 'white',
          borderRadius: theme.spacing.xs,
          boxShadow: theme.shadows.xs,
          width: '65%',
          // maxHeight: '400px',
        })}
      >
        <Title
          order={5}
          sx={(theme) => ({
            marginBottom: theme.spacing.xs,
            color: theme.colors.blue[9],
          })}
        >
          {t('volume_overview.volume_description')}
        </Title>
        <MantineReactTable table={table} />
      </Flex>
    </Flex>
  )
}

export default VolumeOverview
