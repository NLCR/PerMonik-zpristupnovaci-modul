import Typography from '@mui/material/Typography'
import { blue } from '@mui/material/colors'
import Box from '@mui/material/Box'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useManagedVolumeDetailQuery } from '../../../api/volume'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'

const TableHeader = () => {
  const { volumeId } = useParams()
  const { t } = useTranslation()

  const { data } = useManagedVolumeDetailQuery(volumeId)

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
      }}
    >
      <Typography
        sx={{
          color: blue['900'],
          fontWeight: 'bold',
          fontSize: '24px',
        }}
      >
        {t('volume_overview.volume_description')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: '2px',
          paddingRight: '8px',
        }}
      >
        <Typography>
          {`${t('volume_overview.volume_created_at')}: ${dayjs(data?.volume?.created).isValid() ? dayjs(data?.volume?.created).format('DD.MM.YYYY HH:mm:ss') : '---'}`}
        </Typography>
        <Typography>
          {`${t('volume_overview.volume_updated_at')}: ${dayjs(data?.volume?.updated).isValid() ? dayjs(data?.volume?.updated).format('DD.MM.YYYY HH:mm:ss') : '---'}`}
        </Typography>
      </Box>
    </Box>
  )
}

export default TableHeader
