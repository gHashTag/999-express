export interface SelectIzbushkaError {
  message: string
  code?: string
}

export interface SupabaseResponse<T> {
  data: T[] | null
  error: SelectIzbushkaError | null
}

export type TSupabaseUser = {
  inviter?: string | null
  is_bot?: boolean | null
  language_code?: string | null
  telegram_id?: number | null
  email?: string | null
  created_at?: Date
  user_id?: string
  aggregateverifier?: string | null
  admin_email?: string | null
  role?: string | null
  display_name?: string | null
  select_izbushka?: string | null
}

export type TUser = Readonly<{
  auth_date?: number
  first_name: string
  last_name?: string
  hash?: string
  id?: number
  photo_url?: string
  username?: string
}>

export type SupabaseUser = TUser & TSupabaseUser
