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
import useUsersQuery from '../../api/query/administration/useUsersQuery'
import Loader from '../../components/reusableComponents/Loader'
import ShowError from '../../components/reusableComponents/ShowError'
import { TUser } from '../../@types/user'
import { owners } from '../../utils/constants'
import useSaveUserMutation from '../../api/query/administration/useSaveUserMutation'

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
    name: '',
    note: '',
    owner: '',
    role: 'user',
    userName: '',
  })
  const [overlayVisible, setOverlayVisible] = useState(false)

  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useUsersQuery()
  const { mutateAsync: doSave, isPending: savingUser } = useSaveUserMutation()

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
      {usersLoading ? <Loader /> : null}
      {!usersLoading && usersError ? <ShowError /> : null}
      {!usersLoading && !usersError && users ? (
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
                {u.name}
              </Text>
            ))}
          </ScrollArea>
          <Divider orientation="vertical" className={classes.divider} />
          {selectedUser && users ? (
            <Flex className={classes.userContainer}>
              <Title order={4}>
                {users.find((u) => u.id === selectedUser.id)?.name}
              </Title>
              <Flex gap={10}>
                <TextInput
                  label={t('administration.user_login_name')}
                  value={selectedUser.userName}
                  // disabled={savingUser}
                  onChange={(event) =>
                    setSelectedUser((prevState) => ({
                      ...prevState,
                      userName: event.target.value,
                    }))
                  }
                />
                <TextInput
                  label={t('administration.user_name')}
                  value={selectedUser.name}
                  // disabled={savingUser}
                  onChange={(event) =>
                    setSelectedUser((prevState) => ({
                      ...prevState,
                      name: event.target.value,
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
                <TextInput
                  label={t('administration.note')}
                  value={selectedUser.note ? selectedUser.note : ''}
                  // disabled={savingUser}
                  onChange={(event) =>
                    setSelectedUser((prevState) => ({
                      ...prevState,
                      note: event.target.value,
                    }))
                  }
                />
                <MultiSelect
                  sx={{
                    minWidth: rem(218),
                  }}
                  label={t('administration.owners')}
                  value={
                    selectedUser.owner ? selectedUser.owner.split(',') : []
                  }
                  // disabled={savingUser}
                  data={owners.map((o) => ({
                    value: o.id.toString(),
                    label: o.name,
                  }))}
                  onChange={(value) =>
                    setSelectedUser((prevState) => ({
                      ...prevState,
                      owner: value.join(','),
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
