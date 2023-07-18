import {
  createStyles,
  Header as MHeader,
  Container,
  Group,
  Burger,
  rem,
  Menu,
  Image,
  UnstyledButton,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { IconChevronDown } from '@tabler/icons-react'
import Logo from '../assets/logo.png'
import Czech from '../assets/images/czech-republic.png'
import Slovakia from '../assets/images/slovakia.png'
import English from '../assets/images/united-states.png'
import { changeLanguage, TSupportedLanguages } from '../i18next'

const useStyles = createStyles((theme, { opened }: { opened: boolean }) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  headerContainer: {
    backgroundColor: theme.colors.blue,
  },
  links: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('xs')]: {
      display: 'none',
    },
  },
  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.dark[9],
    fontSize: theme.fontSizes.md,
    fontWeight: 500,
    backgroundColor: theme.colors.blue[8],
    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
    '&.active, &.active:hover': {
      backgroundColor: theme.fn.variant({
        variant: 'light',
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
        .color,
    },
  },
  languageControl: {
    marginLeft: rem(30),
    width: rem(200),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2]
    }`,
    transition: 'background-color 150ms ease',
    backgroundColor:
      // eslint-disable-next-line no-nested-ternary
      theme.colorScheme === 'dark'
        ? theme.colors.dark[opened ? 5 : 6]
        : opened
        ? theme.colors.gray[0]
        : theme.white,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },
  languageLabel: {
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,
  },
  languageIcon: {
    transition: 'transform 150ms ease',
    transform: opened ? 'rotate(180deg)' : 'rotate(0deg)',
  },
}))

const data: { shorthand: TSupportedLanguages; label: string; image: string }[] =
  [
    { shorthand: 'cs', label: 'Czech', image: Czech },
    { shorthand: 'sk', label: 'Slovak', image: Slovakia },
    { shorthand: 'en', label: 'English', image: English },
  ]

const Header = () => {
  const [langOpened, setLangOpened] = useState(false)
  const [opened, { toggle }] = useDisclosure(false)
  const { t, i18n } = useTranslation()
  const { classes } = useStyles({ opened: langOpened })

  const items = data.map((item) => (
    <Menu.Item
      icon={<Image src={item.image} width={18} height={18} />}
      onClick={() => changeLanguage(item.shorthand)}
      key={item.label}
    >
      {item.label}
    </Menu.Item>
  ))

  return (
    <MHeader height={60} className={classes.headerContainer}>
      <Container className={classes.header} size="xxl">
        <Link to={`/${i18n.resolvedLanguage}/`}>
          <img src={Logo} alt="Logo" />
        </Link>
        <Group spacing={5} className={classes.links}>
          <NavLink to={`/${i18n.resolvedLanguage}/`} className={classes.link}>
            {t('header.home')}
          </NavLink>
          {/* <NavLink to={`/${t('urls.login')}`} className={classes.link}> */}
          {/*  {t('header.login')} */}
          {/* </NavLink> */}
          <Menu
            onOpen={() => setLangOpened(true)}
            onClose={() => setLangOpened(false)}
            radius="md"
            width="target"
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton className={classes.languageControl}>
                <Group spacing="xs">
                  <Image
                    src={
                      data.find((l) => l.shorthand === i18n.resolvedLanguage)
                        ?.image
                    }
                    width={22}
                    height={22}
                  />
                  <span className={classes.languageLabel}>
                    {
                      data.find((l) => l.shorthand === i18n.resolvedLanguage)
                        ?.label
                    }
                  </span>
                </Group>
                <IconChevronDown
                  size="1rem"
                  className={classes.languageIcon}
                  stroke={1.5}
                />
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>{items}</Menu.Dropdown>
          </Menu>
        </Group>
        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
        />
      </Container>
    </MHeader>
  )
}

export default Header
