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
  Select,
  MultiSelect,
  Switch,
  LoadingOverlay,
} from '@mantine/core'
import { useTranslation } from 'react-i18next'
import React, { useEffect, useState } from 'react'
import { clsx } from 'clsx'
import { toast } from 'react-toastify'
import { useUserListQuery, useUpdateUserMutation } from '../../api/user'
import Loader from '../../components/reusableComponents/Loader'
import ShowError from '../../components/reusableComponents/ShowError'
import { TUser, EditableUserSchema } from '../../schema/user'
import { useOwnerListQuery } from '../../api/owner'

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

const Users = () => {
  const { classes } = useStyles()
  const { t } = useTranslation()
  const [user, setUser] = useState<TUser>({
    active: false,
    email: '',
    id: '',
    firstName: '',
    lastName: '',
    owners: [],
    role: 'user',
    userName: '',
  })
  const [overlayVisible, setOverlayVisible] = useState(false)

  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useUserListQuery()
  const {
    data: owners,
    isLoading: ownersLoading,
    isError: ownersError,
  } = useOwnerListQuery()

  const { mutateAsync: doUpdate, isPending: savingUser } =
    useUpdateUserMutation()

  useEffect(() => {
    if (users?.length) {
      setUser(users[0])
    }
  }, [users])

  const handleUpdate = async () => {
    const validation = EditableUserSchema.safeParse(user)
    if (!validation.success) {
      validation.error.errors.map((e) => toast.error(e.message))
      return
    }

    try {
      await doUpdate(user)
      toast.success(t('common.saved_successfully'))
    } catch (e) {
      toast.error(t('common.error_occurred_somewhere'))
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (savingUser) {
      setOverlayVisible(true)
    } else {
      timer = setTimeout(() => {
        setOverlayVisible(false)
      }, 150)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [savingUser])

  return (
    <Box className={classes.container}>
      <LoadingOverlay
        visible={overlayVisible}
        loader={<Loader />}
        overlayBlur={1}
        transitionDuration={100}
      />
      <Title order={3} className={classes.title}>
        {t('administration.users')}
      </Title>
      {usersLoading || ownersLoading ? <Loader /> : null}
      {(!usersLoading && usersError) || (!ownersLoading && ownersError) ? (
        <ShowError />
      ) : null}
      {!usersLoading &&
      !usersError &&
      users &&
      !ownersLoading &&
      !ownersError &&
      owners ? (
        <Flex className={classes.innerContainer}>
          <ScrollArea className={classes.scrollArea}>
            {users.map((u) => (
              <Text
                key={u.id}
                className={clsx(classes.scrollAreaUser, {
                  active: u.id === user?.id,
                })}
                onClick={() => (!savingUser ? setUser(u) : null)}
              >
                {u.firstName} {u.lastName}
              </Text>
            ))}
          </ScrollArea>
          <Divider orientation="vertical" className={classes.divider} />
          {user && users ? (
            <Flex className={classes.userContainer}>
              <Title order={4}>
                {users.find((u) => u.id === user.id)?.firstName}
                {users.find((u) => u.id === user.id)?.lastName}
              </Title>
              <Flex gap={10}>
                <TextInput
                  label={t('administration.first_name')}
                  value={user.firstName}
                  // disabled={savingUser}
                  onChange={(event) =>
                    setUser((prevState) => ({
                      ...prevState,
                      firstName: event.target.value,
                    }))
                  }
                />
                <TextInput
                  label={t('administration.last_name')}
                  value={user.lastName}
                  // disabled={savingUser}
                  onChange={(event) =>
                    setUser((prevState) => ({
                      ...prevState,
                      lastName: event.target.value,
                    }))
                  }
                />
                <TextInput
                  label={t('administration.email')}
                  value={user.email}
                  // disabled={savingUser}
                  onChange={(event) =>
                    setUser((prevState) => ({
                      ...prevState,
                      email: event.target.value,
                    }))
                  }
                />
              </Flex>
              <Flex gap={10}>
                <MultiSelect
                  sx={{
                    minWidth: rem(218),
                  }}
                  label={t('administration.owners')}
                  value={user.owners ? user.owners : []}
                  // disabled={savingUser}
                  data={owners.map((o) => ({
                    value: o.id.toString(),
                    label: o.name,
                  }))}
                  onChange={(values) =>
                    setUser((prevState) => ({
                      ...prevState,
                      owners: values,
                    }))
                  }
                />
                <Select
                  label={t('administration.role')}
                  value={user.role}
                  // disabled={savingUser}
                  data={[
                    { value: 'user', label: t('administration.user') },
                    { value: 'admin', label: t('administration.admin') },
                  ]}
                  onChange={(value) => {
                    if (value) {
                      setUser((prevState) => ({
                        ...prevState,
                        role: value as 'user' | 'admin',
                      }))
                    }
                  }}
                />
              </Flex>
              <Switch
                label={t('administration.user_active')}
                checked={user.active}
                // disabled={savingUser}
                onChange={(event) =>
                  setUser((prevState) => ({
                    ...prevState,
                    active: event.target.checked,
                  }))
                }
              />
              <Button
                className={classes.saveButton}
                onClick={() => handleUpdate()}
                // disabled={savingUser}
              >
                {t('administration.update')}
              </Button>
            </Flex>
          ) : null}
        </Flex>
      ) : null}
    </Box>
  )
}

export default Users
