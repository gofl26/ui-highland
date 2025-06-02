'use client'

import { ChevronDown, ChevronRight } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

import type { categoryResponse } from '@/types/category'

interface Props {
  path: string
  name: string
  categories?: categoryResponse[]
  type: string
}
export default function SideBarMenuButton(props: Props) {
  const { path, name, categories, type = '' } = props
  const router = useRouter()
  const pathname = usePathname()

  const [isProductOpen, setProductOpen] = useState(true)
  const [selectedMenu, setSelectedMenu] = useState('')

  useEffect(() => {
    const splitPathArray = pathname.split('/')
    const selectMenu = `/${splitPathArray[splitPathArray.length - 1]}`
    setSelectedMenu(selectMenu)
  }, [pathname])

  if (name === '상품 관리') {
    return (
      <div className="w-full">
        <button
          onClick={() => setProductOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-lg p-4 hover:bg-bgHoverSideBar"
        >
          <span>상품 관리</span>
          {isProductOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isProductOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="w-full space-y-1 px-2 py-1 text-sm">
            {categories?.map(({ categoryName, categoryUrl }, index) => (
              <button
                key={index}
                className={`flex w-full rounded-lg px-4 py-2 hover:bg-bgHoverSideBar ${selectedMenu === categoryUrl ? 'bg-bgHoverSideBar' : ''}`}
                onClick={() => router.push(`/${type}/products/${categoryUrl}`)}
              >
                - {categoryName}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }
  return (
    <button
      className={`flex rounded-lg p-4 hover:bg-bgHoverSideBar ${selectedMenu === path ? 'bg-bgHoverSideBar' : ''}`}
      onClick={() => router.push(`/${type}${path}`)}
    >
      {name}
    </button>
  )
}
