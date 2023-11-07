type TUserRole = 'user' | 'admin'

export interface TUser {
  id: string
  active: boolean
  email: string
  name: string
  /**
   * Owners concatenated with "," -> 0,1,2
   */
  owner: string | null
  note: string | null
  role: TUserRole
  userName: string
}
