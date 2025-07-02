'use client'
import { ChevronLeft, ChevronRight, CircleEqual, CirclePlus } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import NumberStepper from '@/components/commons/button/numberStepper'
import Checkbox from '@/components/commons/input/DefaultCheckBox'
import CreateOrderModal from '@/components/modals/CreateOrderModal'
import { deleteCart } from '@/serverActions/cart'
import { getDelivery } from '@/serverActions/deliveryAddress'
import { createOrder, orderList } from '@/serverActions/orders'
import { bankCodeSrc } from '@/stores/bank'
import { cartResponse } from '@/types/cart'
import { deliveryResponse } from '@/types/delivery'
import { formatNumberWithCommas } from '@/utils/formatNumberWithCommas'

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
  const [method, setMethod] = useState('bank')
  const [bankCode, setBankCode] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [receiptOption, setReceiptOption] = useState(false)
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
  const handleCreateOrder = async () => {
    if (!selectedDelivery) return
    const orderList = selectedData.reduce<orderList[]>((acc, _id) => {
      const cartItem = data.find(({ id }) => id === _id)
      if (!cartItem) return acc
      const item = {
        cartId: _id,
        productId: cartItem.productId,
        productPrice: cartItem.productPrice,
        cartQuantity: cartItem.cartQuantity,
      }
      acc.push(item)
      return acc
    }, [])
    //유효성 검사
    if (!bankCode) {
      showToast('은행을 선택해주세요.', 'info')
      return
    }
    if (!accountNumber) {
      showToast('계좌번호를 입력해주세요.', 'info')
      return
    }
    const body = {
      payMethod: method,
      address: selectedDelivery.deliveryAddress,
      addressDetail: selectedDelivery.deliveryDetailAddress,
      bankCode,
      accountNumber,
      orderAmount: totalPrice,
      phoneNumber: selectedDelivery.deliveryPhoneNumber,
      recipient: selectedDelivery.deliveryRecipient,
      receipt: receiptOption,
      orderList,
    }
    const result = await createOrder(body)
    if (!result) showToast('주문에 실패했습니다.', 'error')
    else {
      setData((prev) => prev.filter(({ id }) => !selectedData.includes(id)))
      setSelectedData([])
      setOpenCreateOrderModal(false)
      showToast('주문에 성공했습니다.', 'success')
    }
  }
  const handleClickDeleteCart = async () => {
    const result = await deleteCart(selectedData)
    if (result) {
      setData((prev) => prev.filter(({ id }) => !selectedData.includes(id)))
      setSelectedData([])
      showToast('삭제에 성공했습니다.', 'success')
    } else showToast('삭제에 실패했습니다.', 'error')
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
                  checked={data.length === 0 ? false : selectedData.length === data.length}
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
                <td className="truncate px-4 py-2">
                  {formatNumberWithCommas(row.cartQuantity * row.productPrice)}원
                </td>
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
              <p className="text-lg">주문 상품</p>
            </div>
            <div className="flex w-full flex-col gap-2">
              {data
                .filter(({ id }) => selectedData.includes(id))
                .map(({ productName, productPrice, cartQuantity }, index) => (
                  <div key={index} className="rounded-lg bg-bgSecondary p-2">
                    <p className="font-semibold">{productName}</p>
                    <div className="flex items-center justify-between">
                      <p>수량: {cartQuantity}개</p>
                      <p>{formatNumberWithCommas(productPrice * cartQuantity)}원</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex w-full justify-end rounded-lg border border-borderPrimary p-4">
            <p>총 주문 금액: {formatNumberWithCommas(totalPrice)}원</p>
          </div>
          <div className="flex w-full flex-col rounded-lg border border-borderPrimary p-4">
            <div className="mb-4 flex">
              <p className="text-lg">결제 방식</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="bank"
                name="payMethod"
                value="bank"
                checked={method === 'bank'}
                onChange={() => setMethod('bank')}
                className="accent-bgPrimary"
              />
              <label htmlFor="bank" className="cursor-pointer">
                무통장입금
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="card"
                name="payMethod"
                value="card"
                checked={method === 'card'}
                onChange={() => setMethod('card')}
                className="accent-bgPrimary"
              />
              <label htmlFor="card" className="cursor-pointer">
                카드결제
              </label>
            </div>
            {method === 'bank' && (
              <div className="mt-2 space-y-2">
                <div>
                  <label htmlFor="bankCode" className="block text-sm font-medium">
                    은행명
                  </label>
                  <select
                    id="bankCode"
                    value={bankCode}
                    onChange={(e) => setBankCode(e.target.value)}
                    className="mt-1 w-full rounded border p-2 text-sm focus:outline-none"
                  >
                    <option value="">은행을 선택하세요</option>
                    {Object.entries(bankCodeSrc).map(([name, code]) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium">
                    계좌번호
                  </label>
                  <input
                    id="accountNumber"
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
                    placeholder="예: 123-4567-8901"
                  />
                </div>
              </div>
            )}

            <p className="text-sm">
              선택된 결제 방식: <strong>{method === 'bank' ? '무통장입금' : '카드결제'}</strong>
            </p>
          </div>
          <div className="flex w-full justify-between rounded-lg border border-borderPrimary p-4">
            <p className="whitespace-nowrap text-sm">현금영수증 신청</p>
            <div className="flex items-center gap-4">
              <label className="flex cursor-pointer items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="cashReceipt"
                  value="yes"
                  checked={receiptOption}
                  onChange={() => setReceiptOption(true)}
                  className="accent-blue-500"
                />
                현금영수증 신청
              </label>

              <label className="flex cursor-pointer items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="cashReceipt"
                  value="no"
                  checked={!receiptOption}
                  onChange={() => setReceiptOption(false)}
                  className="accent-blue-500"
                />
                신청안함
              </label>
            </div>
          </div>
        </CreateOrderModal>
      </div>
    </div>
  )
}
