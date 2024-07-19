import {
  Box,
  IconButton,
  Typography,
  Button,
  Tabs,
  Tab,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import React, { Suspense, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import TableRowsIcon from '@mui/icons-material/TableRows'
import { useMetaTitleQuery } from '../../api/metaTitle'
import Loader from '../../components/Loader'
import ShowError from '../../components/ShowError'
import ShowInfoMessage from '../../components/ShowInfoMessage'
import { useSpecimensOverviewStore } from '../../slices/useSpecimensOverviewStore'
import SpecimenDayDetailExampleImage from '../../assets/images/specimen-day-detail-example.png'
import Facets from './components/Facets'
import Calendar from './components/Calendar'
import MuiTable from './components/MuiTable'

const modalStyle = {
  position: 'absolute' as const,
  maxHeight: '250px',
  height: '80vh',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '600px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
}

const SpecimensOverview = () => {
  const { metaTitleId } = useParams()
  const [modalOpened, setModalOpened] = useState(false)
  const { t } = useTranslation()
  const {
    resetAll,
    calendarMinDate,
    setCalendarDate,
    calendarDate,
    view,
    setView,
  } = useSpecimensOverviewStore()

  const {
    data: metaTitle,
    isLoading: metaTitleLoading,
    isError: metaTitleError,
  } = useMetaTitleQuery(metaTitleId)

  useEffect(() => {
    resetAll()
  }, [resetAll])

  let showedDate
  if (calendarDate) {
    showedDate = dayjs(calendarDate).format('MMMM YYYY')
  }

  if (metaTitleLoading) {
    return <Loader />
  }

  if (metaTitleError) {
    return <ShowError />
  }

  if (!metaTitle) {
    return (
      <ShowInfoMessage message={t('specimens_overview.meta_title_not_found')} />
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        position: 'relative',
        width: '100%',
      }}
    >
      <Modal
        open={modalOpened}
        onClose={() => setModalOpened(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            color: '#fff',
            timeout: 500,
          },
        }}
      >
        <Fade in={modalOpened}>
          <Box sx={modalStyle}>
            <Typography
              sx={(theme) => ({
                color: theme.palette.blue['900'],
                fontSize: '24px',
                fontWeight: 'bold',
              })}
            >
              {t('specimens_overview.help')}
            </Typography>
            <Typography
              sx={{
                marginBottom: '5px',
                fontWeight: '600',
              }}
            >
              {t('specimens_overview.help_desc_1')}
            </Typography>
            <Typography
              sx={{
                marginBottom: '5px',
              }}
            >
              {t('specimens_overview.help_desc_2')}
            </Typography>
            <img
              alt="Help"
              src={SpecimenDayDetailExampleImage}
              width={200}
              style={{ marginBottom: '20px' }}
            />
            {/* <Text size="sm"> */}
            {/*  {t('specimens_overview.help_desc_3')} */}
            {/* </Text> */}
          </Box>
        </Fade>
      </Modal>
      <Box
        sx={{
          // width: '20%',
          width: '350px',
          // color: theme.colors.dark[9],
          padding: '16px',
          backgroundColor: 'white',
          textAlign: 'left',
          borderRadius: '8px',
          boxShadow: '8px',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        <Facets metaTitle={metaTitle} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingBottom: '16px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '8px',
          flexDirection: 'column',
          // overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            marginTop: '10px',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <Tabs
              value={view}
              onChange={(event, newValue) => setView(newValue)}
              sx={{
                width: 'fit-content',
              }}
            >
              <Tab
                label={t('specimens_overview.calendar')}
                value="calendar"
                icon={<CalendarMonthIcon />}
                iconPosition="start"
              />
              <Tab
                label={t('specimens_overview.table')}
                // disabled
                value="table"
                icon={<TableRowsIcon />}
                iconPosition="start"
              />
            </Tabs>
            <Box
              sx={(theme) => ({
                display: 'flex',
                marginLeft: '20px',
                fontSize: '14px',
                color: theme.palette.blue['900'],
                fontWeight: 'bolder',
                alignItems: 'center',
              })}
            >
              {showedDate && view === 'calendar' ? (
                <>
                  <Typography
                    sx={{
                      fontWeight: '600',
                      marginRight: '20px',
                    }}
                  >
                    {t('specimens_overview.showed_month')}:{' '}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '220px',
                    }}
                  >
                    <IconButton
                      sx={{
                        marginTop: '2px',
                      }}
                      disabled={
                        dayjs(calendarDate).diff(
                          dayjs(calendarMinDate),
                          'month'
                        ) <= 0
                      }
                      onClick={() => {
                        setCalendarDate(
                          dayjs(calendarDate).subtract(1, 'month').toDate()
                        )
                      }}
                    >
                      <KeyboardArrowLeftIcon />
                    </IconButton>{' '}
                    <Typography
                      sx={{
                        fontWeight: '600',
                        marginLeft: '10px',
                        marginRight: '10px',
                      }}
                    >
                      {showedDate}
                    </Typography>
                    <IconButton
                      sx={{
                        marginTop: '2px',
                      }}
                      onClick={() => {
                        setCalendarDate(
                          dayjs(calendarDate).add(1, 'month').toDate()
                        )
                      }}
                    >
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </Box>
                </>
              ) : null}
            </Box>
          </Box>
          {view === 'calendar' ? (
            <Button
              variant="contained"
              startIcon={<HelpOutlineIcon />}
              onClick={() => setModalOpened(true)}
            >
              {t('specimens_overview.help')}
            </Button>
          ) : null}
        </Box>
        {view === 'calendar' ? (
          <Calendar metaTitle={metaTitle} />
        ) : (
          <Suspense>
            {/* <Table metaTitle={metaTitle} /> */}
            <MuiTable metaTitle={metaTitle} />
          </Suspense>
        )}
      </Box>
    </Box>
  )
}

export default SpecimensOverview
