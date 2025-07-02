'use client'

import moment from 'moment'
import { useEffect, useState } from 'react'

import { orderResponse } from '@/types/order'

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
  productList: productList[]
  createdAt: string
  updatedAt: string
}
export default function OrderList({ className, orderListSrc }: props) {
  const [orderList, setOrderList] = useState<orderList[]>([])
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
        {orderList.map(({ id, orderStatus, updatedAt, productList }, index) => (
          <div key={index} className="flex w-full flex-col rounded-lg bg-bgSecondary p-4">
            <div className="flex justify-between border-b">
              <p>{moment(updatedAt).format('YYYY.MM.DD')}</p>
              <button className="text-sm">주문 상세보기</button>
            </div>
            <div className="flex w-full flex-col gap-4 p-2">
              <p className="flex gap-4 text-sm">
                <strong>{orderStatus}</strong>
                <span>도착일시</span>
              </p>
              <div className="flex flex-col gap-2">
                {productList.map(({ productName }, _index) => (
                  <div key={`${id}_${_index}`}>{productName}</div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
