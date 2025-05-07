'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { categoryResponse } from '@/types/category'

interface Props {
  category: categoryResponse[]
}
export default function ProductName(props: Props) {
  const { category } = props
  const pathname = usePathname()
  const [categoryName, setCategoryName] = useState('')
  useEffect(() => {
    const findCategory = category.find(({ categoryUrl }) => pathname.includes(categoryUrl))
    if (findCategory) setCategoryName(findCategory.categoryName)
  }, [pathname, category])
  return <p className="text-lg font-semibold">{categoryName}</p>
}
