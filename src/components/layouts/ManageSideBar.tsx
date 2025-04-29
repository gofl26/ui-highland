'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { atomUserInfo, atomCategoryInfo } from '@/stores/atoms'

interface CategorySideBar {
  name: string
  url: string
}

export default function ManageSideBar() {
  const router = useRouter()
  const userInfo = useAtomValue(atomUserInfo)
  const categoryInfo = useAtomValue(atomCategoryInfo)
  const pathname = usePathname()

  const [selectedMenu, setSelectedMenu] = useState('')
  const [isProductOpen, setProductOpen] = useState(true)
  const [categorySideBarList, setCategorySideBarList] = useState<CategorySideBar[]>([])

  useEffect(() => {
    const splitPathArray = pathname.split('/')
    const selectMenu = `/${splitPathArray[splitPathArray.length - 1]}`
    setSelectedMenu(selectMenu)
  }, [pathname])
  useEffect(() => {
    const list = categoryInfo.reduce<CategorySideBar[]>((acc, { categoryName, categoryUrl }) => {
      acc.push({ name: categoryName, url: categoryUrl })
      return acc
    }, [])
    setCategorySideBarList(list)
  }, [categoryInfo])
  return (
    <div className="flex flex-col w-64 shrink-0 gap-8 p-4 bg-[rgba(239,236,233,0.3)] overflow-y-auto">
      <div className="flex w-full py-4 gap-4 justify-center border-b border-[#EFECE9]">
        <Image src="/logo.svg" alt="logo" width="32" height="32" />
        <div className="flex flex-col">
          <p className="font-medium">{userInfo.user_name}</p>
          <p className="text-xs font-normal">{userInfo.email}</p>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <button
          className="flex px-4 py-4 hover:bg-white"
          onClick={() => router.push('/manage/myInfo')}
        >
          개인정보 수정
        </button>
        <button
          className="flex px-4 py-4 hover:bg-white"
          onClick={() => router.push('/manage/users')}
        >
          회원 관리
        </button>
        <button
          className="flex px-4 py-4 hover:bg-white"
          onClick={() => router.push('/manage/site')}
        >
          사이트 관리
        </button>
        <button
          className="flex px-4 py-4 hover:bg-white"
          onClick={() => router.push('/manage/orders')}
        >
          주문내역 관리
        </button>
        <div className="w-full">
          <button
            onClick={() => setProductOpen((prev) => !prev)}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-white"
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
            <div className="w-full space-y-1 text-gray-700 text-sm px-2 py-1">
              {categorySideBarList.map(({ name, url }, index) => (
                <button
                  key={index}
                  className={`flex w-full px-4 py-2 hover:bg-white ${selectedMenu === url ? 'bg-white' : ''}`}
                  onClick={() => router.push(`/manage/products/${url}`)}
                >
                  - {name}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button className="flex px-4 py-4 hover:bg-[#FFFFFF]" onClick={() => router.push('')}>
          상품 관리
        </button>
        <button className="flex px-4 py-4 hover:bg-[#FFFFFF]" onClick={() => router.push('')}>
          문의
        </button>
        <button className="flex px-4 py-4 hover:bg-[#FFFFFF]" onClick={() => router.push('')}>
          자주 묻는 질문
        </button>
        <button className="flex px-4 py-4 hover:bg-[#FFFFFF]" onClick={() => router.push('')}>
          공지사항
        </button>
        <button className="flex px-4 py-4 hover:bg-[#FFFFFF]" onClick={() => router.push('')}>
          상품후기
        </button>
      </div>
    </div>
  )
}
