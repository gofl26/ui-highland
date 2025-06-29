'use client'
import { useState } from 'react'

import { useToast } from '@/components/commons/toast/ToastProvider'
import { deleteUser, getUsers, updateUsers } from '@/serverActions/handler'
import { userResponse } from '@/types/users'

type Row = {
  email: string
  userName: string
  role: string
  phoneNumber: string
  gender: string
}
const columns: { key: keyof Row; label: string }[] = [
  { key: 'email', label: '이메일' },
  { key: 'userName', label: '유저이름' },
  { key: 'role', label: '권한' },
  { key: 'phoneNumber', label: '전화번호' },
  { key: 'gender', label: '성별' },
]
interface Props {
  users: { rows: userResponse[]; total: number }
}
export default function UserListGrid({ users }: Props) {
  const { rows, total } = users
  const pageSize = 10
  const roleMap: Record<string, string> = {
    admin: '관리자',
    customer: '일반사용자',
  }
  const genderMap: Record<string, string> = {
    male: '남성',
    female: '여성',
  }

  const { showToast } = useToast()

  const [page, setPage] = useState(1)
  const [filterColumn, setFilterColumn] = useState<
    'email' | 'userName' | 'role' | 'phoneNumber' | 'gender'
  >('userName')
  const [keyword, setKeyword] = useState('')
  const [totalNumber, setTotalNumber] = useState(total)
  const [data, setData] = useState(rows)
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editableRow, setEditableRow] = useState<userResponse | null>(null)

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as keyof Row
    setFilterColumn(value)
  }
  const formatCellValue = (key: keyof Row, value: string) => {
    if (key === 'role') return roleMap[value] || value
    if (key === 'gender') return genderMap[value] || value
    return value
  }
  const handleClickSearch = async () => {
    try {
      if (keyword) {
        const query = `${filterColumn}.like=${keyword}`
        const result = await getUsers(query)
        if (result) {
          const { rows, total } = result
          setData(rows)
          setTotalNumber(total)
        } else showToast('조회 실패', 'error')
      } else {
        const result = await getUsers()
        if (result) {
          const { rows, total } = result
          setData(rows)
          setTotalNumber(total)
        } else showToast('조회 실패', 'error')
      }
    } catch (error) {
      showToast('조회 실패', 'error')
    }
  }
  const handleClickSaveUser = async () => {
    if (selectedRowIndex === null) return
    const body = {
      id: editableRow?.id,
      userName: editableRow?.userName,
      role: editableRow?.role,
      phoneNumber: editableRow?.phoneNumber,
      gender: editableRow?.gender,
    }
    const result = await updateUsers(body)
    if (result) {
      const newData = [...data]
      if (editableRow) newData[selectedRowIndex] = editableRow
      setData(newData)
      setEditMode(false)
      setEditableRow(null)
      showToast('수정 성공', 'success')
    } else showToast('수정 실패', 'error')
  }
  const handleClickDeleteUser = async () => {
    if (selectedRowIndex === null) return
    const result = await deleteUser(data[selectedRowIndex].id)
    if (result) {
      const newData = [...data]
      newData.splice(selectedRowIndex, 1)
      setData(newData)
      setSelectedRowIndex(null)
      setEditMode(false)
      showToast('삭제 성공', 'success')
    } else {
      showToast('삭제 실패', 'error')
    }
  }
  return (
    <div className="mt-4 flex w-full">
      <div className="w-full">
        {/* Search Bar */}
        <div className="mb-4 flex justify-between">
          <div className="flex gap-4">
            <select
              className="rounded-lg border border-borderDefault px-2 py-1 focus:outline-inputFocus"
              value={filterColumn}
              onChange={handleChangeSelect}
            >
              {columns.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="rounded-lg border border-borderDefault p-2 pr-10 focus:outline-inputFocus"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="검색"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleClickSearch()
                }
              }}
            />
            <button
              className="rounded-lg bg-bgPrimary px-4 py-2 text-textPrimary"
              onClick={handleClickSearch}
            >
              검색
            </button>
          </div>
          {selectedRowIndex !== null && (
            <div className="flex justify-end gap-2">
              {editMode ? (
                <button
                  className="rounded bg-green-600 px-3 py-1 text-white"
                  onClick={() => handleClickSaveUser()}
                >
                  저장
                </button>
              ) : (
                <button
                  className="rounded bg-blue-600 px-3 py-1 text-white"
                  onClick={() => {
                    setEditMode(true)
                    console.info({ ...data[selectedRowIndex] })
                    setEditableRow({ ...data[selectedRowIndex] })
                  }}
                >
                  수정
                </button>
              )}

              <button
                className="rounded bg-red-600 px-3 py-1 text-white"
                onClick={handleClickDeleteUser}
              >
                삭제
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <table className="min-w-full border-collapse border border-borderDefault text-sm">
          <thead>
            <tr className="bg-bgHeader">
              {columns.map(({ key, label }) => (
                <th key={key} className="border px-4 py-2">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className={`cursor-pointer ${
                  selectedRowIndex === idx
                    ? 'bg-bgPrimary text-textPrimary'
                    : 'even:bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => {
                  if (editMode) return
                  if (selectedRowIndex === idx) {
                    setSelectedRowIndex(null)
                    setEditMode(false)
                    setEditableRow(null)
                  } else {
                    setSelectedRowIndex(idx)
                    setEditMode(false)
                    setEditableRow(null)
                  }
                }}
              >
                {columns.map(({ key }) => (
                  <td key={key} className="border px-4 py-2">
                    {editMode && selectedRowIndex === idx ? (
                      <input
                        className="w-full rounded border px-1 py-0.5 text-textDefault"
                        value={editableRow?.[key] ?? ''}
                        disabled={key === 'email'}
                        onChange={(e) =>
                          setEditableRow((prev) =>
                            prev ? { ...prev, [key]: e.target.value } : prev,
                          )
                        }
                      />
                    ) : (
                      formatCellValue(key, row[key]!)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            이전
          </button>
          <span>
            {page} / {Math.max(1, Math.ceil(totalNumber / pageSize))}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(Math.ceil(totalNumber / pageSize), p + 1))}
            disabled={page >= Math.ceil(totalNumber / pageSize)}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  )
}
