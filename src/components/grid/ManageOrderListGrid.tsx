'use client'
import moment from 'moment'
import { useState, useEffect } from 'react'

import { orderResponse, orderList } from '@/types/order'

type Row = {
  orderStatus: string
  userName: string
  orderAmount: number
  updatedAt: string
}
interface orderListSrc {
  rows: orderResponse[]
  total: number
}
interface props {
  orderListSrc?: orderListSrc
}

const columns: { key: keyof Row; label: string }[] = [
  { key: 'orderStatus', label: '주문상태' },
  { key: 'userName', label: '주문자' },
  { key: 'orderAmount', label: '금액' },
  { key: 'updatedAt', label: '주문일시' },
]

export default function ManageOrderListGrid({ orderListSrc }: props) {
  const [orderList, setOrderList] = useState<orderList[]>([])
  const [totalNumber, setTotalNumber] = useState(0)
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)
  const [filterColumn, setFilterColumn] = useState<string>('orderStatus')
  const [keyword, setKeyword] = useState('')
  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as keyof Row
    setFilterColumn(value)
  }
  const handleClickSearch = () => {}
  const handleClickDeleteProduct = async () => {}

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
            updatedAt: moment(etc.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
            productList: [{ productName, productFile, productPrice, orderQuantity }],
          })
        }
        return acc
      },
      [],
    )
    console.log('orderList', list)
    setOrderList(list)
    setTotalNumber(list.length)
  }, [orderListSrc])

  return (
    <div className="mt-4 flex w-full">
      <div className="w-full">
        {/* Search Bar */}
        <div className="mb-4 flex gap-2">
          <select
            className="rounded-lg border border-borderDefault px-2 py-1 focus:outline-inputFocus"
            value={filterColumn}
            onChange={handleChangeSelect}
          >
            {columns.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="rounded-lg border border-borderDefault p-2 pr-10 focus:outline-inputFocus"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleClickSearch()
              }
            }}
          />
          <button
            className="rounded-lg bg-bgPrimary px-4 py-2 text-textPrimary"
            onClick={handleClickSearch}
          >
            검색
          </button>
        </div>
        <div className="mb-4 flex w-full items-center">
          <p className="text-sm">총 {totalNumber} 개</p>
        </div>
        {/* Table */}
        <table className="min-w-full border-collapse border border-borderDefault text-sm">
          <thead>
            <tr className="bg-bgHeader">
              {columns.map(({ key, label }) => (
                <th key={key} className="border px-4 py-2">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orderList.map((row, idx) => (
              <tr
                key={idx}
                className={`cursor-pointer ${
                  selectedRowIndex === idx
                    ? 'bg-bgPrimary text-textPrimary'
                    : 'even:bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => {
                  if (selectedRowIndex === idx) {
                    setSelectedRowIndex(null)
                  } else {
                    setSelectedRowIndex(idx)
                  }
                }}
              >
                {columns.map(({ key }) => (
                  <td key={key} className="border px-4 py-2">
                    {row[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
