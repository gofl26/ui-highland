'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ChevronDown, ChevronRight } from 'lucide-react'
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
          className="w-full px-4 py-4 flex items-center rounded-lg justify-between hover:bg-bgHoverSideBar"
        >
          <span>상품 관리</span>
          {isProductOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isProductOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="w-full space-y-1 text-sm px-2 py-1">
            {categories?.map(({ categoryName, categoryUrl }, index) => (
              <button
                key={index}
                className={`flex w-full px-4 py-2 rounded-lg hover:bg-bgHoverSideBar ${selectedMenu === categoryUrl ? 'bg-bgHoverSideBar' : ''}`}
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
      className={`flex px-4 py-4 rounded-lg hover:bg-bgHoverSideBar ${selectedMenu === path ? 'bg-bgHoverSideBar' : ''}`}
      onClick={() => router.push(`/${type}${path}`)}
    >
      {name}
    </button>
  )
}
