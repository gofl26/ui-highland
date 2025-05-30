'use client'
import moment from 'moment'
import { useState, useEffect, useRef } from 'react'

import { useToast } from '@/components/commons/toast/ToastProvider'
import CreateNoticeModal from '@/components/modals/CreateNoticeModal'
import TiptapEditor, { TiptapEditorRef } from '@/lib/tiptapEditor/TiptapEditor'
import { uploadFile } from '@/serverActions/handler'
import { createNotice, getNotice, deleteNotice, updateNotice } from '@/serverActions/notice'
import { noticeResponse, noticeForm } from '@/types/notice'

import Input from '../commons/input/defaultInput'

async function replaceBase64Images(html: string): Promise<string> {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const imgTags = doc.querySelectorAll('img')

  for (const img of imgTags) {
    const src = img.getAttribute('src')
    if (!src?.startsWith('data:image')) continue

    const blob = await (await fetch(src)).blob()
    const formData = new FormData()
    formData.append('file', blob, 'image.png')

    const url = await uploadFile(formData)
    if (url) img.setAttribute('src', url)
  }

  return doc.body.innerHTML
}

type Row = {
  noticeCategory: string
  noticeTitle: string
  noticeActive: string
  createdAt: string
}
const columns: { key: keyof Row; label: string }[] = [
  { key: 'noticeCategory', label: '유형' },
  { key: 'noticeTitle', label: '제목' },
  { key: 'noticeActive', label: '하이라이트' },
  { key: 'createdAt', label: '등록일' },
]
const initNoticeForm: noticeForm = {
  noticeCategory: '일반 공지',
  noticeTitle: '',
  noticeActive: true,
  noticeDesc: '',
}
interface props {
  noticeInfo: { rows: noticeResponse[]; total: number }
}
export default function FaqListGrid({ noticeInfo }: props) {
  const { rows, total } = noticeInfo
  const pageSize = 10
  const editorRef = useRef<TiptapEditorRef>(null)
  const initialContentRef = useRef<string>('')
  const { showToast } = useToast()

  const [totalNumber, setTotalNumber] = useState(total)
  const [page, setPage] = useState(1)
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)
  const [data, setData] = useState(rows)
  const [openCreateNoticeModal, setOpenCreateNoticeModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [noticeForm, setNoticeForm] = useState<noticeForm>(initNoticeForm)

  const formatCellValue = (key: keyof Row, value: string | boolean) => {
    if (key === 'noticeActive') return value ? '활성화' : '비활성화'
    if (key === 'createdAt' && typeof value !== 'boolean') return moment(value).format('YYYY-MM-DD')
    return value
  }
  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target
    const newNoticeForm = JSON.parse(JSON.stringify(noticeForm))
    newNoticeForm[name] = value
    setNoticeForm(newNoticeForm)
  }
  const handleClickDeleteNotice = async () => {
    if (selectedRowIndex === null) return
    const result = await deleteNotice(data[selectedRowIndex].id)
    if (result) {
      const newData = [...data]
      newData.splice(selectedRowIndex, 1)
      setData(newData)
      setSelectedRowIndex(null)
      setTotalNumber((p) => p - 1)
      showToast('삭제 성공', 'success')
    } else showToast('삭제 실패', 'error')
  }
  const handleClickUpdateNotice = async () => {
    if (selectedRowIndex === null) return
    const html = editorRef.current?.getHTML()
    if (!html) return
    const cleanedHTML = await replaceBase64Images(html)
    try {
      const newNoticeForm = JSON.parse(JSON.stringify(noticeForm))
      newNoticeForm.noticeDesc = cleanedHTML
      setNoticeForm(newNoticeForm)
      const result = await updateNotice({ id: data[selectedRowIndex].id, ...newNoticeForm })
      if (!result) showToast('저장 실패', 'error')
      else {
        setEditMode(false)
        showToast('저장 성공', 'success')
        setSelectedRowIndex(null)
        initialContentRef.current = ''
        const result = await getNotice()
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
  const handleClickCreateNotice = async () => {
    const html = editorRef.current?.getHTML()
    if (!html) return
    const cleanedHTML = await replaceBase64Images(html)
    try {
      const newNoticeForm = JSON.parse(JSON.stringify(noticeForm))
      newNoticeForm.noticeDesc = cleanedHTML
      setNoticeForm(newNoticeForm)
      const result = await createNotice(newNoticeForm)
      if (!result) showToast('저장 실패', 'error')
      else {
        setOpenCreateNoticeModal(false)
        setData((prev) => [...prev, result[0]])
        showToast('저장 성공', 'success')
      }
    } catch (error) {
      showToast('저장 실패', 'error')
    }
  }
  const handleClickPreBtn = async () => {
    setPage((p) => Math.max(1, p - 1))
    try {
      const result = await getNotice(`from=${(page - 2) * 10}&size=10`)
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
      const result = await getNotice(`from=${page * 10}&size=10`)
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
                  onClick={handleClickDeleteNotice}
                >
                  삭제
                </button>
                <button
                  className="rounded-lg bg-bgHeader px-3 py-2"
                  onClick={() => {
                    setNoticeForm(data[selectedRowIndex])
                    initialContentRef.current = data[selectedRowIndex].noticeDesc
                    setEditMode(true)
                  }}
                >
                  수정
                </button>
              </div>
            )}
            <CreateNoticeModal
              isOpen={editMode}
              onClose={() => setEditMode(false)}
              onSave={handleClickUpdateNotice}
            >
              <div className="flex w-full justify-center">
                <p className="text-xl font-bold">공지사항 수정</p>
              </div>
              <div className="mt-4 flex w-full flex-col rounded-lg border border-borderDefault">
                <div className="flex h-20 w-full border-b border-borderDefault">
                  <div className="flex w-1/5 items-center justify-center rounded-lg bg-bgDefault">
                    제목
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <Input
                      value={noticeForm?.noticeTitle}
                      name="noticeTitle"
                      onChange={handleChangeInput}
                    />
                  </div>
                </div>
                <div className="flex h-20 w-full border-b border-borderDefault">
                  <div className="flex w-1/5 items-center justify-center rounded-lg bg-bgDefault">
                    유형
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <select
                      value={noticeForm.noticeCategory}
                      className="w-full rounded-lg border border-borderDefault px-2 py-3 text-sm focus:outline-inputFocus"
                      onChange={(e) => {
                        const newNoticeForm = JSON.parse(JSON.stringify(noticeForm))
                        newNoticeForm.noticeCategory = e.target.value
                        setNoticeForm(newNoticeForm)
                      }}
                    >
                      <option>일반 공지</option>
                      <option>긴급 공지</option>
                      <option>이벤트</option>
                    </select>
                  </div>
                </div>
                <div className="flex w-full border-b border-borderDefault">
                  <div className="flex w-1/5 items-center justify-center rounded-lg bg-bgDefault">
                    본문
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <TiptapEditor initialContent={initialContentRef.current} ref={editorRef} />
                  </div>
                </div>
                <div className="flex h-20 w-full">
                  <div className="flex w-1/5 items-center justify-center rounded-lg bg-bgDefault">
                    하이라이트
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <select
                      value={noticeForm.noticeActive ? '활성화' : '비활성화'}
                      className="w-full rounded-lg border border-borderDefault px-2 py-3 text-sm focus:outline-inputFocus"
                      onChange={(e) => {
                        const newNoticeForm = JSON.parse(JSON.stringify(noticeForm))
                        newNoticeForm.noticeActive = e.target.value === '활성화' ? true : false
                        setNoticeForm(newNoticeForm)
                      }}
                    >
                      <option>활성화</option>
                      <option>비활성화</option>
                    </select>
                  </div>
                </div>
              </div>
            </CreateNoticeModal>
            <button
              className="rounded-lg bg-bgPrimary px-3 py-2 text-textPrimary"
              onClick={() => setOpenCreateNoticeModal(true)}
            >
              추가
            </button>
            <CreateNoticeModal
              isOpen={openCreateNoticeModal}
              onClose={() => setOpenCreateNoticeModal(false)}
              onSave={handleClickCreateNotice}
            >
              <div className="flex w-full justify-center">
                <p className="text-xl font-bold">공지사항 등록</p>
              </div>
              <div className="mt-4 flex w-full flex-col rounded-lg border border-borderDefault">
                <div className="flex h-20 w-full border-b border-borderDefault">
                  <div className="flex w-1/5 items-center justify-center rounded-lg bg-bgDefault">
                    제목
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <Input
                      value={noticeForm?.noticeTitle}
                      name="noticeTitle"
                      onChange={handleChangeInput}
                    />
                  </div>
                </div>
                <div className="flex h-20 w-full border-b border-borderDefault">
                  <div className="flex w-1/5 items-center justify-center rounded-lg bg-bgDefault">
                    유형
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <select
                      value={noticeForm.noticeCategory}
                      className="w-full rounded-lg border border-borderDefault px-2 py-3 text-sm focus:outline-inputFocus"
                      onChange={(e) => {
                        const newNoticeForm = JSON.parse(JSON.stringify(noticeForm))
                        newNoticeForm.noticeCategory = e.target.value
                        setNoticeForm(newNoticeForm)
                      }}
                    >
                      <option>일반 공지</option>
                      <option>긴급 공지</option>
                      <option>이벤트</option>
                    </select>
                  </div>
                </div>
                <div className="flex w-full border-b border-borderDefault">
                  <div className="flex w-1/5 items-center justify-center rounded-lg bg-bgDefault">
                    본문
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <TiptapEditor ref={editorRef} />
                  </div>
                </div>
                <div className="flex h-20 w-full">
                  <div className="flex w-1/5 items-center justify-center rounded-lg bg-bgDefault">
                    하이라이트
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <select
                      value={noticeForm.noticeActive ? '활성화' : '비활성화'}
                      className="w-full rounded-lg border border-borderDefault px-2 py-3 text-sm focus:outline-inputFocus"
                      onChange={(e) => {
                        const newNoticeForm = JSON.parse(JSON.stringify(noticeForm))
                        newNoticeForm.noticeActive = e.target.value === '활성화' ? true : false
                        setNoticeForm(newNoticeForm)
                      }}
                    >
                      <option>활성화</option>
                      <option>비활성화</option>
                    </select>
                  </div>
                </div>
              </div>
            </CreateNoticeModal>
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
