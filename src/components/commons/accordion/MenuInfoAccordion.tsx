'use client'

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { GripVertical } from 'lucide-react'
import { useState } from 'react'

import { useToast } from '@/components/commons/toast/ToastProvider'
import { deleteMenu, updateMenu, createMenu } from '@/serverActions/menu'
import { menuResponse } from '@/types/menu'
interface Props {
  menuInfo: menuResponse[]
}

export default function MenuInfoAccordion(props: Props) {
  const { menuInfo } = props
  const [menu, setMenu] = useState<menuResponse[]>(menuInfo)
  const [isSorting, setIsSorting] = useState(false)

  const { showToast } = useToast()

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
          showToast('삭제 성공', 'success')
        }
      }
    } catch (error) {
      showToast('삭제 실패', 'error')
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
      showToast('저장 성공', 'success')
    } catch (error) {
      showToast('저장 실패', 'error')
    }
  }
  return (
    <>
      <div className="mt-8 flex w-full justify-between rounded-t-lg bg-bgHeader px-4 py-2">
        <p>메뉴 관리</p>
      </div>
      <div className="flex w-full flex-col gap-4 space-y-6 border p-4">
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
                        className={`flex items-center space-x-4 rounded border bg-white p-2 transition-colors duration-300 ${
                          snapshot.isDragging ? 'bg-gray-100' : ''
                        }`}
                      >
                        {/* 드래그 핸들 */}
                        {isSorting && (
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab text-gray-400 hover:text-gray-600"
                          >
                            <GripVertical className="size-5" />
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
                          className="flex-1 rounded border p-2 text-sm focus:outline-none"
                          placeholder="메뉴 이름"
                        />
                        <select
                          value={item.active ? '활성화' : '비활성화'}
                          onChange={(e) => {
                            const newMenus = [...menu]
                            newMenus[index].active = e.target.value === '활성화' ? true : false
                            setMenu(newMenus)
                          }}
                          className="rounded border p-2 text-sm"
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
                          className="flex-1 rounded border p-2 text-sm focus:outline-none"
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
            className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
          >
            추가
          </button>

          <div className="h-5 border-l" />

          {!isSorting ? (
            <button
              onClick={() => setIsSorting(true)}
              className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
            >
              순서 설정
            </button>
          ) : (
            <button
              onClick={() => setIsSorting(false)}
              className="rounded bg-bgPrimary px-4 py-2 text-sm text-textPrimary"
            >
              순서 저장
            </button>
          )}
          <div className="h-5 border-l" />
          <button
            className="rounded bg-bgPrimary px-4 py-2 text-sm text-textPrimary"
            onClick={handleClickSaveMenu}
          >
            저장
          </button>
        </div>
      </div>
    </>
  )
}
