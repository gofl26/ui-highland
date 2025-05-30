'use client'
import moment from 'moment'
import { useState, useEffect } from 'react'

import { useToast } from '@/components/commons/toast/ToastProvider'
import CreateProductModal from '@/components/modals/CreateProductModal'
import { createFaq, getFaq, deleteFaq, updateFaq } from '@/serverActions/faq'
import { inquiryCategory } from '@/stores/inquiry'
import { faqResponse, faqForm } from '@/types/faq'

import Input from '../commons/input/defaultInput'

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
  const { showToast } = useToast()

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
  const handleChangQuestionInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target
    const newFaqForm = JSON.parse(JSON.stringify(faqForm))
    newFaqForm[name] = value
    setFaqForm(newFaqForm)
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
      showToast('삭제 성공', 'success')
    } else showToast('삭제 실패', 'error')
  }
  const handleClickUpdateFaq = async () => {
    try {
      if (selectedRowIndex === null) return
      const result = await updateFaq({ id: data[selectedRowIndex].id, ...faqForm })
      if (!result) showToast('저장 실패', 'error')
      else {
        setEditMode(false)
        showToast('저장 성공', 'success')
        setSelectedRowIndex(null)
        const result = await getFaq()
        if (!result) {
          showToast('조회 실패', 'error')
          return
        }
        const { rows, total } = result
        setData(rows)
        setTotalNumber(total)
      }
    } catch (error) {
      showToast('저장 실패', 'error')
    }
  }
  const handleClickCreateFaq = async () => {
    try {
      const result = await createFaq(faqForm)
      if (!result) showToast('저장 실패', 'error')
      else {
        setOpenCreateFaqModal(false)
        setData((prev) => [...prev, result[0]])
        setTotalNumber((prev) => prev + 1)
        showToast('저장 성공', 'success')
      }
    } catch (error) {
      showToast('저장 실패', 'error')
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
      } else showToast('조회 실패', 'error')
    } catch (error) {
      showToast('조회 실패', 'error')
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
      } else showToast('조회 실패', 'error')
    } catch (error) {
      showToast('조회 실패', 'error')
    }
  }
  return (
    <div className="mt-4 flex w-full">
      <div className="w-full">
        <div className="mb-4 flex w-full items-center justify-between">
          <p className="text-sm">총 {totalNumber} 개</p>
          <div className="flex items-center gap-2">
            {selectedRowIndex !== null && (
              <div className="flex gap-2">
                <button
                  className="rounded-lg bg-red-600 px-3 py-2 text-textPrimary"
                  onClick={handleClickDeleteFaq}
                >
                  삭제
                </button>
                <button
                  className="rounded-lg bg-bgHeader px-3 py-2"
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
                <p className="text-xl font-bold">질문 수정</p>
              </div>
              <div className="mt-4 flex w-full flex-col rounded-lg border border-borderDefault">
                <div className="flex h-20 w-full border-b border-borderDefault">
                  <div className="flex w-1/5 items-center justify-center rounded-lg bg-bgDefault">
                    질문
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <Input
                      value={faqForm?.faqQuestion}
                      className="w-full p-1"
                      name="faqQuestion"
                      onChange={handleChangQuestionInput}
                    />
                  </div>
                </div>
                <div className="flex h-20 w-full border-b border-borderDefault">
                  <div className="flex w-1/5 items-center justify-center rounded-lg bg-bgDefault">
                    유형
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <select
                      value={faqForm.faqCategory}
                      className="w-full rounded-lg border border-borderDefault px-2 py-3 text-sm focus:outline-inputFocus"
                      onChange={(e) => {
                        const newFaqForm = JSON.parse(JSON.stringify(faqForm))
                        newFaqForm.faqCategory = e.target.value
                        setFaqForm(newFaqForm)
                      }}
                    >
                      {inquiryCategory.map((category, index) => (
                        <option key={index}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex h-20 w-full border-b border-borderDefault">
                  <div className="flex w-1/5 items-center justify-center rounded-lg bg-bgDefault">
                    답변
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <textarea
                      value={faqForm?.faqAnswer}
                      className="w-full rounded-lg border border-borderDefault p-2 pr-10 focus:outline-inputFocus"
                      name="faqAnswer"
                      onChange={handleChangeInput}
                    />
                  </div>
                </div>
              </div>
            </CreateProductModal>
            <button
              className="rounded-lg bg-bgPrimary px-3 py-2 text-textPrimary"
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
                <p className="text-xl font-bold">질문 등록</p>
              </div>
              <div className="mt-4 flex w-full flex-col rounded-lg border border-borderDefault">
                <div className="flex w-full border-b border-borderDefault">
                  <div className="flex w-1/5 items-center justify-center rounded-lg bg-bgDefault">
                    질문
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <Input
                      value={faqForm?.faqQuestion}
                      className="w-full p-1"
                      name="faqQuestion"
                      onChange={handleChangQuestionInput}
                    />
                  </div>
                </div>
                <div className="flex h-20 w-full border-b border-borderDefault">
                  <div className="flex w-1/5 items-center justify-center rounded-lg bg-bgDefault">
                    유형
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <select
                      value={faqForm.faqCategory}
                      className="w-full rounded-lg border border-borderDefault px-2 py-3 text-sm focus:outline-inputFocus"
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
                  <div className="flex w-1/5 items-center justify-center rounded-lg bg-bgDefault">
                    답변
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <textarea
                      value={faqForm?.faqAnswer}
                      className="w-full rounded-lg border border-borderDefault p-2 pr-10 focus:outline-inputFocus"
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
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={handleClickPreBtn}
            disabled={page === 1}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            이전
          </button>
          <span>
            {page} / {Math.max(1, Math.ceil(totalNumber / pageSize))}
          </span>
          <button
            onClick={handleClickNextBtn}
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
