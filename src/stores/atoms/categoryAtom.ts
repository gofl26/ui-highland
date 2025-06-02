import { atom } from 'jotai'

import { categoryResponse } from '@/types/category'

export const atomCategoryInfo = atom<categoryResponse[]>([])
