type TUserRole = 'user' | 'admin'

export interface TUser {
  id: string
  email: string
  userName: string
  firstName: string
  lastName: string
  role: TUserRole
  active: boolean
  owners: string[]
}
