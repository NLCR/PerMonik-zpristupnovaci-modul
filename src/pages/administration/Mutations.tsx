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
import { useLanguageCode } from '../../utils/helperHooks'
import {
  EditableMutationSchema,
  TEditableMutation,
} from '../../schema/mutation'
import {
  useCreateMutationMutation,
  useMutationListQuery,
  useUpdateMutationMutation,
} from '../../api/mutation'

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

const initialState: TEditableMutation = {
  name: {
    cs: '',
    sk: '',
    en: '',
  },
}

const Mutations = () => {
  const { classes } = useStyles()
  const { t } = useTranslation()
  const [mutation, setMutation] = useState<TEditableMutation>(initialState)
  const [overlayVisible, setOverlayVisible] = useState(false)
  const { languageCode } = useLanguageCode()

  const {
    data: mutations,
    isLoading: mutationsLoading,
    isError: mutationsError,
  } = useMutationListQuery()

  const { mutateAsync: doUpdate, isPending: updatingMutation } =
    useUpdateMutationMutation()
  const { mutateAsync: doCreate, isPending: creatingMutation } =
    useCreateMutationMutation()

  const pendingMutation = updatingMutation || creatingMutation

  const handleSubmit = async () => {
    const validation = EditableMutationSchema.safeParse(mutation)
    if (!validation.success) {
      validation.error.errors.map((e) => toast.error(e.message))
      return
    }
    try {
      if (mutation.id) {
        await doUpdate(mutation)
      } else {
        await doCreate(mutation)
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
        {t('administration.mutations')}
      </Title>
      {mutationsLoading ? <Loader /> : null}
      {!mutationsLoading && mutationsError ? <ShowError /> : null}
      {!mutationsLoading && !mutationsError ? (
        <Flex className={classes.innerContainer}>
          <ScrollArea className={classes.scrollArea}>
            <Text
              className={clsx(classes.scrollAreaUser, {
                active: !mutation.id,
              })}
              onClick={() =>
                !pendingMutation ? setMutation(initialState) : null
              }
            >
              {t('administration.create_mutation')}
            </Text>
            {mutations?.map((p) => (
              <Text
                key={p.id}
                className={clsx(classes.scrollAreaUser, {
                  active: p.id === mutation?.id,
                })}
                onClick={() => (!pendingMutation ? setMutation(p) : null)}
              >
                {p.name[languageCode]}
              </Text>
            ))}
          </ScrollArea>
          <Divider orientation="vertical" className={classes.divider} />
          {mutation ? (
            <Flex className={classes.userContainer}>
              <Title order={4}>
                {mutation.id
                  ? mutations?.find((o) => o.id === mutation.id)?.name[
                      languageCode
                    ]
                  : t('administration.create_mutation')}
              </Title>
              <Flex gap={10}>
                <TextInput
                  label={t('administration.cs_name')}
                  value={mutation.name.cs}
                  // disabled={savingUser}
                  onChange={(event) =>
                    setMutation((prevState) => ({
                      ...prevState,
                      name: { ...prevState.name, cs: event.target.value },
                    }))
                  }
                />
                <TextInput
                  label={t('administration.sk_name')}
                  value={mutation.name.sk}
                  // disabled={savingUser}
                  onChange={(event) =>
                    setMutation((prevState) => ({
                      ...prevState,
                      name: { ...prevState.name, sk: event.target.value },
                    }))
                  }
                />
                <TextInput
                  label={t('administration.en_name')}
                  value={mutation.name.en}
                  // disabled={savingUser}
                  onChange={(event) =>
                    setMutation((prevState) => ({
                      ...prevState,
                      name: { ...prevState.name, en: event.target.value },
                    }))
                  }
                />
              </Flex>
              <Button
                className={classes.saveButton}
                onClick={() => handleSubmit()}
                disabled={!Object.values(mutation.name).every((e) => e.length)}
              >
                {mutation.id
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

export default Mutations
