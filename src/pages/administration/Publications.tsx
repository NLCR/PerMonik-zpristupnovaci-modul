import {
  Text,
  createStyles,
  Flex,
  rem,
  ScrollArea,
  Title,
  Box,
  Divider,
  Button,
  TextInput,
  LoadingOverlay,
} from '@mantine/core'
import { useTranslation } from 'react-i18next'
import React, { useEffect, useState } from 'react'
import { clsx } from 'clsx'
import { toast } from 'react-toastify'
import Loader from '../../components/Loader'
import ShowError from '../../components/ShowError'
import {
  EditablePublicationSchema,
  TEditablePublication,
} from '../../schema/publication'
import {
  useCreatePublicationMutation,
  usePublicationListQuery,
  useUpdatePublicationMutation,
} from '../../api/publication'
import { useLanguageCode } from '../../utils/helperHooks'

const useStyles = createStyles((theme) => ({
  container: {
    position: 'relative',
  },
  title: {
    color: theme.colors.blue[9],
  },
  scrollArea: {
    width: '30%',
    minWidth: rem(200),
    maxWidth: rem(300),
    paddingLeft: rem(10),
    height: '55vh',
  },
  scrollAreaUser: {
    marginTop: rem(7),
    marginBottom: rem(7),
    borderRadius: theme.radius.sm,
    padding: `${rem(5)} ${rem(10)}`,
    cursor: 'pointer',
    '&.active': {
      backgroundColor: theme.colors.blue[0],
    },
  },
  innerContainer: {
    marginTop: rem(10),
    justifyItems: 'stretch',
    gap: rem(20),
    // height: '100%',
    // flexDirection: 'row',
    // justifyContent: 'flex-start',
  },
  userContainer: {
    height: '55vh',
    flexDirection: 'column',
    gap: rem(20),
  },
  divider: {
    borderColor: theme.colors.gray[3],
  },
  saveButton: {
    width: 'fit-content',
  },
}))

const initialState: TEditablePublication = {
  name: {
    cs: '',
    sk: '',
    en: '',
  },
}

const Publications = () => {
  const { classes } = useStyles()
  const { t } = useTranslation()
  const [publication, setPublication] =
    useState<TEditablePublication>(initialState)
  const [overlayVisible, setOverlayVisible] = useState(false)
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

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (pendingMutation) {
      setOverlayVisible(true)
    } else {
      timer = setTimeout(() => {
        setOverlayVisible(false)
      }, 150)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [pendingMutation])

  return (
    <Box className={classes.container}>
      <LoadingOverlay
        visible={overlayVisible}
        loader={<Loader />}
        overlayBlur={1}
        transitionDuration={100}
      />
      <Title order={3} className={classes.title}>
        {t('administration.publications')}
      </Title>
      {publicationsLoading ? <Loader /> : null}
      {!publicationsLoading && publicationsError ? <ShowError /> : null}
      {!publicationsLoading && !publicationsError ? (
        <Flex className={classes.innerContainer}>
          <ScrollArea className={classes.scrollArea}>
            <Text
              className={clsx(classes.scrollAreaUser, {
                active: !publication.id,
              })}
              onClick={() =>
                !pendingMutation ? setPublication(initialState) : null
              }
            >
              {t('administration.create_publication')}
            </Text>
            {publications?.map((p) => (
              <Text
                key={p.id}
                className={clsx(classes.scrollAreaUser, {
                  active: p.id === publication?.id,
                })}
                onClick={() => (!pendingMutation ? setPublication(p) : null)}
              >
                {p.name[languageCode]}
              </Text>
            ))}
          </ScrollArea>
          <Divider orientation="vertical" className={classes.divider} />
          {publication ? (
            <Flex className={classes.userContainer}>
              <Title order={4}>
                {publication.id
                  ? publications?.find((o) => o.id === publication.id)?.name[
                      languageCode
                    ]
                  : t('administration.create_publication')}
              </Title>
              <Flex gap={10}>
                <TextInput
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
                <TextInput
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
                <TextInput
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
              </Flex>
              <Button
                className={classes.saveButton}
                onClick={() => handleSubmit()}
                disabled={
                  !Object.values(publication.name).every((e) => e.length)
                }
              >
                {publication.id
                  ? t('administration.update')
                  : t('administration.create')}
              </Button>
            </Flex>
          ) : null}
        </Flex>
      ) : null}
    </Box>
  )
}

export default Publications
