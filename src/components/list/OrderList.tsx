'use client'

import moment from 'moment'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { orderResponse } from '@/types/order'
import { formatNumberWithCommas } from '@/utils/formatNumberWithCommas'

interface orderListSrc {
  rows: orderResponse[]
  total: number
}
interface props {
  className: string
  orderListSrc?: orderListSrc
}
interface productList {
  productName: string
  productFile: string
  productPrice: string
  orderQuantity: number
}
interface orderList {
  id: string
  orderStatus: string
  orderAmount: number
  deliveryCost: number | null
  payMethod: string
  address: string
  addressDetail: string
  recipient: string
  phoneNumber: string
  productList: productList[]
  createdAt: string
  updatedAt: string
}
export default function OrderList({ className, orderListSrc }: props) {
  const [orderList, setOrderList] = useState<orderList[]>([])
  const [visibleDetails, setVisibleDetails] = useState<Record<string, boolean>>({})

  const transformPaymethod = (_paymethod: string) => {
    return _paymethod === 'bank' ? '무통장입금' : '카드결제'
  }
  const handleClickDetailOrder = (id: string) => {
    setVisibleDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }
  useEffect(() => {
    if (!orderListSrc) return
    const list = orderListSrc.rows.reduce<orderList[]>(
      (acc, { id, productName, productFile, productPrice, orderQuantity, ...etc }) => {
        const orderItem = acc.find(({ id: _id }) => _id === id)
        if (orderItem) {
          orderItem.productList.push({ productName, productFile, productPrice, orderQuantity })
        } else {
          acc.push({
            ...etc,
            id,
            productList: [{ productName, productFile, productPrice, orderQuantity }],
          })
        }
        return acc
      },
      [],
    )
    setOrderList(list)
  }, [orderListSrc])
  return (
    <div className={className}>
      <div className="flex w-full items-center gap-4">
        <p>주문 목록</p>
        <div className="flex h-1 flex-1 border-b" />
      </div>
      <div className="mt-6 flex w-full flex-col items-center gap-4">
        {orderList.map(
          (
            {
              id,
              orderStatus,
              updatedAt,
              productList,
              orderAmount,
              deliveryCost,
              payMethod,
              address,
              addressDetail,
              recipient,
              phoneNumber,
            },
            index,
          ) => (
            <div key={index} className="flex w-full flex-col rounded-lg bg-bgSecondary p-4">
              <div className="flex justify-between border-b">
                <p>{moment(updatedAt).format('YYYY.MM.DD')}</p>
                <button className="text-sm" onClick={() => handleClickDetailOrder(id)}>
                  {!visibleDetails[id] ? '주문 상세보기 >' : '< 주문 간략히 보기'}
                </button>
              </div>
              {!visibleDetails[id] ? (
                <div className="flex w-full flex-col gap-4 p-2">
                  <p className="flex gap-4 text-sm">
                    <strong>{orderStatus}</strong>
                    <span>도착일시</span>
                  </p>
                  <div className="flex flex-col gap-2">
                    {productList.map(
                      ({ productName, productFile, productPrice, orderQuantity }, _index) => (
                        <div key={`${id}_${_index}`} className="flex gap-2">
                          <Image
                            src={`https://api.ssrhouse.store/api/files/getFile?fileName=${productFile}`}
                            alt="image"
                            width="64"
                            height="64"
                            className="rounded-lg"
                          />
                          <div className="flex flex-col gap-2">
                            <p>{productName}</p>
                            <div className="flex gap-2">
                              <p>{productPrice}원</p>
                              <p>{orderQuantity}개</p>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-2 flex flex-col rounded-lg border border-borderDefault p-2">
                  <p className="font-semibold">결제 정보</p>
                  <div className="mt-2 flex justify-between">
                    <p>상품 가격</p>
                    <p>{formatNumberWithCommas(orderAmount)} 원</p>
                  </div>
                  <div className="flex justify-between">
                    <p>배송비</p>
                    <p>{deliveryCost ?? 0} 원</p>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <p>결제 방식</p>
                    <p>{transformPaymethod(payMethod)}</p>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <p>주문 상태</p>
                    <p>{orderStatus}</p>
                  </div>
                  {orderStatus === '입금대기' && (
                    <div className="mt-2 flex items-center justify-end gap-2">
                      <span className="text-[#2793FF]">{'농협(356-0005-186963)'}</span>
                      <span>으로</span>
                      <span className="text-[#2793FF]">
                        {formatNumberWithCommas(orderAmount)}원
                      </span>
                      <span>입금해주시길 바랍니다.</span>
                    </div>
                  )}
                  <div className="my-4 h-1 w-full border-b" />
                  <p className="font-semibold">주문자 정보</p>
                  <div className="mt-2 flex justify-between">
                    <p>받는 사람</p>
                    <p>{recipient}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>주소</p>
                    <p>
                      {address} {addressDetail}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p>연락처</p>
                    <p>{phoneNumber}</p>
                  </div>
                </div>
              )}
            </div>
          ),
        )}
      </div>
    </div>
  )
}
