// import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import jwt_decode from 'jwt-decode'
// import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import Store from './localstorage'
// import { queryClient } from '../api'
import {
  AUTH_TOKEN,
  GRANT_TOKEN,
  REFRESH_TOKEN,
  REMEMBER_ME,
} from './constants'
// import doRefresh from '../api/doRefresh'
// import useRefreshTokenMutation from '../api/query/auth/useRefreshTokenMutation'
// import i18next from '../i18next'

type AuthTokenJWT = {
  iss: string
  sub: string
  aud: string
  exp: number
  iat: number
  jti: string
  typ: string
}

export const getRememberMe = () => !!Store.get<string>(REMEMBER_ME)
export const getAuthToken = () =>
  Store.get<string>(AUTH_TOKEN) || sessionStorage.getItem(AUTH_TOKEN)
export const getRefreshToken = () =>
  Store.get<string>(REFRESH_TOKEN) || sessionStorage.getItem(REFRESH_TOKEN)
export const removeAuthToken = () => {
  Store.remove(AUTH_TOKEN)
  sessionStorage.removeItem(AUTH_TOKEN)
}
export const removeRefreshToken = () => {
  Store.remove(REFRESH_TOKEN)
  sessionStorage.removeItem(REFRESH_TOKEN)
}
export const removeAllTokens = () => {
  removeAuthToken()
  removeRefreshToken()
  Store.remove(GRANT_TOKEN)
  Store.remove(REMEMBER_ME)
}

export const useIsLoggedIn = () => {
  const token = getAuthToken()
  const refreshToken = getRefreshToken()

  if (!token || !refreshToken) {
    return false
  }

  return jwt_decode<AuthTokenJWT>(token as string).exp >= +new Date() / 1000
}

export const useInitialLogin = () => {
  // const { mutateAsync, isError, isLoading } = useRefreshTokenMutation()
  const mounted = useRef<boolean | null>(null)
  const isLoggedIn = useIsLoggedIn()

  useEffect(() => {
    mounted.current = true

    if (mounted.current) {
      if (getRememberMe() || isLoggedIn) {
        // mutateAsync()
        //   .then((response) => {
        //     if (response) {
        //       // toast.info(i18next.t('common.session_recovered'))
        //     } else {
        //       // toast.info(i18next.t('common.session_expired'))
        //     }
        //   })
        //   .catch(() => {
        //     removeAllTokens()
        //     // toast.info(i18next.t('common.session_expired'))
        //   })
      } else {
        removeAllTokens()
      }
    }

    return () => {
      mounted.current = null
    }
  }, [isLoggedIn])

  // return {
  //   isError,
  //   isLoading,
  // }
  return {
    isError: false,
    isLoading: false,
  }
}

export const useKeepAlive = () => {
  const { t } = useTranslation()
  const mounted = useRef<boolean | null>(null)

  useEffect(() => {
    mounted.current = true
    let id: NodeJS.Timer | undefined
    if (getRefreshToken()) {
      id = setInterval(
        async () => {
          if (mounted.current) {
            // console.log('refreshing token')
            // const refreshed = await doRefresh()
            // if (!refreshed) {
            //   toast.info(t('common.session_expired'))
            // }
          }
        },
        // Repeat every 7 minutes
        1000 * 60 * 7
      )
    }

    return () => {
      clearInterval(id)
      mounted.current = null
    }
  }, [t])
}

// export const useLogout = () => {
//   const navigate = useNavigate()
//   const { t } = useTranslation()
//
//   removeAllTokens()
//   queryClient.removeQueries([])
//   toast.info(t('common.you_were_logged_out'))
//   navigate('/')
// }
