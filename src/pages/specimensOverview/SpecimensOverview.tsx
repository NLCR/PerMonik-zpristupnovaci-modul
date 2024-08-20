import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Backdrop from '@mui/material/Backdrop'
import Button from '@mui/material/Button'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import React, { Suspense, useState } from 'react'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import TableRowsIcon from '@mui/icons-material/TableRows'
import { blue } from '@mui/material/colors'
import { useMetaTitleQuery } from '../../api/metaTitle'
import Loader from '../../components/Loader'
import ShowError from '../../components/ShowError'
import ShowInfoMessage from '../../components/ShowInfoMessage'
import { useSpecimensOverviewStore } from '../../slices/useSpecimensOverviewStore'
import SpecimenDayDetailExampleImage from '../../assets/images/specimen-day-detail-example.png'
import Facets from './components/Facets'
import Calendar from './components/Calendar'
import CalendarToolbar from './components/CalendarToolbar'

const Table = React.lazy(() => import('./components/Table'))

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
  borderRadius: '4px',
  boxShadow: 24,
  p: 4,
}

const SpecimensOverview = () => {
  const { metaTitleId } = useParams()
  const [modalOpened, setModalOpened] = useState(false)
  const { t } = useTranslation()
  const view = useSpecimensOverviewStore((state) => state.view)
  const setView = useSpecimensOverviewStore((state) => state.setView)

  const {
    data: metaTitle,
    isLoading: metaTitleLoading,
    isError: metaTitleError,
  } = useMetaTitleQuery(metaTitleId)

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
              sx={{
                color: blue['900'],
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '16px',
              }}
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
              sx={{
                display: 'flex',
                marginLeft: '20px',
                fontSize: '14px',
                color: blue['900'],
                fontWeight: 'bolder',
                alignItems: 'center',
              }}
            >
              {view === 'calendar' ? (
                <CalendarToolbar metaTitle={metaTitle} />
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
            <Table metaTitle={metaTitle} />
          </Suspense>
        )}
      </Box>
    </Box>
  )
}

export default SpecimensOverview
