import { atom } from 'jotai'
import { userVerify } from '@/types/users'

export const atomUserInfo = atom<userVerify>({
  id: '',
  email: undefined,
  user_name: '',
  gender: undefined,
  kakao_id: undefined,
  phone_number: undefined,
  role: '',
  updated_at: '',
  created_at: '',
})
