import { atomWithReset } from 'jotai/utils'

import { inquiryForm } from '@/types/inquiry'

export const atomInquiryInfo = atomWithReset<inquiryForm>({
  productId: '',
  inquiryCategory: '배송문의',
  inquiryTitle: '',
  inquiryDesc: '',
  isPublic: true,
})
