import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'
import dayjs from 'dayjs'
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { useLanguageCode } from '../../../utils/helperHooks'
import { useVolumeManagementStore } from '../../../slices/useVolumeManagementStore'
import { TUser } from '../../../schema/user'
import { TMutation } from '../../../schema/mutation'
import { TOwner } from '../../../schema/owner'
import { TPublication } from '../../../schema/publication'
import { TMetaTitle } from '../../../schema/metaTitle'

interface InputDataProps {
  canEdit: boolean
  me: TUser
  mutations: TMutation[]
  owners: TOwner[]
  publications: TPublication[]
  metaTitles: TMetaTitle[]
}

const InputData: FC<InputDataProps> = ({
  canEdit,
  me,
  mutations,
  owners,
  publications,
  metaTitles,
}) => {
  const { t } = useTranslation()
  const { languageCode } = useLanguageCode()

  const volumeState = useVolumeManagementStore((state) => state.volumeState)
  const volumeActions = useVolumeManagementStore((state) => state.volumeActions)
  const volumePeriodicityActions = useVolumeManagementStore(
    (state) => state.volumePeriodicityActions
  )

  return (
    <Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('volume_overview.name')}</TableCell>
            <TableCell>{t('volume_overview.value')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{t('volume_overview.meta_title')}</TableCell>
            <TableCell>
              <Select
                size="small"
                sx={{
                  minWidth: '218px',
                }}
                value={volumeState.metaTitleId}
                disabled={!canEdit}
                onChange={(event) =>
                  volumeActions.setMetaTitleId(event.target.value as string)
                }
              >
                {metaTitles.map((o) => (
                  <MenuItem key={o.id} value={o.id}>
                    {o.name}
                  </MenuItem>
                ))}
              </Select>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('volume_overview.mutation')}</TableCell>
            <TableCell>
              <Select
                size="small"
                sx={{
                  minWidth: '218px',
                }}
                value={volumeState.mutationId}
                disabled={!canEdit}
                onChange={(event) =>
                  volumeActions.setMutationId(event.target.value as string)
                }
              >
                {mutations.map((o) => (
                  <MenuItem key={o.id} value={o.id}>
                    {o.name[languageCode]}
                  </MenuItem>
                ))}
              </Select>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('volume_overview.publication_mark')}</TableCell>
            <TableCell>TODO</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('volume_overview.bar_code')}</TableCell>
            <TableCell>
              <TextField
                size="small"
                value={volumeState.barCode}
                disabled={!canEdit}
                onChange={(event) =>
                  volumeActions.setBarCode(event.target.value)
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('volume_overview.signature')}</TableCell>
            <TableCell>
              <TextField
                size="small"
                value={volumeState.signature}
                disabled={!canEdit}
                onChange={(event) =>
                  volumeActions.setSignature(event.target.value)
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('volume_overview.year')}</TableCell>
            <TableCell>
              <TextField
                size="small"
                value={volumeState.year}
                disabled={!canEdit}
                onChange={(event) =>
                  volumeActions.setYear(event.target.value.replace(/\D/g, ''))
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('volume_overview.date_from')}</TableCell>
            <TableCell>
              TODO
              {/* {dayjs(volume.volume.dateFrom).format('DD. MMMM YYYY')} */}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('volume_overview.date_to')}</TableCell>
            <TableCell>
              TODO
              {/* {dayjs(volume.volume.dateTo).format('DD. MMMM YYYY')} */}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('volume_overview.first_number')}</TableCell>
            <TableCell>
              <TextField
                size="small"
                value={volumeState.firstNumber}
                disabled={!canEdit}
                onChange={(event) =>
                  volumeActions.setFirstNumber(
                    event.target.value.replace(/\D/g, '')
                  )
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('volume_overview.last_number')}</TableCell>
            <TableCell>
              <TextField
                size="small"
                value={volumeState.lastNumber}
                disabled={!canEdit}
                onChange={(event) =>
                  volumeActions.setLastNumber(
                    event.target.value.replace(/\D/g, '')
                  )
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('volume_overview.owner')}</TableCell>
            <TableCell>
              <Select
                size="small"
                sx={{
                  minWidth: '218px',
                }}
                value={volumeState.ownerId}
                disabled={!canEdit}
                onChange={(event) =>
                  volumeActions.setOwnerId(event.target.value as string)
                }
              >
                {owners
                  .filter((o) => me.owners.includes(o.id))
                  .map((o) => (
                    <MenuItem key={o.id} value={o.id}>
                      {o.name}
                    </MenuItem>
                  ))}
              </Select>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('volume_overview.note')}</TableCell>
            <TableCell>
              <TextField
                size="small"
                value={volumeState.note}
                disabled={!canEdit}
                onChange={(event) => volumeActions.setNote(event.target.value)}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('volume_overview.releasing')}</TableCell>
            <TableCell>{t('volume_overview.is_in_volume')}</TableCell>
            <TableCell>{t('volume_overview.publication')}</TableCell>
            <TableCell>{t('volume_overview.pages_count')}</TableCell>
            <TableCell>{t('volume_overview.name')}</TableCell>
            <TableCell>{t('volume_overview.sub_name')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {volumeState.periodicity.map((p, index) => (
            <TableRow key={p.day}>
              <TableCell>{t(`volume_overview.days.${p.day}`)}</TableCell>
              <TableCell>
                <Checkbox
                  size="small"
                  checked={p.active}
                  onChange={(event) =>
                    volumePeriodicityActions.setActive(
                      event.target.checked,
                      index
                    )
                  }
                  disabled={!canEdit}
                  sx={{
                    // marginTop: 1,
                    // marginBottom: 1,
                    cursor: 'pointer',
                    // width: '100%',
                  }}
                />
                {/* <Checkbox */}
                {/*  disabled={!canEdit} */}
                {/*  checked={p.active} */}
                {/*  onChange={(event) => */}
                {/*    volumePeriodicityActions.setActive( */}
                {/*      event.target.checked, */}
                {/*      index */}
                {/*    ) */}
                {/*  } */}
                {/* /> */}
              </TableCell>
              <TableCell>
                <Select
                  size="small"
                  sx={{
                    minWidth: '218px',
                  }}
                  value={p.publication}
                  disabled={!canEdit}
                  onChange={(event) =>
                    volumePeriodicityActions.setPublicationId(
                      event.target.value,
                      index
                    )
                  }
                >
                  {publications.map((o) => (
                    <MenuItem key={o.id} value={o.id}>
                      {o.name[languageCode]}
                    </MenuItem>
                  ))}
                </Select>
                {/* <Select */}
                {/*  disabled={!canEdit} */}
                {/*  data={ */}
                {/*    publications.map((pub) => ({ */}
                {/*      value: pub.id, */}
                {/*      label: pub.name[languageCode], */}
                {/*    })) || [] */}
                {/*  } */}
                {/*  value={p.publication} */}
                {/*  onChange={(value) => */}
                {/*    volumePeriodicityActions.setPublicationId(value, index) */}
                {/*  } */}
                {/* /> */}
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  value={p.pagesCount}
                  disabled={!canEdit}
                  onChange={(event) =>
                    volumePeriodicityActions.setPagesCount(
                      event.target.value.replace(/\D/g, ''),
                      index
                    )
                  }
                />
                {/* <TextInput */}
                {/*  disabled={!canEdit} */}
                {/*  value={p.pagesCount} */}
                {/*  onChange={(event) => */}
                {/*    volumePeriodicityActions.setPagesCount( */}
                {/*      event.target.value.replace(/\D/g, ''), */}
                {/*      index */}
                {/*    ) */}
                {/*  } */}
                {/* /> */}
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  value={p.name}
                  disabled={!canEdit}
                  onChange={(event) =>
                    volumePeriodicityActions.setName(event.target.value, index)
                  }
                />
                {/* <TextInput */}
                {/*  disabled={!canEdit} */}
                {/*  value={p.name} */}
                {/*  onChange={(event) => */}
                {/*    volumePeriodicityActions.setName(event.target.value, index) */}
                {/*  } */}
                {/* /> */}
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  value={p.subName}
                  disabled={!canEdit}
                  onChange={(event) =>
                    volumePeriodicityActions.setSubName(
                      event.target.value,
                      index
                    )
                  }
                />
                {/* <TextInput */}
                {/*  disabled={!canEdit} */}
                {/*  value={p.subName} */}
                {/*  onChange={(event) => */}
                {/*    volumePeriodicityActions.setSubName( */}
                {/*      event.target.value, */}
                {/*      index */}
                {/*    ) */}
                {/*  } */}
                {/* /> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
  //
  // return (
  //   <Flex
  //     direction="column"
  //     sx={() => ({
  //       // width: '35%',
  //       width: '23%',
  //       maxHeight: '80vh',
  //       justifyContent: 'space-between',
  //     })}
  //   >
  //     <Flex
  //       direction="column"
  //       sx={(theme) => ({
  //         // maxHeight: '49%',
  //         height: '100%',
  //         padding: theme.spacing.md,
  //         backgroundColor: 'white',
  //         borderRadius: theme.spacing.xs,
  //         boxShadow: theme.shadows.xs,
  //       })}
  //     >
  //       <Title
  //         order={5}
  //         sx={(theme) => ({
  //           marginBottom: theme.spacing.xs,
  //           color: theme.colors.blue[9],
  //         })}
  //       >
  //         {t('volume_overview.volume_information')}
  //       </Title>
  //       <ScrollArea
  //         onScrollPositionChange={({ y }) => setInputDataScrolled(y !== 0)}
  //       >
  //         <Table verticalSpacing="xs" fontSize="xs">
  //           <thead
  //             className={cx(classes.header, {
  //               [classes.scrolled]: inputDataScrolled,
  //             })}
  //           >
  //             <tr>
  //               <th className={classes.borderBottomNone}>
  //                 {t('volume_overview.name')}
  //               </th>
  //               <th className={classes.borderBottomNone}>
  //                 {t('volume_overview.value')}
  //               </th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             <tr>
  //               <td>{t('volume_overview.meta_title')}</td>
  //               <td>
  //                 <Select
  //                   disabled={!canEdit}
  //                   data={
  //                     metaTitles.map((m) => ({
  //                       value: m.id,
  //                       label: m.name,
  //                     })) || []
  //                   }
  //                   value={volumeState.metaTitleId}
  //                   onChange={(value) => volumeActions.setMetaTitleId(value)}
  //                 />
  //               </td>
  //             </tr>
  //             <tr>
  //               <td>{t('volume_overview.mutation')}</td>
  //               <td>
  //                 <Select
  //                   disabled={!canEdit}
  //                   data={
  //                     mutations.map((m) => ({
  //                       value: m.id,
  //                       label: m.name[languageCode],
  //                     })) || []
  //                   }
  //                   value={volumeState.mutationId}
  //                   onChange={(value) => volumeActions.setMutationId(value)}
  //                 />
  //               </td>
  //             </tr>
  //             <tr>
  //               <td>{t('volume_overview.publication_mark')}</td>
  //               {/* TODO: add tags input in mantine v7 */}
  //               <td>
  //                 {/* <TextInput */}
  //                 {/*  value={volumeState.publicationMark} */}
  //                 {/*  // onChange={(event) => */}
  //                 {/*  //   volumeActions.setPublicationMark(event.target.value) */}
  //                 {/*  // } */}
  //                 {/* /> */}
  //                 <MultiSelect
  //                   disabled={!canEdit}
  //                   data={['●', '○', '■', '□', '★', '☆', '△', '▲', '✶'].filter(
  //                     (i) =>
  //                       volumeState.publicationMark
  //                         ? volumeState.publicationMark.includes(i)
  //                         : true
  //                   )}
  //                   disableSelectedItemFiltering
  //                   placeholder=""
  //                   label=""
  //                   value={volumeState.publicationMark.split('')}
  //                   onChange={(value) =>
  //                     volumeActions.setPublicationMark(value.join(''))
  //                   }
  //                 />
  //               </td>
  //             </tr>
  //             <tr>
  //               <td>{t('volume_overview.bar_code')}</td>
  //               <td>
  //                 <TextInput
  //                   disabled={!canEdit}
  //                   value={volumeState.barCode}
  //                   onChange={(event) =>
  //                     volumeActions.setBarCode(event.target.value)
  //                   }
  //                 />
  //               </td>
  //             </tr>
  //             <tr>
  //               <td>{t('volume_overview.signature')}</td>
  //               <td>
  //                 <TextInput
  //                   disabled={!canEdit}
  //                   value={volumeState.signature}
  //                   onChange={(event) =>
  //                     volumeActions.setSignature(event.target.value)
  //                   }
  //                 />
  //               </td>
  //             </tr>
  //             <tr>
  //               <td>{t('volume_overview.year')}</td>
  //               <td>
  //                 <TextInput
  //                   disabled={!canEdit}
  //                   value={volumeState.year}
  //                   onChange={(event) =>
  //                     volumeActions.setYear(
  //                       event.target.value.replace(/\D/g, '')
  //                     )
  //                   }
  //                 />
  //               </td>
  //             </tr>
  //             <tr>
  //               <td>{t('volume_overview.date_from')}</td>
  //               <td>
  //                 <DateInput
  //                   disabled={!canEdit}
  //                   valueFormat="DD. MMMM YYYY"
  //                   label=""
  //                   placeholder=""
  //                   onChange={(value) =>
  //                     volumeActions.setDateFrom(
  //                       dayjs(value).format('YYYY-MM-DD')
  //                     )
  //                   }
  //                   value={
  //                     dayjs(volumeState.dateFrom).isValid()
  //                       ? dayjs(volumeState.dateFrom).toDate()
  //                       : null
  //                   }
  //                 />
  //               </td>
  //             </tr>
  //             <tr>
  //               <td>{t('volume_overview.date_to')}</td>
  //               <td>
  //                 <DateInput
  //                   disabled={!canEdit}
  //                   valueFormat="DD. MMMM YYYY"
  //                   label=""
  //                   placeholder=""
  //                   minDate={
  //                     dayjs(volumeState.dateFrom).isValid()
  //                       ? dayjs(volumeState.dateFrom).toDate()
  //                       : undefined
  //                   }
  //                   onChange={(value) =>
  //                     volumeActions.setDateTo(dayjs(value).format('YYYY-MM-DD'))
  //                   }
  //                   value={
  //                     dayjs(volumeState.dateTo).isValid()
  //                       ? dayjs(volumeState.dateTo).toDate()
  //                       : null
  //                   }
  //                 />
  //               </td>
  //             </tr>
  //             <tr>
  //               <td>{t('volume_overview.first_number')}</td>
  //               <td>
  //                 <TextInput
  //                   disabled={!canEdit}
  //                   value={volumeState.firstNumber}
  //                   onChange={(event) =>
  //                     volumeActions.setFirstNumber(event.target.value)
  //                   }
  //                 />
  //               </td>
  //             </tr>
  //             <tr>
  //               <td>{t('volume_overview.last_number')}</td>
  //               <td>
  //                 <TextInput
  //                   disabled={!canEdit}
  //                   value={volumeState.lastNumber}
  //                   onChange={(event) =>
  //                     volumeActions.setLastNumber(event.target.value)
  //                   }
  //                 />
  //               </td>
  //             </tr>
  //             <tr>
  //               <td>{t('volume_overview.owner')}</td>
  //               <td>
  //                 <Select
  //                   disabled={!canEdit || !!volumeState.id}
  //                   data={
  //                     owners
  //                       .filter((o) => me.owners.includes(o.id))
  //                       .map((o) => ({
  //                         value: o.id,
  //                         label: o.name,
  //                       })) || []
  //                   }
  //                   value={volumeState.ownerId}
  //                   onChange={(value) => volumeActions.setOwnerId(value)}
  //                 />
  //               </td>
  //             </tr>
  //             <tr>
  //               <td>{t('volume_overview.note')}</td>
  //               <td>
  //                 <TextInput
  //                   disabled={!canEdit}
  //                   value={volumeState.note}
  //                   onChange={(event) =>
  //                     volumeActions.setNote(event.target.value)
  //                   }
  //                 />
  //               </td>
  //             </tr>
  //           </tbody>
  //         </Table>
  //       </ScrollArea>
  //     </Flex>
  //     <Flex
  //       direction="column"
  //       sx={(theme) => ({
  //         maxHeight: '49%',
  //         padding: theme.spacing.md,
  //         backgroundColor: 'white',
  //         borderRadius: theme.spacing.xs,
  //         boxShadow: theme.shadows.xs,
  //         // maxHeight: '400px',
  //       })}
  //     >
  //       <Title
  //         order={5}
  //         sx={(theme) => ({
  //           marginBottom: theme.spacing.xs,
  //           color: theme.colors.blue[9],
  //         })}
  //       >
  //         {t('volume_overview.daily_releases')}
  //       </Title>
  //       <ScrollArea
  //         onScrollPositionChange={({ y }) => setDailyReleasesScrolled(y !== 0)}
  //       >
  //         <Table verticalSpacing="xs" fontSize="xs">
  //           <thead
  //             className={cx(classes.header, {
  //               [classes.scrolled]: dailyReleasesScrolled,
  //             })}
  //           >
  //             <tr>
  //               <th>{t('volume_overview.releasing')}</th>
  //               <th>{t('volume_overview.is_in_volume')}</th>
  //               <th>{t('volume_overview.publication')}</th>
  //               <th>{t('volume_overview.pages_count')}</th>
  //               <th>{t('volume_overview.name')}</th>
  //               <th>{t('volume_overview.sub_name')}</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {volumeState.periodicity.map((p, index) => (
  //               <tr key={p.day}>
  //                 <td>{t(`volume_overview.days.${p.day}`)}</td>
  //                 <td>
  //                   <Checkbox
  //                     disabled={!canEdit}
  //                     checked={p.active}
  //                     onChange={(event) =>
  //                       volumePeriodicityActions.setActive(
  //                         event.target.checked,
  //                         index
  //                       )
  //                     }
  //                   />
  //                 </td>
  //                 <td>
  //                   <Select
  //                     disabled={!canEdit}
  //                     data={
  //                       publications.map((pub) => ({
  //                         value: pub.id,
  //                         label: pub.name[languageCode],
  //                       })) || []
  //                     }
  //                     value={p.publication}
  //                     onChange={(value) =>
  //                       volumePeriodicityActions.setPublicationId(value, index)
  //                     }
  //                   />
  //                 </td>
  //                 <td>
  //                   <TextInput
  //                     disabled={!canEdit}
  //                     value={p.pagesCount}
  //                     onChange={(event) =>
  //                       volumePeriodicityActions.setPagesCount(
  //                         event.target.value.replace(/\D/g, ''),
  //                         index
  //                       )
  //                     }
  //                   />
  //                 </td>
  //                 <td>
  //                   <TextInput
  //                     disabled={!canEdit}
  //                     value={p.name}
  //                     onChange={(event) =>
  //                       volumePeriodicityActions.setName(
  //                         event.target.value,
  //                         index
  //                       )
  //                     }
  //                   />
  //                 </td>
  //                 <td>
  //                   <TextInput
  //                     disabled={!canEdit}
  //                     value={p.subName}
  //                     onChange={(event) =>
  //                       volumePeriodicityActions.setSubName(
  //                         event.target.value,
  //                         index
  //                       )
  //                     }
  //                   />
  //                 </td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </Table>
  //       </ScrollArea>
  //     </Flex>
  //   </Flex>
  // )
}

export default InputData
