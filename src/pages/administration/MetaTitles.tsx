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
  Switch,
} from '@mantine/core'
import { useTranslation } from 'react-i18next'
import React, { useEffect, useState } from 'react'
import { clsx } from 'clsx'
import { toast } from 'react-toastify'
import Loader from '../../components/Loader'
import ShowError from '../../components/ShowError'
import {
  EditableMetaTitleSchema,
  TEditableMetaTitle,
} from '../../schema/metaTitle'
import {
  useCreateMetaTitleMutation,
  useMetaTitleListQuery,
  useUpdateMetaTitleMutation,
} from '../../api/metaTitle'

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

const initialState: TEditableMetaTitle = {
  name: '',
  note: '',
  isPublic: false,
}

const MetaTitles = () => {
  const { classes } = useStyles()
  const { t } = useTranslation()
  const [metaTitle, setMetaTitle] = useState<TEditableMetaTitle>(initialState)
  const [overlayVisible, setOverlayVisible] = useState(false)

  const {
    data: metaTitles,
    isLoading: metaTitlesLoading,
    isError: metaTitlesError,
  } = useMetaTitleListQuery()

  const { mutateAsync: doUpdate, isPending: updatingMetaTitle } =
    useUpdateMetaTitleMutation()
  const { mutateAsync: doCreate, isPending: creatingMetaTitle } =
    useCreateMetaTitleMutation()

  const pendingMutation = updatingMetaTitle || creatingMetaTitle

  const handleSubmit = async () => {
    const validation = EditableMetaTitleSchema.safeParse(metaTitle)
    if (!validation.success) {
      validation.error.errors.map((e) => toast.error(e.message))
      return
    }
    try {
      if (metaTitle.id) {
        await doUpdate(metaTitle)
      } else {
        await doCreate(metaTitle)
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
        {t('administration.meta_titles')}
      </Title>
      {metaTitlesLoading ? <Loader /> : null}
      {!metaTitlesLoading && metaTitlesError ? <ShowError /> : null}
      {!metaTitlesLoading && !metaTitlesError ? (
        <Flex className={classes.innerContainer}>
          <ScrollArea className={classes.scrollArea}>
            <Text
              className={clsx(classes.scrollAreaUser, {
                active: !metaTitle.id,
              })}
              onClick={() =>
                !pendingMutation ? setMetaTitle(initialState) : null
              }
            >
              {t('administration.create_meta_title')}
            </Text>
            {metaTitles?.map((m) => (
              <Text
                key={m.id}
                className={clsx(classes.scrollAreaUser, {
                  active: m.id === metaTitle?.id,
                })}
                onClick={() => (!pendingMutation ? setMetaTitle(m) : null)}
              >
                {m.name}
              </Text>
            ))}
          </ScrollArea>
          <Divider orientation="vertical" className={classes.divider} />
          {metaTitle ? (
            <Flex className={classes.userContainer}>
              <Title order={4}>
                {metaTitle.id
                  ? metaTitles?.find((o) => o.id === metaTitle.id)?.name
                  : t('administration.create_meta_title')}
              </Title>
              <Flex gap={10}>
                <TextInput
                  label={t('administration.name')}
                  value={metaTitle.name}
                  // disabled={savingUser}
                  onChange={(event) =>
                    setMetaTitle((prevState) => ({
                      ...prevState,
                      name: event.target.value,
                    }))
                  }
                />
                <TextInput
                  label={t('administration.note')}
                  value={metaTitle.note}
                  // disabled={savingUser}
                  onChange={(event) =>
                    setMetaTitle((prevState) => ({
                      ...prevState,
                      note: event.target.value,
                    }))
                  }
                />
              </Flex>
              <Switch
                label={t('administration.meta_title_is_public')}
                checked={metaTitle.isPublic}
                // disabled={savingUser}
                onChange={(event) =>
                  setMetaTitle((prevState) => ({
                    ...prevState,
                    isPublic: event.target.checked,
                  }))
                }
              />
              <Button
                className={classes.saveButton}
                onClick={() => handleSubmit()}
                disabled={!metaTitle.name.length}
              >
                {metaTitle.id
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

export default MetaTitles
