export type AccountType = 'LDAP' | 'Local'
export interface AccountLabel {
  text: string
}
export interface Account {
  id: string
  label: string
  labels?: AccountLabel[]
  accountType: AccountType
  login: string
  password: string | null
}