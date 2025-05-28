'use client'
import { useState } from 'react'
import { cartResponse } from '@/types/cart'

interface props {
  className: string
  cartInfo: cartResponse[]
}
type Row = {
  productId: string
  cartQuantity: number
}
const columns: { key: keyof Row; label: string; width: string }[] = [
  { key: 'productId', label: '상품/옵션 정보', width: 'w-full' },
  { key: 'cartQuantity', label: '수량', width: '' },
]

export default function CartList({ className, cartInfo: rows }: props) {
  const [data, setData] = useState(rows)

  const formatCellValue = (key: keyof Row, value: string | number) => {
    return value
  }
  return (
    <div className={className}>
      <div className="flex flex-col w-full items-center">
        <table className="min-w-full border-collapse border border-borderDefault text-sm">
          <thead>
            <tr className="bg-bgHeader">
              {columns.map(({ key, label, width }) => (
                <th key={key} className={`border px-4 py-2 truncate ${width}`}>
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
                {columns.map(({ key, width }) => (
                  <td key={key} className={`border px-4 py-2 truncate ${width}`}>
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
