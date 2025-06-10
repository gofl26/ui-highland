'use client'
import Image from 'next/image'
import { useState } from 'react'

import NumberStepper from '@/components/commons/button/numberStepper'
import Checkbox from '@/components/commons/input/DefaultCheckBox'
import { cartResponse } from '@/types/cart'

interface props {
  className: string
  cartInfo: cartResponse[]
}
type Row = {
  productName: string
  cartQuantity: number
  productPrice: number
}
const columns: { key: keyof Row; label: string; width: string }[] = [
  { key: 'cartQuantity', label: '수량', width: '' },
  { key: 'productPrice', label: '금액', width: '' },
]

export default function CartList({ className, cartInfo: rows }: props) {
  const [data, setData] = useState(rows)
  const [selectedData, setSelectedData] = useState<string[]>([])

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
                className={`cursor-pointer ${selectedData.includes(row.id) ? 'bg-bgPrimary' : 'even:bg-gray-50 hover:bg-gray-100'}`}
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
                    <NumberStepper value={row.cartQuantity} />
                  </div>
                </td>
                <td className="truncate px-4 py-2">{row.cartQuantity * row.productPrice}원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
