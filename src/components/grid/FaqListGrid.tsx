'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import moment from 'moment'
import SuccessToast from '@/components/commons/toast/SuccessToast'
import ErrorToast from '@/components/commons/toast/ErrorToast'
import { faqResponse, faqForm } from '@/types/faq'
import { createFaq, getFaq, deleteFaq, updateFaq } from '@/serverActions/faq'
import CreateProductModal from '@/components/modals/CreateProductModal'

type Row = {
  faqQuestion: string
  faqAnswer: string
  faqCategory: string
  createdAt: string
}
const columns: { key: keyof Row; label: string }[] = [
  { key: 'faqCategory', label: '유형' },
  { key: 'faqQuestion', label: '질문' },
  { key: 'faqAnswer', label: '답변' },
  { key: 'createdAt', label: '등록일' },
]
const initFaqForm: faqForm = {
  faqQuestion: '',
  faqAnswer: '',
  faqCategory: '배송문의',
}
interface props {
  faqInfo: { rows: faqResponse[]; total: number }
}
export default function FaqListGrid({ faqInfo }: props) {
  const { rows, total } = faqInfo
  const pageSize = 10

  const [successMessage, setSuccessMessage] = useState<string[]>([])
  const [errorMessage, setErrorMessage] = useState<string[]>([])
  const [totalNumber, setTotalNumber] = useState(total)
  const [page, setPage] = useState(1)
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)
  const [data, setData] = useState(rows)
  const [openCreateFaqModal, setOpenCreateFaqModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [faqForm, setFaqForm] = useState<faqForm>(initFaqForm)

  const formatCellValue = (key: keyof Row, value: string) => {
    if (key === 'createdAt') return moment(value).format('YYYY-MM-DD')
    return value
  }
  const handleChangeInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value, name } = event.target
    const newFaqForm = JSON.parse(JSON.stringify(faqForm))
    newFaqForm[name] = value
    setFaqForm(newFaqForm)
  }
  const handleClickDeleteFaq = async () => {
    if (selectedRowIndex === null) return
    const result = await deleteFaq(data[selectedRowIndex].id)
    if (result) {
      const newData = [...data]
      newData.splice(selectedRowIndex, 1)
      setData(newData)
      setSelectedRowIndex(null)
      setTotalNumber((p) => p - 1)
      setSuccessMessage(['삭제 성공'])
    } else setErrorMessage(['삭제 실패'])
  }
  const handleClickUpdateFaq = async () => {
    try {
      if (selectedRowIndex === null) return
      const result = await updateFaq({ id: data[selectedRowIndex].id, ...faqForm })
      if (!result) setErrorMessage(['저장 실패'])
      else {
        setEditMode(false)
        setSuccessMessage(['저장 성공'])
        setSelectedRowIndex(null)
        const result = await getFaq()
        if (!result) {
          setErrorMessage(['조회 실패'])
          return
        }
        const { rows, total } = result
        setData(rows)
        setTotalNumber(total)
      }
    } catch (error) {
      setErrorMessage(['저장 실패'])
    }
  }
  const handleClickCreateFaq = async () => {
    try {
      const result = await createFaq(faqForm)
      if (!result) setErrorMessage(['저장 실패'])
      else {
        setOpenCreateFaqModal(false)
        setData((prev) => [...prev, result[0]])
        setSuccessMessage(['저장 성공'])
      }
    } catch (error) {
      setErrorMessage(['저장 실패'])
    }
  }
  const handleClickPreBtn = async () => {
    setPage((p) => Math.max(1, p - 1))
    try {
      const result = await getFaq(`from=${(page - 2) * 10}&size=10`)
      if (result) {
        const { rows, total } = result
        setData(rows)
        setTotalNumber(total)
      } else setErrorMessage(['조회 실패'])
    } catch (error) {
      setErrorMessage(['조회 실패'])
      console.info(error)
    }
  }
  const handleClickNextBtn = async () => {
    setPage((p) => Math.min(Math.ceil(totalNumber / pageSize), p + 1))
    try {
      const result = await getFaq(`from=${page * 10}&size=10`)
      if (result) {
        const { rows, total } = result
        setData(rows)
        setTotalNumber(total)
      } else setErrorMessage(['조회 실패'])
    } catch (error) {
      setErrorMessage(['조회 실패'])
      console.info(error)
    }
  }
  useEffect(() => {
    if (!successMessage.length) return
    const timer = setTimeout(() => {
      setSuccessMessage([])
    }, 5000)
    clearTimeout(timer)
  }, [successMessage])
  useEffect(() => {
    if (!errorMessage.length) return
    const timer = setTimeout(() => {
      setErrorMessage([])
    }, 5000)
    clearTimeout(timer)
  }, [errorMessage])
  return (
    <div className="flex w-full mt-4">
      {successMessage.length !== 0 && <SuccessToast message={successMessage} />}
      {errorMessage.length !== 0 && <ErrorToast message={errorMessage} />}
      <div className="w-full">
        <div className="flex w-full justify-between items-center mb-4">
          <p className="text-sm">총 {totalNumber} 개</p>
          <div className="flex items-center gap-2">
            {selectedRowIndex !== null && (
              <div className="flex gap-2">
                <button
                  className="bg-red-600 text-textPrimary px-3 py-2 rounded-lg"
                  onClick={handleClickDeleteFaq}
                >
                  삭제
                </button>
                <button
                  className="bg-bgHeader px-3 py-2 rounded-lg"
                  onClick={() => {
                    setFaqForm(data[selectedRowIndex])
                    setEditMode(true)
                  }}
                >
                  수정
                </button>
              </div>
            )}
            <CreateProductModal
              isOpen={editMode}
              onClose={() => setEditMode(false)}
              onSave={handleClickUpdateFaq}
            >
              <div className="flex w-full justify-center">
                <p className="font-bold text-xl">질문 수정</p>
              </div>
              <div className="flex flex-col w-full mt-4 border rounded-lg border-borderDefault">
                <div className="flex w-full h-20 border-b border-borderDefault">
                  <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
                    질문
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <textarea
                      value={faqForm?.faqQuestion}
                      className="w-full p-1"
                      name="faqQuestion"
                      onChange={handleChangeInput}
                    />
                  </div>
                </div>
                <div className="flex w-full h-20 border-b border-borderDefault">
                  <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
                    유형
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <select
                      value={faqForm.faqCategory}
                      className="w-full border border-borderDefault rounded-lg px-2 py-3 text-sm focus:outline-inputFocus"
                      onChange={(e) => {
                        const newFaqForm = JSON.parse(JSON.stringify(faqForm))
                        newFaqForm.faqCategory = e.target.value
                        setFaqForm(newFaqForm)
                      }}
                    >
                      <option>배송문의</option>
                      <option>상품문의</option>
                    </select>
                  </div>
                </div>
                <div className="flex w-full h-20 border-b border-borderDefault">
                  <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
                    답변
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <textarea
                      value={faqForm?.faqAnswer}
                      className="w-full p-1"
                      name="faqAnswer"
                      onChange={handleChangeInput}
                    />
                  </div>
                </div>
              </div>
            </CreateProductModal>
            <button
              className="bg-bgPrimary text-textPrimary px-3 py-2 rounded-lg"
              onClick={() => setOpenCreateFaqModal(true)}
            >
              추가
            </button>
            <CreateProductModal
              isOpen={openCreateFaqModal}
              onClose={() => setOpenCreateFaqModal(false)}
              onSave={handleClickCreateFaq}
            >
              <div className="flex w-full justify-center">
                <p className="font-bold text-xl">질문 등록</p>
              </div>
              <div className="flex flex-col w-full mt-4 border rounded-lg border-borderDefault">
                <div className="flex w-full border-b border-borderDefault">
                  <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
                    질문
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <textarea
                      value={faqForm.faqQuestion}
                      className="w-full p-1"
                      name="faqQuestion"
                      onChange={handleChangeInput}
                    />
                  </div>
                </div>
                <div className="flex w-full h-20 border-b border-borderDefault">
                  <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
                    유형
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <select
                      value={faqForm.faqCategory}
                      className="w-full border border-borderDefault rounded-lg px-2 py-3 text-sm focus:outline-inputFocus"
                      onChange={(e) => {
                        const newfaqForm = JSON.parse(JSON.stringify(faqForm))
                        newfaqForm.faqCategory = e.target.value
                        setFaqForm(newfaqForm)
                      }}
                    >
                      <option>배송문의</option>
                      <option>상품문의</option>
                    </select>
                  </div>
                </div>
                <div className="flex w-full">
                  <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
                    답변
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <textarea
                      value={faqForm?.faqAnswer}
                      className="w-full p-1"
                      name="faqAnswer"
                      onChange={handleChangeInput}
                    />
                  </div>
                </div>
              </div>
            </CreateProductModal>
          </div>
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
                  if (selectedRowIndex === idx) {
                    setSelectedRowIndex(null)
                  } else {
                    setSelectedRowIndex(idx)
                  }
                }}
              >
                {columns.map(({ key }) => (
                  <td key={key} className="border px-4 py-2">
                    {formatCellValue(key, row[key]!)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            onClick={handleClickPreBtn}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            이전
          </button>
          <span>
            {page} / {Math.max(1, Math.ceil(totalNumber / pageSize))}
          </span>
          <button
            onClick={handleClickNextBtn}
            disabled={page >= Math.ceil(totalNumber / pageSize)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  )
}
