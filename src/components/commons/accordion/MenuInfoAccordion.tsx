'use client'

import { useState } from 'react'
import { GripVertical } from 'lucide-react'
import { deleteMenu, updateMenu, createMenu } from '@/serverActions/menu'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import ErrorToast from '@/components/commons/toast/ErrorToast'
import SuccessToast from '@/components/commons/toast/SuccessToast'
import { menuResponse } from '@/types/menu'
interface Props {
  menuInfo: menuResponse[]
}

export default function MenuInfoAccordion(props: Props) {
  const { menuInfo } = props
  const [menu, setMenu] = useState<menuResponse[]>(menuInfo)
  const [isSorting, setIsSorting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState<string[]>([])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const newMenus = Array.from(menu)
    const [removed] = newMenus.splice(result.source.index, 1)
    newMenus.splice(result.destination.index, 0, removed)

    const reorderedMenus = newMenus.map((menu, idx) => ({
      ...menu,
      menuOrder: idx,
    }))

    setMenu(reorderedMenus)
  }
  const handleAddMenuRow = () => {
    setMenu((prev) => [
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
  const handleDeleteRow = async (menuOrder: number) => {
    try {
      if (menu[menuOrder].id.includes('new_')) {
        setMenu((prev) => prev.filter((item) => item.menuOrder !== menuOrder))
      } else {
        const result = await deleteMenu(menu[menuOrder].id)
        if (result) {
          setMenu((prev) => prev.filter((item) => item.menuOrder !== menuOrder))
        }
      }
    } catch (error) {
      setErrorMessage(['삭제 실패'])
    }
  }
  const handleClickSaveMenu = async () => {
    try {
      const idArray: string[] = []
      for (let index = 0; index < menu.length; index++) {
        const element = menu[index]

        if (element.id.includes('new_')) {
          const result = await createMenu({
            menuName: element.menuName,
            menuUrl: element.menuUrl,
            active: element.active,
            menuOrder: element.menuOrder,
          })
          if (result) idArray.push(result[0].id)
        } else {
          await updateMenu({
            id: element.id,
            menuName: element.menuName,
            menuUrl: element.menuUrl,
            active: element.active,
            menuOrder: element.menuOrder,
          })
          idArray.push(element.id)
        }
      }
      const newMenuInfo = menu.reduce<menuResponse[]>((acc, { id, ...etc }, index) => {
        acc.push({ id: idArray[index], ...etc })
        return acc
      }, [])
      setMenu(newMenuInfo)
      setSuccessMessage(['저장 성공'])
    } catch (error) {
      setErrorMessage(['저장 실패'])
    }
  }
  return (
    <>
      <div className="flex w-full justify-between mt-8 px-4 py-2 rounded-t-lg bg-bgHeader">
        <p>메뉴 관리</p>
      </div>
      <div className="flex flex-col w-full border p-4 gap-4 space-y-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="menu-list" isDropDisabled={!isSorting}>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {menu.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id}
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
                          value={item.menuName}
                          onChange={(e) => {
                            const newMenus = [...menu]
                            newMenus[index].menuName = e.target.value
                            setMenu(newMenus)
                          }}
                          className="focus:outline-none flex-1 border rounded p-2 text-sm"
                          placeholder="메뉴 이름"
                        />
                        <select
                          value={item.active ? '활성화' : '비활성화'}
                          onChange={(e) => {
                            const newMenus = [...menu]
                            newMenus[index].active = e.target.value === '활성화' ? true : false
                            setMenu(newMenus)
                          }}
                          className="border rounded p-2 text-sm"
                        >
                          <option>활성화</option>
                          <option>비활성화</option>
                        </select>
                        <input
                          type="text"
                          value={item.menuUrl}
                          onChange={(e) => {
                            const newMenus = [...menu]
                            newMenus[index].menuUrl = e.target.value
                            setMenu(newMenus)
                          }}
                          className="focus:outline-none flex-1 border rounded p-2 text-sm"
                          placeholder="메뉴 URL"
                        />
                        <button
                          onClick={() => handleDeleteRow(item.menuOrder)}
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
      {successMessage.length !== 0 && <SuccessToast message={successMessage} />}
      {errorMessage.length !== 0 && <ErrorToast message={errorMessage} />}
    </>
  )
}
