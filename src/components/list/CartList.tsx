'use client'
import { ChevronLeft, ChevronRight, CircleEqual, CirclePlus } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import NumberStepper from '@/components/commons/button/numberStepper'
import Checkbox from '@/components/commons/input/DefaultCheckBox'
import CreateOrderModal from '@/components/modals/CreateOrderModal'
import { cartResponse } from '@/types/cart'

interface props {
  className: string
  cartInfo: cartResponse[]
}

export default function CartList({ className, cartInfo: rows }: props) {
  const [data, setData] = useState(rows)
  const [selectedData, setSelectedData] = useState<string[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [openCreateOrderModal, setOpenCreateOrderModal] = useState(false)

  const updateQuantity = (id: string, newQuantity: number) => {
    setData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, cartQuantity: newQuantity } : row)),
    )
  }
  const handleCreateOrder = () => {}
  useEffect(() => {
    const price = selectedData.reduce((acc, _id) => {
      const _data = data.find(({ id }) => id === _id)
      if (_data) acc += _data.productPrice * _data.cartQuantity
      return acc
    }, 0)
    setTotalPrice(price)
  }, [selectedData, data])
  return (
    <div className={className}>
      <div className="flex w-full flex-col items-center">
        <table className="min-w-full border-collapse border border-borderDefault text-sm">
          <thead>
            <tr className="bg-bgHeader">
              <th className="border px-4 py-2">
                <Checkbox
                  checked={selectedData.length === data.length}
                  onChange={() => {
                    if (selectedData.length === data.length) {
                      setSelectedData([])
                    } else {
                      const ids = data.map(({ id }) => id)
                      setSelectedData(ids)
                    }
                  }}
                />
              </th>
              <th className="w-full truncate border px-4 py-2">상품이름</th>
              <th className="truncate border px-4 py-2">수량</th>
              <th className="truncate border px-4 py-2">금액</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className={`cursor-pointer ${selectedData.includes(row.id) ? 'bg-bgPrimary text-textPrimary' : 'even:bg-gray-50 hover:bg-gray-100'}`}
                onClick={() => {}}
              >
                <td className="px-4 py-2">
                  <Checkbox
                    checked={selectedData.includes(row.id)}
                    onChange={() => {
                      if (selectedData.includes(row.id)) {
                        setSelectedData((prev) => prev.filter((item) => item !== row.id))
                      } else {
                        setSelectedData((prev) => [...prev, row.id])
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-2 ">
                  <div className="flex items-center gap-2">
                    <Image
                      src={`https://api.ssrhouse.store/api/files/getFile?fileName=${row.productFile}`}
                      alt="image"
                      width="64"
                      height="64"
                      className="rounded-lg"
                    />
                    {row.productName}
                  </div>
                </td>
                <td className="truncate px-4 py-2">
                  <div className="flex">
                    <NumberStepper
                      value={row.cartQuantity}
                      onChange={(newQuantity: number) => updateQuantity(row.id, newQuantity)}
                    />
                  </div>
                </td>
                <td className="truncate px-4 py-2">{row.cartQuantity * row.productPrice}원</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex w-full">
          <button className="rounded-lg bg-bgBtnDefault px-5 py-2">선택 상품 삭제</button>
        </div>
        <div className="mt-4 flex w-full justify-end gap-2">
          <p>총 {selectedData.length}개의 상품금액</p>
          <p>{totalPrice}원</p>
          <CirclePlus />
          <p>배송비 {0}원</p>
          <CircleEqual />
          <p>{totalPrice + 0}원</p>
        </div>
        <div className="mt-4 flex w-full justify-end gap-4">
          <button
            className="rounded-lg border border-borderPrimary bg-bgBtnDefault px-5 py-2"
            onClick={() => setOpenCreateOrderModal(true)}
          >
            선택 상품 주문
          </button>
          <button
            className="rounded-lg bg-bgBtnPrimary px-5 py-2 text-textPrimary"
            onClick={() => setOpenCreateOrderModal(true)}
          >
            전체 상품 주문
          </button>
        </div>
        <CreateOrderModal
          isOpen={openCreateOrderModal}
          onClose={() => setOpenCreateOrderModal(false)}
          onSave={handleCreateOrder}
        >
          <div className="flex w-full items-center gap-4">
            <ChevronLeft onClick={() => setOpenCreateOrderModal(false)} />
            <p className="text-xl">주문 / 결제</p>
          </div>
          <div className="flex w-full flex-col rounded-lg border border-borderPrimary p-4">
            <div className="flex justify-between">
              <p className="text-lg">배송지</p>
              <ChevronRight />
            </div>
            <div className="flex w-full flex-col gap-2 p-2">
              <p>배송지 이름:</p>
              <p>주소:</p>
              <p>받는 사람:</p>
              <p>핸드폰:</p>
            </div>
          </div>
        </CreateOrderModal>
      </div>
    </div>
  )
}
