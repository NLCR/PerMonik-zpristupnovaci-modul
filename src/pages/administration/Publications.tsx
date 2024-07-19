import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Divider, Typography, useTheme, TextField } from '@mui/material'
import { clsx } from 'clsx'
import { toast } from 'react-toastify'
import styled from '@emotion/styled'
import { LoadingButton } from '@mui/lab'
import Loader from '../../components/Loader'
import ShowError from '../../components/ShowError'
import { useLanguageCode } from '../../utils/helperHooks'
import {
  EditablePublicationSchema,
  TEditablePublication,
} from '../../schema/publication'
import {
  useCreatePublicationMutation,
  usePublicationListQuery,
  useUpdatePublicationMutation,
} from '../../api/publication'

const Container = styled(Box)(({ theme }) => ({
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

const initialState: TEditablePublication = {
  name: {
    cs: '',
    sk: '',
    en: '',
  },
}

const Publications = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  const [publication, setPublication] =
    useState<TEditablePublication>(initialState)
  const { languageCode } = useLanguageCode()

  const {
    data: publications,
    isLoading: publicationsLoading,
    isError: publicationsError,
  } = usePublicationListQuery()

  const { mutateAsync: doUpdate, isPending: updatingPublication } =
    useUpdatePublicationMutation()
  const { mutateAsync: doCreate, isPending: creatingPublication } =
    useCreatePublicationMutation()

  const pendingMutation = updatingPublication || creatingPublication

  const handleSubmit = async () => {
    const validation = EditablePublicationSchema.safeParse(publication)
    if (!validation.success) {
      validation.error.errors.map((e) => toast.error(e.message))
      return
    }
    try {
      if (publication.id) {
        await doUpdate(publication)
      } else {
        await doCreate(publication)
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
        {t('administration.publications')}
      </Typography>
      {publicationsLoading ? <Loader /> : null}
      {!publicationsLoading && publicationsError ? <ShowError /> : null}
      {!publicationsLoading && !publicationsError ? (
        <InnerContainer>
          <ScrollArea>
            <Typography
              component="div"
              className={clsx({ active: !publication.id })}
              onClick={() =>
                !pendingMutation ? setPublication(initialState) : null
              }
              sx={{
                marginTop: theme.spacing(0.875),
                marginBottom: theme.spacing(0.875),
                borderRadius: theme.shape.borderRadius,
                padding: `${theme.spacing(0.625)} ${theme.spacing(1.25)}`,
                cursor: 'pointer',
                '&.active': {
                  backgroundColor: theme.palette.primary.light,
                },
              }}
            >
              {t('administration.create_meta_title')}
            </Typography>
            {publications?.map((m) => (
              <Typography
                key={m.id}
                component="div"
                className={clsx({ active: m.id === publication?.id })}
                onClick={() => (!pendingMutation ? setPublication(m) : null)}
                sx={{
                  marginTop: theme.spacing(0.875),
                  marginBottom: theme.spacing(0.875),
                  borderRadius: theme.shape.borderRadius,
                  padding: `${theme.spacing(0.625)} ${theme.spacing(1.25)}`,
                  cursor: 'pointer',
                  '&.active': {
                    backgroundColor: theme.palette.primary.light,
                  },
                }}
              >
                {m.name[languageCode]}
              </Typography>
            ))}
          </ScrollArea>
          <StyledDivider orientation="vertical" />
          {publication ? (
            <FieldsContainer>
              <Typography variant="h5">
                {publication.id
                  ? publications?.find((o) => o.id === publication.id)?.name[
                      languageCode
                    ]
                  : t('administration.create_publication')}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                }}
              >
                <TextField
                  size="small"
                  label={t('administration.cs_name')}
                  value={publication.name.cs}
                  // disabled={savingUser}
                  onChange={(event) =>
                    setPublication((prevState) => ({
                      ...prevState,
                      name: { ...prevState.name, cs: event.target.value },
                    }))
                  }
                />
                <TextField
                  size="small"
                  label={t('administration.sk_name')}
                  value={publication.name.sk}
                  // disabled={savingUser}
                  onChange={(event) =>
                    setPublication((prevState) => ({
                      ...prevState,
                      name: { ...prevState.name, sk: event.target.value },
                    }))
                  }
                />
                <TextField
                  size="small"
                  label={t('administration.en_name')}
                  value={publication.name.en}
                  // disabled={savingUser}
                  onChange={(event) =>
                    setPublication((prevState) => ({
                      ...prevState,
                      name: { ...prevState.name, en: event.target.value },
                    }))
                  }
                />
              </Box>
              <SaveButton
                variant="contained"
                onClick={() => handleSubmit()}
                disabled={
                  !Object.values(publication.name).every((e) => e.length)
                }
                loading={pendingMutation}
              >
                {publication.id
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

export default Publications
