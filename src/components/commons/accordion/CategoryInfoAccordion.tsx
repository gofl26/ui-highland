'use client'

import { useState } from 'react'

import { useToast } from '@/components/commons/toast/ToastProvider'
import { createCategory, updateCategory, deleteCategory } from '@/serverActions/categories'
import { categoryResponse } from '@/types/category'
interface Props {
  categoryInfo: categoryResponse[]
}

export default function CategoryInfoAccordion(props: Props) {
  const { categoryInfo } = props
  const [category, setCategory] = useState<categoryResponse[]>(categoryInfo)

  const { showToast } = useToast()

  const handleAddCategoryRow = () => {
    setCategory((prev) => [
      ...prev,
      {
        id: `new_${Date.now().toString()}`,
        categoryName: '',
        active: true,
        categoryUrl: '',
      },
    ])
  }
  const handleDeleteRow = async (index: number) => {
    try {
      if (category[index].id.includes('new_')) {
        setCategory((prev) => prev.filter((item, _index) => _index !== index))
      } else {
        const result = await deleteCategory(category[index].id)
        if (result) {
          setCategory((prev) => prev.filter((item, _index) => _index !== index))
          showToast('삭제 성공', 'success')
        }
      }
    } catch (error) {
      showToast('삭제 실패', 'error')
    }
  }
  const handleClickSaveCategory = async () => {
    try {
      const idArray: string[] = []
      for (let index = 0; index < category.length; index++) {
        const element = category[index]
        if (element.id.includes('new_')) {
          const result = await createCategory({
            categoryName: element.categoryName,
            categoryUrl: element.categoryUrl,
            active: element.active,
          })
          if (result) idArray.push(result[0].id)
        } else {
          await updateCategory({
            id: element.id,
            categoryName: element.categoryName,
            categoryUrl: element.categoryUrl,
            active: element.active,
          })
          idArray.push(element.id)
        }
      }
      const newCategoryInfo = categoryInfo.reduce<categoryResponse[]>(
        (acc, { id, ...etc }, index) => {
          acc.push({ id: idArray[index], ...etc })
          return acc
        },
        [],
      )
      setCategory(newCategoryInfo)
      showToast('저장 성공', 'success')
    } catch (error) {
      showToast('저장 실패', 'error')
    }
  }

  return (
    <>
      <div className="mt-8 flex w-full justify-between rounded-t-lg bg-[#FAFAFA] px-4 py-2">
        <p>카테고리 관리</p>
      </div>
      <div className="flex w-full flex-col space-y-2 border p-4">
        {category.map((item, index) => (
          <div
            key={index}
            className={`flex items-center space-x-4 rounded border bg-white p-2 transition-colors`}
          >
            <input
              type="text"
              value={item.categoryName}
              onChange={(e) => {
                const newCategory = [...category]
                newCategory[index].categoryName = e.target.value
                setCategory(newCategory)
              }}
              className="flex-1 rounded border p-2 text-sm focus:outline-none"
              placeholder="카테고리 이름"
            />
            <select
              className="rounded border p-2 text-sm"
              value={item.active ? '활성화' : '비활성화'}
              onChange={(e) => {
                const newCategoryInfo = [...category]
                newCategoryInfo[index].active = e.target.value === '활성화' ? true : false
                setCategory(newCategoryInfo)
              }}
            >
              <option>활성화</option>
              <option>비활성화</option>
            </select>
            <input
              type="text"
              value={item.categoryUrl}
              onChange={(e) => {
                const newCategoryInfo = [...category]
                newCategoryInfo[index].categoryUrl = e.target.value
                setCategory(newCategoryInfo)
              }}
              className="flex-1 rounded border p-2 text-sm focus:outline-none"
              placeholder="카테고리 URL"
            />
            <button
              className="text-red-400 hover:text-red-600"
              onClick={() => handleDeleteRow(index)}
            >
              ➖
            </button>
          </div>
        ))}

        {/* 하단 추가/순서 버튼 */}
        <div className="flex items-center justify-end gap-4">
          <button
            onClick={handleAddCategoryRow}
            className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
          >
            추가
          </button>
          <button
            className="rounded bg-bgPrimary px-4 py-2 text-sm text-textPrimary"
            onClick={handleClickSaveCategory}
          >
            저장
          </button>
        </div>
      </div>
    </>
  )
}
