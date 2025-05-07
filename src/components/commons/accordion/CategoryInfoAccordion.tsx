'use client'

import { useState } from 'react'
import { createCategory, updateCategory, deleteCategory } from '@/serverActions/categories'
import ErrorToast from '@/components/commons/toast/ErrorToast'
import SuccessToast from '@/components/commons/toast/SuccessToast'
import { categoryResponse } from '@/types/category'
interface Props {
  categoryInfo: categoryResponse[]
}

export default function CategoryInfoAccordion(props: Props) {
  const { categoryInfo } = props
  const [category, setCategory] = useState<categoryResponse[]>(categoryInfo)
  const [errorMessage, setErrorMessage] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState<string[]>([])

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
        }
      }
    } catch (error) {
      setErrorMessage(['삭제 실패'])
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
      setSuccessMessage(['저장 성공'])
    } catch (error) {
      setErrorMessage(['저장 실패'])
    }
  }

  return (
    <>
      <div className="flex w-full justify-between mt-8 px-4 py-2 rounded-t-lg bg-[#FAFAFA]">
        <p>카테고리 관리</p>
      </div>
      <div className="flex flex-col w-full border p-4 space-y-2">
        {category.map((item, index) => (
          <div
            key={index}
            className={`flex items-center space-x-4 p-2 border rounded bg-white transition-colors`}
          >
            <input
              type="text"
              value={item.categoryName}
              onChange={(e) => {
                const newCategory = [...category]
                newCategory[index].categoryName = e.target.value
                setCategory(newCategory)
              }}
              className="focus:outline-none flex-1 border rounded p-2 text-sm"
              placeholder="카테고리 이름"
            />
            <select
              className="border rounded p-2 text-sm"
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
              className="focus:outline-none flex-1 border rounded p-2 text-sm"
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
            className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            추가
          </button>
          <button
            className="px-4 py-2 text-sm rounded bg-bgPrimary text-textPrimary"
            onClick={handleClickSaveCategory}
          >
            저장
          </button>
        </div>
      </div>
      {successMessage.length !== 0 && <SuccessToast message={successMessage} />}
      {errorMessage.length !== 0 && <ErrorToast message={errorMessage} />}
    </>
  )
}
