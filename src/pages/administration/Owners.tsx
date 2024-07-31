import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { clsx } from 'clsx'
import { toast } from 'react-toastify'
import { styled } from '@mui/material/styles'
import { LoadingButton } from '@mui/lab'
import Loader from '../../components/Loader'
import ShowError from '../../components/ShowError'
import { EditableOwnerSchema, TEditableOwner } from '../../schema/owner'
import {
  useCreateOwnerMutation,
  useOwnerListQuery,
  useUpdateOwnerMutation,
} from '../../api/owner'

const Container = styled(Box)(() => ({
  position: 'relative',
}))

const ScrollArea = styled(Box)(({ theme }) => ({
  width: '30%',
  minWidth: theme.typography.pxToRem(200),
  maxWidth: theme.typography.pxToRem(300),
  paddingLeft: theme.spacing(1.25),
  paddingRight: theme.spacing(0.5),
  height: '55vh',
  overflowY: 'auto',
}))

const InnerContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(1.25),
  justifyItems: 'stretch',
  gap: theme.spacing(2.5),
}))

const FieldsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '55vh',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
}))

const StyledDivider = styled(Divider)(({ theme }) => ({
  borderColor: theme.palette.grey[300],
}))

const SaveButton = styled(LoadingButton)(() => ({
  width: 'fit-content',
}))

const initialState: TEditableOwner = {
  name: '',
  sigla: '',
}

const Owners = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [owner, setOwner] = useState<TEditableOwner>(initialState)

  const {
    data: owners,
    isLoading: ownersLoading,
    isError: ownersError,
  } = useOwnerListQuery()

  const { mutateAsync: doUpdate, isPending: updatingOwner } =
    useUpdateOwnerMutation()
  const { mutateAsync: doCreate, isPending: creatingOwner } =
    useCreateOwnerMutation()

  const pendingMutation = updatingOwner || creatingOwner

  const handleSubmit = async () => {
    const validation = EditableOwnerSchema.safeParse(owner)
    if (!validation.success) {
      validation.error.errors.map((e) => toast.error(e.message))
      return
    }
    try {
      if (owner.id) {
        await doUpdate(owner)
      } else {
        await doCreate(owner)
      }
      toast.success(t('common.saved_successfully'))
    } catch (e) {
      toast.error(t('common.error_occurred_somewhere'))
    }
  }

  return (
    <Container>
      <Typography
        variant="h5"
        sx={{ color: theme.palette.primary.main, fontWeight: '600' }}
      >
        {t('administration.owners')}
      </Typography>
      {ownersLoading ? <Loader /> : null}
      {!ownersLoading && ownersError ? <ShowError /> : null}
      {!ownersLoading && !ownersError ? (
        <InnerContainer>
          <ScrollArea>
            <Typography
              component="div"
              className={clsx({ active: !owner.id })}
              onClick={() => (!pendingMutation ? setOwner(initialState) : null)}
              sx={{
                marginTop: theme.spacing(0.875),
                marginBottom: theme.spacing(0.875),
                borderRadius: theme.shape.borderRadius,
                padding: `${theme.spacing(0.625)} ${theme.spacing(1.25)}`,
                cursor: 'pointer',
                '&:hover': {
                  color: theme.palette.grey['50'],
                  backgroundColor: theme.palette.grey['900'],
                },
                '&.active': {
                  color: theme.palette.grey['50'],
                  backgroundColor: theme.palette.grey['900'],
                },
              }}
            >
              {t('administration.create_meta_title')}
            </Typography>
            {owners?.map((m) => (
              <Typography
                key={m.id}
                component="div"
                className={clsx({ active: m.id === owner?.id })}
                onClick={() => (!pendingMutation ? setOwner(m) : null)}
                sx={{
                  marginTop: theme.spacing(0.875),
                  marginBottom: theme.spacing(0.875),
                  borderRadius: theme.shape.borderRadius,
                  padding: `${theme.spacing(0.625)} ${theme.spacing(1.25)}`,
                  cursor: 'pointer',
                  '&:hover': {
                    color: theme.palette.grey['50'],
                    backgroundColor: theme.palette.grey['900'],
                  },
                  '&.active': {
                    color: theme.palette.grey['50'],
                    backgroundColor: theme.palette.grey['900'],
                  },
                }}
              >
                {m.name}
              </Typography>
            ))}
          </ScrollArea>
          <StyledDivider orientation="vertical" />
          {owner ? (
            <FieldsContainer>
              <Typography variant="h5">
                {owner.id
                  ? owners?.find((o) => o.id === owner.id)?.name
                  : t('administration.create_owner')}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                }}
              >
                <TextField
                  size="small"
                  label={t('administration.name')}
                  value={owner.name}
                  // disabled={savingUser}
                  onChange={(event) =>
                    setOwner((prevState) => ({
                      ...prevState,
                      name: event.target.value,
                    }))
                  }
                />
                <TextField
                  size="small"
                  label={t('administration.sigla')}
                  value={owner.sigla}
                  // disabled={savingUser}
                  onChange={(event) =>
                    setOwner((prevState) => ({
                      ...prevState,
                      sigla: event.target.value,
                    }))
                  }
                />
              </Box>
              <SaveButton
                variant="contained"
                onClick={() => handleSubmit()}
                disabled={!owner.name.length || !owner.sigla.length}
                loading={pendingMutation}
              >
                {owner.id
                  ? t('administration.update')
                  : t('administration.create')}
              </SaveButton>
            </FieldsContainer>
          ) : null}
        </InnerContainer>
      ) : null}
    </Container>
  )
}

export default Owners
