'use client'
import { ChevronDown, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'

import { useToast } from '@/components/commons/toast/ToastProvider'
import { updateSite, createSite } from '@/serverActions/site'

interface Props {
  siteInfo: { id?: string; siteName?: string; sitesFile?: File }
}

export default function SiteInfoAccordion(props: Props) {
  const { siteInfo } = props
  const [logoOpen, setLogoOpen] = useState(false)
  const [siteName, setSiteName] = useState<string>(siteInfo?.siteName || '')
  const [selectedFile, setSelectedFile] = useState<File | undefined>(siteInfo?.sitesFile)
  const [preview, setPreview] = useState<string | null | undefined>()

  const { showToast } = useToast()

  const fileInputRef = useRef<HTMLInputElement | null>(null)
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
    try {
      const formData = new FormData()
      if (!selectedFile) return
      if (!selectedFile?.type.includes('image')) return
      formData.append('file', selectedFile)
      formData.append('siteName', JSON.stringify(siteName))
      if (siteInfo.id) {
        formData.append('id', siteInfo.id)
        const result = await updateSite(formData)
        if (!result) showToast('저장 실패', 'error')
        else showToast('수정 성공', 'success')
      } else {
        const result = await createSite(formData)
        if (!result) showToast('저장 실패', 'error')
        else showToast('생성 성공', 'success')
      }
    } catch (error) {
      showToast('저장 실패', 'error')
    }
  }
  useEffect(() => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPreview(reader.result) // 문자열만 상태에 저장
        }
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }, [selectedFile])
  return (
    <>
      <div
        className="mt-8 flex w-full cursor-pointer items-center justify-between rounded-t-lg bg-bgHeader px-4 py-2"
        onClick={() => setLogoOpen((prev) => !prev)}
      >
        <p>사이트 정보</p>
        {logoOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
      </div>
      {!logoOpen && (
        <div className="flex w-full flex-col gap-4 border p-4">
          <div className="flex w-full items-center gap-4">
            <p className="text-xs">사이트 이름</p>
            <input
              value={siteName}
              className="rounded-lg border border-borderDefault px-4 py-2 focus:outline-none"
              onChange={(e) => setSiteName(e.target.value)}
            />
          </div>
          <div className="flex w-full justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
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
                <div className="text-right text-xs text-gray-700">
                  <div className="font-semibold">{selectedFile.name}</div>
                  <div>{(selectedFile.size / 1024).toFixed(1)} KB</div>
                </div>
              )}
            </div>
            <button
              className="rounded-lg bg-bgPrimary px-4 py-2 text-textPrimary"
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
                width="0" // 이미지의 너비 설정
                height="0" // 이미지의 높이 설정
                style={{ width: '100px', height: 'auto', objectFit: 'contain' }}
              />
            </>
          )}
        </div>
      )}
    </>
  )
}
