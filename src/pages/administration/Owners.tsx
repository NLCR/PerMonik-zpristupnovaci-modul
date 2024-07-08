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
import Loader from '../../components/reusableComponents/Loader'
import ShowError from '../../components/reusableComponents/ShowError'
import {
  useCreateOwnerMutation,
  useOwnerListQuery,
  useUpdateOwnerMutation,
} from '../../api/owner'
import { EditableOwnerSchema, TEditableOwner } from '../../schema/owner'

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

const initialState: TEditableOwner = {
  name: '',
  sigla: '',
}

const Owners = () => {
  const { classes } = useStyles()
  const { t } = useTranslation()
  const [owner, setOwner] = useState<TEditableOwner>(initialState)
  const [overlayVisible, setOverlayVisible] = useState(false)

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
        {t('administration.owners')}
      </Title>
      {ownersLoading ? <Loader /> : null}
      {!ownersLoading && ownersError ? <ShowError /> : null}
      {!ownersLoading && !ownersError ? (
        <Flex className={classes.innerContainer}>
          <ScrollArea className={classes.scrollArea}>
            <Text
              className={clsx(classes.scrollAreaUser, {
                active: !owner.id,
              })}
              onClick={() => (!pendingMutation ? setOwner(initialState) : null)}
            >
              {t('administration.create_owner')}
            </Text>
            {owners?.map((u) => (
              <Text
                key={u.id}
                className={clsx(classes.scrollAreaUser, {
                  active: u.id === owner?.id,
                })}
                onClick={() => (!pendingMutation ? setOwner(u) : null)}
              >
                {u.name}
              </Text>
            ))}
          </ScrollArea>
          <Divider orientation="vertical" className={classes.divider} />
          {owner ? (
            <Flex className={classes.userContainer}>
              <Title order={4}>
                {owner.id
                  ? owners?.find((o) => o.id === owner.id)?.name
                  : t('administration.create_owner')}
              </Title>
              <Flex gap={10}>
                <TextInput
                  label={t('administration.name')}
                  value={owner.name}
                  // disabled={savingUser}
                  onChange={(event) =>
                    setOwner((prevState) => ({
                      ...prevState,
                      name: event.target.value.trim(),
                    }))
                  }
                />
                <TextInput
                  label={t('administration.sigla')}
                  value={owner.sigla}
                  // disabled={savingUser}
                  onChange={(event) =>
                    setOwner((prevState) => ({
                      ...prevState,
                      sigla: event.target.value.trim(),
                    }))
                  }
                />
              </Flex>
              <Button
                className={classes.saveButton}
                onClick={() => handleSubmit()}
                disabled={!owner.name.length || !owner.sigla.length}
              >
                {owner.id
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

export default Owners
