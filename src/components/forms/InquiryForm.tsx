'use client'

import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import Select from '@/components/commons/select/DefaultSelect'
import Checkbox from '@/components/commons/input/DefaultCheckBox'
import { useToast } from '@/components/commons/toast/ToastProvider'
import { inquiryCategory } from '@/stores/inquiry'
import { atomInquiryInfo } from '@/stores/atoms/inquiryAtom'
import type { inquiryForm } from '@/types/inquiry'
import type { productResponse } from '@/types/product'

interface props {
  className?: string
  products: productResponse[]
}
interface selectOption {
  label: string
  value: string
}

const inquiryCategoryOptions = inquiryCategory.map((category) => {
  return { label: category, value: category }
})
const MAX_LENGTH = 1000

export default function InquiryForm({ className, products = [] }: props) {
  const [productOptions, setProductOptions] = useState<selectOption[]>([])

  const [inquiryForm, setInquiryForm] = useAtom<inquiryForm>(atomInquiryInfo)
  const { showToast } = useToast()

  const handleChangeInquiryCategory = (value: string) => {
    const newInquiryForm = JSON.parse(JSON.stringify(inquiryForm))
    newInquiryForm.inquiryCategory = value
    setInquiryForm(newInquiryForm)
  }
  const handleChangeProductId = (value: string) => {
    const newInquiryForm = JSON.parse(JSON.stringify(inquiryForm))
    newInquiryForm.productId = value
    setInquiryForm(newInquiryForm)
  }
  useEffect(() => {
    const transform = products.reduce<selectOption[]>(
      (acc, { id, productName }) => {
        acc.push({ value: id, label: productName })
        return acc
      },
      [{ value: '', label: '선택해주세요' }],
    )
    setProductOptions(transform)
  }, [products])
  return (
    <div className={`flex flex-col justify-center items-center ${className}`}>
      <form className="flex flex-col w-full max-w-2xl border rounded-lg border-borderDefault divide-y divide-borderDefault">
        <div className="flex w-full h-20">
          <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
            비밀 글
          </div>
          <div className="flex w-4/5 items-center px-4 py-2">
            <Checkbox
              checked={!inquiryForm.isPublic}
              onChange={(boolean) => {
                const newInquiryForm = JSON.parse(JSON.stringify(inquiryForm))
                newInquiryForm.isPublic = !boolean
                setInquiryForm(newInquiryForm)
              }}
            />
          </div>
        </div>
        <div className="flex w-full h-20">
          <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
            문의 유형
          </div>
          <div className="flex w-4/5 items-center px-4 py-2">
            <Select
              value={inquiryForm.inquiryCategory}
              options={inquiryCategoryOptions}
              onChange={handleChangeInquiryCategory}
            />
          </div>
        </div>
        <div className="flex w-full h-20">
          <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
            상품 명
          </div>
          <div className="flex w-4/5 items-center px-4 py-2">
            <Select
              value={inquiryForm.productId}
              options={productOptions}
              onChange={handleChangeProductId}
            />
          </div>
        </div>
        <div className="flex w-full">
          <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
            문의 글
          </div>
          <div className="flex flex-col w-4/5  px-4 py-2">
            <textarea
              value={inquiryForm.inquiryTitle}
              className="w-full min-h-40 border rounded-lg border-borderDefault p-2 pr-10 focus:outline-inputFocus"
              onChange={(e) => {
                if (e.target.value.length > MAX_LENGTH)
                  return showToast('문의 글은 최대 1000자까지 가능합니다.', 'error')
                const newInquiryForm = JSON.parse(JSON.stringify(inquiryForm))
                newInquiryForm.inquiryTitle = e.target.value
                setInquiryForm(newInquiryForm)
              }}
            />
            <p>
              최대 {inquiryForm.inquiryTitle.length}/{MAX_LENGTH}
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
