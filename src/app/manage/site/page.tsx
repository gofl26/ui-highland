'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useAtom } from 'jotai'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { ChevronDown, ChevronRight, GripVertical } from 'lucide-react'
import { atomSiteInfo, atomMenuInfo, atomCategoryInfo } from '@/stores/atoms'
import { siteResponse } from '@/types/sites'
import { menuResponse } from '@/types/menu'
import { categoryResponse } from '@/types/category'

export default function Site() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { data: session } = useSession()
  const token = session?.accessToken
  const [siteInfo, setSiteInfo] = useAtom(atomSiteInfo)
  const [menuInfo, setMenuInfo] = useAtom(atomMenuInfo)
  const [categoryInfo, setCategoryInfo] = useAtom(atomCategoryInfo)

  const [logoOpen, setLogoOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [siteName, setSiteName] = useState<string>('')
  const [isSorting, setIsSorting] = useState(false)

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const newMenus = Array.from(menuInfo)
    const [removed] = newMenus.splice(result.source.index, 1)
    newMenus.splice(result.destination.index, 0, removed)

    const reorderedMenus = newMenus.map((menu, idx) => ({
      ...menu,
      menuOrder: idx,
    }))

    setMenuInfo(reorderedMenus)
  }

  const handleAddMenuRow = () => {
    setMenuInfo((prev) => [
      ...prev,
      {
        id: `new_${Date.now().toString()}`,
        menuName: '',
        active: true,
        menuUrl: '',
        menuOrder: prev.length,
      },
    ])
  }
  const handleAddCategoryRow = () => {
    setCategoryInfo((prev) => [
      ...prev,
      {
        id: `new_${Date.now().toString()}`,
        categoryName: '',
        active: true,
        categoryUrl: '',
      },
    ])
  }
  const handleDeleteRow = async (menuOrder: number) => {
    try {
      if (menuInfo[menuOrder].id.includes('new_')) {
        setMenuInfo((prev) => prev.filter((item) => item.menuOrder !== menuOrder))
      } else {
        const result = await fetch(`${API_URL}/api/menu/delete`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: menuInfo[menuOrder].id }),
        })
        if (result.ok) {
          setMenuInfo((prev) => prev.filter((item) => item.menuOrder !== menuOrder))
        }
      }
    } catch (error) {
      alert(error)
    }
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0]
      setSelectedFile(file)
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setPreview(reader.result) // 문자열만 상태에 저장
          }
        }
        reader.readAsDataURL(file)
      } else {
        setPreview(null)
      }
    }
  }
  const handleClickSaveLogoFile = async () => {
    if (!token) return
    try {
      const formData = new FormData()
      if (!selectedFile) return
      if (!selectedFile?.type.includes('image')) return
      formData.append('file', selectedFile)
      formData.append('siteName', JSON.stringify(siteName))
      if (siteInfo.id) {
        formData.append('id', siteInfo.id)
        const result = await fetch(`${API_URL}/api/sites/update`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })
        if (result.ok) {
          setSiteInfo((prev) => ({ ...prev, siteName }))
          alert('저장성공')
        }
      } else {
        const result = await fetch(`${API_URL}/api/sites/create`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })
        if (result.ok) {
          const {
            data: { rows = [] },
          }: { data: { rows: siteResponse[] } } = await result.json()
          if (rows.length > 0) setSiteInfo(rows[0])
          alert('저장성공')
        }
      }
    } catch (error) {
      alert(error)
    }
  }
  const handleClickSaveMenu = async () => {
    try {
      const idArray: string[] = []
      for (let index = 0; index < menuInfo.length; index++) {
        const element = menuInfo[index]
        const body = element.id.includes('new_')
          ? {
              menuName: element.menuName,
              menuUrl: element.menuUrl,
              active: element.active,
              menuOrder: element.menuOrder,
            }
          : {
              id: element.id,
              menuName: element.menuName,
              menuUrl: element.menuUrl,
              active: element.active,
              menuOrder: element.menuOrder,
            }
        const url = element.id.includes('new_')
          ? `${API_URL}/api/menu/create`
          : `${API_URL}/api/menu/update`
        const method = element.id.includes('new_') ? 'POST' : 'PUT'
        const result = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })
        const data = await result.json()
        if (element.id.includes('new_') && data.rows) idArray.push(data.rows[0].id)
        else idArray.push(element.id)
      }
      const newMenuInfo = menuInfo.reduce<menuResponse[]>((acc, { id, ...etc }, index) => {
        acc.push({ id: idArray[index], ...etc })
        return acc
      }, [])
      setMenuInfo(newMenuInfo)
      alert('저장성공')
    } catch (error) {
      alert(error)
    }
  }
  const handleClickSaveCategory = async () => {
    try {
      const idArray: string[] = []
      for (let index = 0; index < categoryInfo.length; index++) {
        const element = categoryInfo[index]
        const body = element.id.includes('new_')
          ? {
              categoryName: element.categoryName,
              categoryUrl: element.categoryUrl,
              active: element.active,
            }
          : {
              id: element.id,
              categoryName: element.categoryName,
              categoryUrl: element.categoryUrl,
              active: element.active,
            }
        const url = element.id.includes('new_')
          ? `${API_URL}/api/category/create`
          : `${API_URL}/api/category/update`
        const method = element.id.includes('new_') ? 'POST' : 'PUT'
        const result = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })
        const data = await result.json()
        if (element.id.includes('new_') && data.rows) idArray.push(data.rows[0].id)
        else idArray.push(element.id)
      }
      const newcategoryInfo = categoryInfo.reduce<categoryResponse[]>(
        (acc, { id, ...etc }, index) => {
          acc.push({ id: idArray[index], ...etc })
          return acc
        },
        [],
      )
      setCategoryInfo(newcategoryInfo)
      alert('저장성공')
    } catch (error) {
      alert(error)
    }
  }
  const getSiteFile = useCallback(
    async (path: string) => {
      try {
        const fileNameArray = path.split('/')
        const fileName = fileNameArray[fileNameArray.length - 1]
        const result = await fetch(`${API_URL}/api/files/getFile?fileName=${fileName}`)
        const blob = await result.blob()
        const file = new File([blob], fileName, { type: blob.type })
        const reader = new FileReader()
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setPreview(reader.result) // 문자열만 상태에 저장
          }
        }
        setSelectedFile(file)
        reader.readAsDataURL(file)
      } catch (error) {
        alert(error)
      }
    },
    [API_URL],
  )
  useEffect(() => {
    if (siteInfo.id) {
      setSiteName(siteInfo.siteName)
      getSiteFile(siteInfo.sitesFile)
    }
  }, [siteInfo, setSiteName, getSiteFile])
  return (
    <div className="flex flex-col w-full p-8">
      {/* 페이지 네임 */}
      <p className="text-lg font-semibold text-textDefault">사이트 관리</p>
      <div
        className="flex w-full justify-between mt-8 px-4 py-2 rounded-t-lg bg-[#FAFAFA] cursor-pointer"
        onClick={() => setLogoOpen((prev) => !prev)}
      >
        <p>사이트 정보</p>
        {logoOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </div>
      {!logoOpen && (
        <div className="flex flex-col w-full border p-4 gap-4">
          <div className="flex w-full items-center gap-4">
            <p className="text-xs">사이트 이름</p>
            <input
              value={siteName}
              className="focus:outline-none px-4 py-2 rounded-lg border border-borderDefault"
              onChange={(e) => setSiteName(e.target.value)}
            />
          </div>
          <div className="flex w-full justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                파일 선택
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              {selectedFile && (
                <div className="text-xs text-gray-700 text-right">
                  <div className="font-semibold">{selectedFile.name}</div>
                  <div>{(selectedFile.size / 1024).toFixed(1)} KB</div>
                </div>
              )}
            </div>
            <button
              className="px-4 py-2 rounded-lg bg-bgPrimary text-textPrimary"
              onClick={handleClickSaveLogoFile}
            >
              저장
            </button>
          </div>
          {preview && (
            <>
              <Image
                src={preview}
                alt="Preview"
                width={100} // 이미지의 너비 설정
                height={100} // 이미지의 높이 설정
                objectFit="contain" // 이미지 비율 유지하면서 맞추기
              />
            </>
          )}
        </div>
      )}
      <div className="flex w-full justify-between mt-8 px-4 py-2 rounded-t-lg bg-[#FAFAFA]">
        <p>메뉴 관리</p>
      </div>
      <div className="flex flex-col w-full border p-4 gap-4 space-y-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="menu-list" isDropDisabled={!isSorting}>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {menuInfo.map((menu, index) => (
                  <Draggable
                    key={menu.id}
                    draggableId={menu.id}
                    index={index}
                    isDragDisabled={!isSorting}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center space-x-4 p-2 border rounded bg-white transition-colors duration-300 ${
                          snapshot.isDragging ? 'bg-gray-100' : ''
                        }`}
                      >
                        {/* 드래그 핸들 */}
                        {isSorting && (
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab text-gray-400 hover:text-gray-600"
                          >
                            <GripVertical className="w-5 h-5" />
                          </div>
                        )}

                        <input
                          type="text"
                          value={menu.menuName}
                          onChange={(e) => {
                            const newMenus = [...menuInfo]
                            newMenus[index].menuName = e.target.value
                            setMenuInfo(newMenus)
                          }}
                          className="focus:outline-none flex-1 border rounded p-2 text-sm"
                          placeholder="메뉴 이름"
                        />
                        <select
                          value={menu.active ? '활성화' : '비활성화'}
                          onChange={(e) => {
                            const newMenus = [...menuInfo]
                            newMenus[index].active = e.target.value === '활성화' ? true : false
                            setMenuInfo(newMenus)
                          }}
                          className="border rounded p-2 text-sm"
                        >
                          <option>활성화</option>
                          <option>비활성화</option>
                        </select>
                        <input
                          type="text"
                          value={menu.menuUrl}
                          onChange={(e) => {
                            const newMenus = [...menuInfo]
                            newMenus[index].menuUrl = e.target.value
                            setMenuInfo(newMenus)
                          }}
                          className="focus:outline-none flex-1 border rounded p-2 text-sm"
                          placeholder="메뉴 URL"
                        />
                        <button
                          onClick={() => handleDeleteRow(menu.menuOrder)}
                          className="text-red-400 hover:text-red-600"
                        >
                          ➖
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* 하단 추가/순서 버튼 */}
        <div className="flex items-center justify-end gap-4">
          <button
            onClick={handleAddMenuRow}
            className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            추가
          </button>

          <div className="border-l h-5" />

          {!isSorting ? (
            <button
              onClick={() => setIsSorting(true)}
              className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              순서 설정
            </button>
          ) : (
            <button
              onClick={() => setIsSorting(false)}
              className="px-4 py-2 text-sm rounded bg-bgPrimary text-textPrimary"
            >
              순서 저장
            </button>
          )}
          <div className="border-l h-5" />
          <button
            className="px-4 py-2 text-sm rounded bg-bgPrimary text-textPrimary"
            onClick={handleClickSaveMenu}
          >
            저장
          </button>
        </div>
      </div>
      <div className="flex w-full justify-between mt-8 px-4 py-2 rounded-t-lg bg-[#FAFAFA]">
        <p>카테고리 관리</p>
      </div>
      <div className="flex flex-col w-full border p-4 gap-4 space-y-6">
        {categoryInfo.map((category, index) => (
          <div
            key={index}
            className={`flex items-center space-x-4 p-2 border rounded bg-white transition-colors duration-300`}
          >
            <input
              type="text"
              value={category.categoryName}
              onChange={(e) => {
                const newCategory = [...categoryInfo]
                newCategory[index].categoryName = e.target.value
                setCategoryInfo(newCategory)
              }}
              className="focus:outline-none flex-1 border rounded p-2 text-sm"
              placeholder="카테고리 이름"
            />
            <select
              className="border rounded p-2 text-sm"
              value={category.active ? '활성화' : '비활성화'}
              onChange={(e) => {
                const newCategoryInfo = [...categoryInfo]
                newCategoryInfo[index].active = e.target.value === '활성화' ? true : false
                setCategoryInfo(newCategoryInfo)
              }}
            >
              <option>활성화</option>
              <option>비활성화</option>
            </select>
            <input
              type="text"
              value={category.categoryUrl}
              onChange={(e) => {
                const newCategoryInfo = [...categoryInfo]
                newCategoryInfo[index].categoryUrl = e.target.value
                setCategoryInfo(newCategoryInfo)
              }}
              className="focus:outline-none flex-1 border rounded p-2 text-sm"
              placeholder="카테고리 URL"
            />
            <button className="text-red-400 hover:text-red-600">➖</button>
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
    </div>
  )
}
