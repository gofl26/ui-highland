'use client'

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

export default function MenuInfoAccordion() {
  const [menuInfo, setMenuInfo] = useState([])
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
    </>
  )
}
