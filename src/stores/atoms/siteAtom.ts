import { atom } from 'jotai'

import { siteResponse } from '@/types/sites'

export const atomSiteInfo = atom<siteResponse>({
  id: '',
  siteName: '',
  sitesFile: '',
  updatedAt: '',
  createdAt: '',
})
