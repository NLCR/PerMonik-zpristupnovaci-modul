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
import { TUser } from '../../@types/user'
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
  const [selectedUser, setSelectedUser] = useState<TUser>({
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

  const { mutateAsync: doSave, isPending: savingUser } = useUpdateUserMutation()

  useEffect(() => {
    if (users?.length) {
      setSelectedUser(users[0])
    }
  }, [users])

  const handleSave = () => {
    doSave(selectedUser)
      .then((data) => {
        if (data) {
          toast.success(t('common.saved_successfully'))
        }
      })
      .catch(() => {
        toast.error(t('common.error_when_saving'))
      })
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
                  active: u.id === selectedUser?.id,
                })}
                onClick={() => (!savingUser ? setSelectedUser(u) : null)}
              >
                {u.firstName} {u.lastName}
              </Text>
            ))}
          </ScrollArea>
          <Divider orientation="vertical" className={classes.divider} />
          {selectedUser && users ? (
            <Flex className={classes.userContainer}>
              <Title order={4}>
                {selectedUser.firstName} {selectedUser.lastName}
              </Title>
              <Flex gap={10}>
                <TextInput
                  label={t('administration.first_name')}
                  value={selectedUser.firstName}
                  // disabled={savingUser}
                  onChange={(event) =>
                    setSelectedUser((prevState) => ({
                      ...prevState,
                      firstName: event.target.value,
                    }))
                  }
                />
                <TextInput
                  label={t('administration.last_name')}
                  value={selectedUser.lastName}
                  // disabled={savingUser}
                  onChange={(event) =>
                    setSelectedUser((prevState) => ({
                      ...prevState,
                      lastName: event.target.value,
                    }))
                  }
                />
                <TextInput
                  label={t('administration.email')}
                  value={selectedUser.email}
                  // disabled={savingUser}
                  onChange={(event) =>
                    setSelectedUser((prevState) => ({
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
                  value={selectedUser.owners ? selectedUser.owners : []}
                  // disabled={savingUser}
                  data={owners.map((o) => ({
                    value: o.id.toString(),
                    label: o.name,
                  }))}
                  onChange={(values) =>
                    setSelectedUser((prevState) => ({
                      ...prevState,
                      owners: values,
                    }))
                  }
                />
                <Select
                  label={t('administration.role')}
                  value={selectedUser.role}
                  // disabled={savingUser}
                  data={[
                    { value: 'user', label: t('administration.user') },
                    { value: 'admin', label: t('administration.admin') },
                  ]}
                  onChange={(value) => {
                    if (value) {
                      setSelectedUser((prevState) => ({
                        ...prevState,
                        role: value as 'user' | 'admin',
                      }))
                    }
                  }}
                />
              </Flex>
              <Switch
                label={t('administration.user_active')}
                checked={selectedUser.active}
                // disabled={savingUser}
                onChange={(event) =>
                  setSelectedUser((prevState) => ({
                    ...prevState,
                    active: event.target.checked,
                  }))
                }
              />
              <Button
                className={classes.saveButton}
                onClick={() => handleSave()}
                // disabled={savingUser}
              >
                {t('administration.save')}
              </Button>
            </Flex>
          ) : null}
        </Flex>
      ) : null}
    </Box>
  )
}

export default Users
