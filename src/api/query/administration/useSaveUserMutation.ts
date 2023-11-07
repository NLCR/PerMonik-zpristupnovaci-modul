import { useMutation } from '@tanstack/react-query'
import { api, queryClient } from '../../index'
import { TUser } from '../../../@types/user'

const useSaveUserMutation = () =>
  useMutation({
    mutationFn: (user: TUser) =>
      api().post('v1/user/update', { json: user }).json<boolean>(),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['users'] })
      }
    },
  })

export default useSaveUserMutation
