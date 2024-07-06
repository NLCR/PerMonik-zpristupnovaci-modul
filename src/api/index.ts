import ky from 'ky'
import { QueryClient } from '@tanstack/react-query'
// import { toast } from 'react-toastify'
// import i18next from '../i18next'
// import Store from '../utils/localstorage'
// import { AUTH_TOKEN, GRANT_TOKEN, REFRESH_TOKEN } from '../utils/constants'
// const { MODE } = import.meta.env

// Setup queryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      // staleTime: 5000
    },
  },
})

type BaseOptions = {
  handledCodes?: number[]
  throwErrorFromKy?: boolean
}

// const processError = (
//   response: Response,
//   error: { [key: string]: string[] }
// ) => {
//   // if (response.status === 410) {
//   //   return i18next.t('common.session_expired')
//   // }
//   return `${response.status}: ${
//     Array.isArray(error) ? error[0].join(', ') : error
//   }`
// }

const baseApi = ({ handledCodes, throwErrorFromKy = true }: BaseOptions) =>
  ky.extend({
    timeout: 30000,
    // throw error into console
    throwHttpErrors: throwErrorFromKy,
    retry: 0,
    hooks: {
      afterResponse: [
        // Handle errors
        async (_request, _options, response) => {
          if (response.ok) return

          if (handledCodes?.find((c) => c === response.status)) {
            // No response with error will be passed into react-query -> cannot use onError function
            return
          }

          try {
            // const error = await response.json()
            // toast.error(processError(response, error))
          } catch (e: unknown) {
            /* empty */
          }
        },
      ],
    },
  })

type Options = {
  useRefreshToken?: boolean
  useGrantToken?: boolean
  useGrantTokenAsAuth?: boolean
} & BaseOptions

// Used for fetching data with React Query
export const api = ({
  useGrantToken,
  useRefreshToken,
  useGrantTokenAsAuth,
  ...base
}: Options = {}) =>
  baseApi(base).extend({
    prefixUrl: '/api',
  })
