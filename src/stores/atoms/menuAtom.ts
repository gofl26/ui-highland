import { atom } from 'jotai'

import { menuResponse } from '@/types/menu'

export const atomMenuInfo = atom<menuResponse[]>([])
