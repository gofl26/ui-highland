'use client'
import { ChevronLeft, ChevronRight, CircleEqual, CirclePlus } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import NumberStepper from '@/components/commons/button/numberStepper'
import Checkbox from '@/components/commons/input/DefaultCheckBox'
import CreateOrderModal from '@/components/modals/CreateOrderModal'
import { deleteCart } from '@/serverActions/cart'
import { getDelivery } from '@/serverActions/deliveryAddress'
import { cartResponse } from '@/types/cart'
import { deliveryResponse } from '@/types/delivery'

import { useToast } from '../commons/toast/ToastProvider'

interface props {
  className: string
  cartInfo: cartResponse[]
}

export default function CartList({ className, cartInfo: rows }: props) {
  const [data, setData] = useState(rows)
  const [selectedData, setSelectedData] = useState<string[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [openCreateOrderModal, setOpenCreateOrderModal] = useState(false)
  const [deliveryChangeStatus, setDeliveryChangeStatus] = useState(false)
  const [deliveryList, setDeliveryList] = useState<deliveryResponse[]>([])
  const [selectedDelivery, setSelectedDelivery] = useState<deliveryResponse>()
  const { showToast } = useToast()

  const updateQuantity = (id: string, newQuantity: number) => {
    setData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, cartQuantity: newQuantity } : row)),
    )
  }
  const getDeliveryAddress = async () => {
    const _deliveryList = await getDelivery()
    if (!_deliveryList) {
      showToast('배송지 조회에 실패했습니다', 'error')
      return
    }
    setDeliveryList(_deliveryList)
  }
  const handleCreateOrder = () => {}
  const handleClickDeleteCart = async () => {
    const result = await deleteCart(selectedData)
    if (result) showToast('삭제에 성공했습니다.', 'success')
    else showToast('삭제에 실패했습니다.', 'error')
  }
  useEffect(() => {
    const price = selectedData.reduce((acc, _id) => {
      const _data = data.find(({ id }) => id === _id)
      if (_data) acc += _data.productPrice * _data.cartQuantity
      return acc
    }, 0)
    setTotalPrice(price)
  }, [selectedData, data])
  useEffect(() => {
    const defaultDelivery = deliveryList.find(({ deliveryDefault }) => deliveryDefault)
    if (defaultDelivery) setSelectedDelivery(defaultDelivery)
  }, [deliveryList])
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
                className="cursor-pointer even:bg-gray-50 hover:bg-gray-100"
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
          <button className="rounded-lg bg-bgBtnDefault px-5 py-2" onClick={handleClickDeleteCart}>
            선택 상품 삭제
          </button>
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
            onClick={async () => {
              await getDeliveryAddress()
              setOpenCreateOrderModal(true)
            }}
          >
            선택 상품 주문
          </button>
          <button
            className="rounded-lg bg-bgBtnPrimary px-5 py-2 text-textPrimary"
            onClick={async () => {
              await getDeliveryAddress()
              setOpenCreateOrderModal(true)
            }}
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
            <ChevronLeft
              className="cursor-pointer"
              onClick={() => setOpenCreateOrderModal(false)}
            />
            <p className="text-xl">주문 / 결제</p>
          </div>
          <div className="flex w-full flex-col rounded-lg border border-borderPrimary p-4">
            <div className="mb-4 flex justify-between">
              <p className="text-lg">배송지 선택</p>
              {deliveryChangeStatus ? (
                <ChevronLeft
                  className="cursor-pointer"
                  onClick={() => setDeliveryChangeStatus(false)}
                />
              ) : (
                <ChevronRight
                  className="cursor-pointer"
                  onClick={() => {
                    setDeliveryChangeStatus(true)
                  }}
                />
              )}
            </div>
            {selectedDelivery === undefined ? (
              <div className="flex w-full justify-center p-2">
                <p>배송지를 선택해주세요.</p>
              </div>
            ) : (
              <>
                {deliveryChangeStatus ? (
                  <div className="flex w-full flex-col gap-2">
                    {deliveryList.map(
                      (
                        {
                          deliveryName,
                          deliveryAddress,
                          deliveryDetailAddress,
                          deliveryPhoneNumber,
                          deliveryRecipient,
                        },
                        index,
                      ) => (
                        <div
                          key={index}
                          className="flex w-full flex-col gap-2 rounded-lg bg-bgSecondary p-2"
                        >
                          <p>배송지 이름: {deliveryName}</p>
                          <p>
                            주소: {deliveryAddress} {deliveryDetailAddress}
                          </p>
                          <p>받는 사람: {deliveryRecipient}</p>
                          <p>핸드폰: {deliveryPhoneNumber}</p>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="flex w-full flex-col gap-2 rounded-lg bg-bgSecondary p-2">
                    <p className="text-lg font-semibold">{selectedDelivery.deliveryName}</p>
                    <p>{selectedDelivery.deliveryAddress}</p>
                    <p>{selectedDelivery.deliveryRecipient}</p>
                    <p>{selectedDelivery.deliveryPhoneNumber}</p>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex w-full flex-col rounded-lg border border-borderPrimary p-4">
            <div className="mb-4 flex">
              <p className="text-lg">구매 상품</p>
            </div>
            <div className="flex w-full flex-col">
              <div className="border-b"></div>
            </div>
          </div>
        </CreateOrderModal>
      </div>
    </div>
  )
}
