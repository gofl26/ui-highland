'use client'
import { useState } from 'react'

import Checkbox from '@/components/commons/input/DefaultCheckBox'
import { cartResponse } from '@/types/cart'
interface props {
  className: string
  cartInfo: cartResponse[]
}
type Row = {
  productName: string
  cartQuantity: number
}
const columns: { key: keyof Row; label: string; width: string }[] = [
  { key: 'productName', label: '상품 이름', width: 'w-full' },
  { key: 'cartQuantity', label: '수량', width: '' },
]

export default function CartList({ className, cartInfo: rows }: props) {
  const [data, setData] = useState(rows)

  const formatCellValue = (key: keyof Row, value: string | number) => {
    return value
  }
  return (
    <div className={className}>
      <div className="flex w-full flex-col items-center">
        <table className="min-w-full border-collapse border border-borderDefault text-sm">
          <thead>
            <tr className="bg-bgHeader">
              <th className="border px-4 py-2">
                <Checkbox checked={true} onChange={() => {}} />
              </th>
              {columns.map(({ key, label, width }) => (
                <th key={key} className={`truncate border px-4 py-2 ${width}`}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className={`cursor-pointer even:bg-gray-50 hover:bg-gray-100`}
                onClick={() => {}}
              >
                <td className="border px-4 py-2">
                  <Checkbox checked={true} onChange={() => {}} />
                </td>
                {columns.map(({ key, width }) => (
                  <td key={key} className={`truncate border px-4 py-2 ${width}`}>
                    {formatCellValue(key, row[key]!)}
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
