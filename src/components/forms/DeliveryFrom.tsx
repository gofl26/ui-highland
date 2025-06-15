'use client'
import { useEffect, useState } from 'react'

import Input from '@/components/commons/input/defaultInput'
import type { deliveryResponse, deliveryForm } from '@/types/delivery'

interface props {
  delivery: deliveryResponse[]
}
const initDeliveryForm: deliveryForm = {
  id: 'new',
  deliveryName: '',
  deliveryAddress: '',
  deliveryDetailAddress: '',
  deliveryRecipient: '',
  deliveryPhoneNumber: '',
  deliveryDefault: false,
}
export default function DeliveryForm({ delivery }: props) {
  const [deliveryForm, setDeliveryForm] = useState<deliveryForm>(initDeliveryForm)
  const [selectedDelivery, setSelectedDelivery] = useState<string>()

  const handleClickAddDeliveryAddress = () => {
    setDeliveryForm(initDeliveryForm)
  }
  const handleClickSaveDeliveryBtn = () => {}
  useEffect(() => {
    const response = delivery.find(({ id }) => selectedDelivery === id)
    if (!response) return
    setDeliveryForm({
      id: response.id,
      deliveryName: response.deliveryName,
      deliveryAddress: response.deliveryAddress,
      deliveryDetailAddress: response.deliveryDetailAddress,
      deliveryRecipient: response.deliveryRecipient,
      deliveryPhoneNumber: response.deliveryPhoneNumber,
      deliveryDefault: response.deliveryDefault,
    })
  }, [selectedDelivery, delivery])
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="w-full max-w-2xl border-b border-borderPrimary">
        <p>배송지 관리</p>
      </div>
      <div className="custom-scroll mt-4 flex w-full max-w-2xl overflow-x-auto">
        {delivery.map(({ id, deliveryName }, index) => (
          <button
            key={index}
            className={`rounded-lg border px-3 py-1 ${selectedDelivery === id ? 'bg-bgPrimary text-textPrimary' : ''}`}
            onClick={() => setSelectedDelivery(id)}
          >
            {deliveryName}
          </button>
        ))}
        <button className="rounded-lg border px-3 py-1" onClick={handleClickAddDeliveryAddress}>
          + 배송지 추가
        </button>
      </div>
      <form className="mt-4 flex w-full max-w-2xl flex-col rounded-lg border border-borderDefault">
        <div className="flex h-20 w-full border-b border-borderDefault">
          <div className="flex w-1/5 items-center justify-center rounded-lg bg-bgDefault">
            배송지 이름
          </div>
          <div className="flex w-4/5 items-center justify-between gap-4 px-4 py-2">
            <div className="flex w-full flex-col">
              <Input value={deliveryForm.deliveryName} name="deliveryName" />
            </div>
          </div>
        </div>
        <div className="flex h-20 w-full">
          <div className="flex w-1/5 items-center justify-center rounded-lg bg-bgDefault">
            받는 사람
          </div>
          <div className="flex w-4/5 flex-col justify-center gap-2 px-4 py-2">
            <Input value={deliveryForm.deliveryRecipient} name="deliveryRecipient" />
          </div>
        </div>
      </form>
      <div className="mt-4 flex w-full max-w-2xl items-center justify-end">
        <button
          className="rounded-lg bg-bgPrimary px-4 py-2 text-textPrimary"
          onClick={handleClickSaveDeliveryBtn}
        >
          저장
        </button>
      </div>
    </div>
  )
}
