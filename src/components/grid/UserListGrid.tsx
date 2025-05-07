'use client'
import { useState, useMemo } from 'react'
import { userResponse } from '@/types/users'
import { deleteUser, getUsers, updateUsers } from '@/serverActions/handler'
import ErrorToast from '../commons/toast/ErrorToast'
import SuccessToast from '../commons/toast/SuccessToast'

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
  users: userResponse[]
}
export default function UserListGrid(props: Props) {
  const { users } = props

  const pageSize = 10
  const roleMap: Record<string, string> = {
    admin: '관리자',
    customer: '일반사용자',
  }
  const genderMap: Record<string, string> = {
    male: '남성',
    female: '여성',
  }

  const [page, setPage] = useState(1)
  const [filterColumn, setFilterColumn] = useState<
    'email' | 'userName' | 'role' | 'phoneNumber' | 'gender'
  >('userName')
  const [keyword, setKeyword] = useState('')
  const [data, setData] = useState(users)
  const [errorMessage, setErrorMessage] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState<string[]>([])
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editableRow, setEditableRow] = useState<userResponse | null>(null)

  const filteredData = useMemo(() => {
    return data.filter((item) => item[filterColumn]?.toLowerCase().includes(keyword.toLowerCase()))
  }, [filterColumn, keyword, data])

  const pagedData = data.slice((page - 1) * pageSize, page * pageSize)

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
        if (result) setData(result)
        else setErrorMessage(['조회 실패'])
      } else {
        const result = await getUsers()
        if (result) setData(result)
        else setErrorMessage(['조회 실패'])
      }
    } catch (error) {
      setErrorMessage(['조회 실패'])
      console.info(error)
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
      setSuccessMessage(['수정 성공'])
    } else setErrorMessage(['수정 실패'])
  }
  const handleClickDeleteUser = async () => {
    if (selectedRowIndex === null) return
    const result = await deleteUser(pagedData[selectedRowIndex].id)
    if (result) {
      const newData = [...pagedData]
      newData.splice(selectedRowIndex, 1)
      setData(newData)
      setSelectedRowIndex(null)
      setEditMode(false)
      setSuccessMessage(['삭제 성공'])
    } else {
      setErrorMessage(['삭제 실패'])
    }
  }
  return (
    <div className="flex w-full mt-4">
      {successMessage.length !== 0 && <SuccessToast message={successMessage} />}
      {errorMessage.length !== 0 && <ErrorToast message={errorMessage} />}
      <div className="w-full">
        {/* Search Bar */}
        <div className="flex gap-2 mb-4">
          <select
            className="border border-borderDefault rounded-lg px-2 py-1 focus:outline-inputFocus"
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
            className="border rounded-lg border-borderDefault p-2 pr-10 focus:outline-inputFocus"
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
            className="bg-bgPrimary text-textPrimary px-4 py-2 rounded-lg"
            onClick={handleClickSearch}
          >
            검색
          </button>
        </div>

        {selectedRowIndex !== null && (
          <div className="flex justify-end mb-2 gap-2">
            {editMode ? (
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={() => handleClickSaveUser()}
              >
                저장
              </button>
            ) : (
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
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
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={handleClickDeleteUser}
            >
              삭제
            </button>
          </div>
        )}
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
            {pagedData.map((row, idx) => (
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
                        className="border px-1 py-0.5 rounded w-full text-textDefault"
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
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            이전
          </button>
          <span>
            {page} / {Math.max(1, Math.ceil(filteredData.length / pageSize))}
          </span>
          <button
            onClick={() =>
              setPage((p) => Math.min(Math.ceil(filteredData.length / pageSize), p + 1))
            }
            disabled={page >= Math.ceil(filteredData.length / pageSize)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  )
}
