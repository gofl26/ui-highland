'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useToast } from '@/components/commons/toast/ToastProvider'
import { createProduct, deleteProduct, getProduct, updateProduct } from '@/serverActions/products'
import CreateProductModal from '../modals/CreateProductModal'
import Input from '@/components/commons/input/defaultInput'
import type { productResponse, productForm } from '@/types/product'
import type { categoryResponse } from '@/types/category'
import { getFile } from '@/serverActions/handler'

type Row = {
  productName: string
  productPrice: number
  productState: string
  productQuality: string
}
const columns: { key: keyof Row; label: string }[] = [
  { key: 'productName', label: '상품 명' },
  { key: 'productPrice', label: '가격' },
  { key: 'productState', label: '판매 상태' },
  { key: 'productQuality', label: '품질' },
]
const initProductForm: productForm = {
  id: '',
  productName: '',
  productPrice: 0,
  productState: '정상판매',
  productQuality: '선물용',
  productOrder: 0,
  productsFile: '',
  categoryId: '',
}
interface Props {
  category: categoryResponse[]
}

export default function ProductListGrid(props: Props) {
  const { category } = props
  const pageSize = 10
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const pathname = usePathname()
  const { showToast } = useToast()

  const [categoryId, setCategoryId] = useState('')
  const [page, setPage] = useState(1)
  const [filterColumn, setFilterColumn] = useState<
    'productName' | 'productPrice' | 'productQuality' | 'productState'
  >('productName')
  const [keyword, setKeyword] = useState('')
  const [data, setData] = useState<productResponse[]>([])
  const [totalNumber, setTotalNumber] = useState(0)
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [openCreateProductModal, setOpenCreateProductModal] = useState(false)
  const [productForm, setProductForm] = useState<productForm>(initProductForm)
  const [selectedFile, setSelectedFile] = useState<File>()
  const [preview, setPreview] = useState<string | null | undefined>()

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as keyof Row
    setFilterColumn(value)
  }
  const handleClickSearch = useCallback(async () => {
    try {
      if (!categoryId) return
      if (keyword) {
        const query = `${filterColumn}.like=${keyword}&from=0&size=10&categoryId=${categoryId}`
        const result = await getProduct(query)
        if (result) {
          const { rows, total } = result
          setData(rows)
          setTotalNumber(total)
        } else showToast('조회 실패', 'error')
      } else {
        const result = await getProduct(`from=0&size=10&categoryId=${categoryId}`)
        if (result) {
          const { rows, total } = result
          setData(rows)
          setTotalNumber(total)
        } else showToast('조회 실패', 'error')
      }
    } catch (error) {
      showToast('조회 실패', 'error')
    }
  }, [filterColumn, keyword, categoryId, showToast])
  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target
    const newProductForm = JSON.parse(JSON.stringify(productForm))
    newProductForm[name] = value
    setProductForm(newProductForm)
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
  const handleClickSaveProduct = async () => {
    try {
      const formData = new FormData()
      if (!selectedFile) return
      if (!selectedFile?.type.includes('image')) return
      formData.append('file', selectedFile)
      formData.append('productName', productForm.productName)
      formData.append('productPrice', JSON.stringify(productForm.productPrice))
      formData.append('categoryId', categoryId)
      formData.append('productState', productForm.productState)
      formData.append('productQuality', productForm.productQuality)
      formData.append('productOrder', JSON.stringify(data.length))
      const result = await createProduct(formData)
      if (!result) showToast('저장 실패', 'error')
      else {
        setOpenCreateProductModal(false)
        showToast('저장 성공', 'success')
        setData((prev) => [...prev, result[0]])
      }
    } catch (error) {
      showToast('저장 실패', 'error')
    }
  }
  const handleClickUpdateProduct = async () => {
    try {
      const formData = new FormData()
      if (!selectedFile) return
      if (!selectedFile?.type.includes('image')) return
      if (productForm.id) formData.append('id', productForm.id)
      formData.append('file', selectedFile)
      formData.append('productName', productForm.productName)
      formData.append('productPrice', JSON.stringify(productForm.productPrice))
      formData.append('categoryId', categoryId)
      formData.append('productState', productForm.productState)
      formData.append('productQuality', productForm.productQuality)
      formData.append('productOrder', JSON.stringify(data.length))
      const result = await updateProduct(formData)
      if (!result) showToast('저장 실패', 'error')
      else {
        setEditMode(false)
        showToast('저장 성공', 'success')
        setSelectedRowIndex(null)
        handleClickSearch()
      }
    } catch (error) {
      showToast('저장 실패', 'error')
    }
  }
  const handleClickDeleteProduct = async () => {
    if (selectedRowIndex === null) return
    const result = await deleteProduct(data[selectedRowIndex].id)
    if (result) {
      const newData = [...data]
      newData.splice(selectedRowIndex, 1)
      setData(newData)
      setSelectedRowIndex(null)
      setTotalNumber((p) => p - 1)
      showToast('삭제 성공', 'success')
    } else showToast('삭제 실패', 'error')
  }
  const handleClickPreBtn = async () => {
    setPage((p) => Math.max(1, p - 1))
    try {
      if (keyword) {
        const query = `${filterColumn}.like=${keyword}&from=${(page - 2) * 10}&size=10`
        const result = await getProduct(query)
        if (result) {
          const { rows, total } = result
          setData(rows)
          setTotalNumber(total)
        } else showToast('조회 실패', 'error')
      } else {
        const result = await getProduct(`from=${(page - 2) * 10}&size=10`)
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
  const handleClickNextBtn = async () => {
    setPage((p) => Math.min(Math.ceil(totalNumber / pageSize), p + 1))
    try {
      if (keyword) {
        const query = `${filterColumn}.like=${keyword}&from=${page * 10}&size=10`
        const result = await getProduct(query)
        if (result) {
          const { rows, total } = result
          setData(rows)
          setTotalNumber(total)
        } else showToast('조회 실패', 'error')
      } else {
        const result = await getProduct(`from=${page * 10}&size=10`)
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
  useEffect(() => {
    const findCategory = category.find(({ categoryUrl }) => pathname.includes(categoryUrl))
    if (findCategory) setCategoryId(findCategory.id)
  }, [pathname, category, handleClickSearch])
  useEffect(() => {
    handleClickSearch()
  }, [categoryId, handleClickSearch])
  return (
    <div className="flex w-full mt-4">
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
        <div className="flex w-full justify-between items-center mb-4">
          <p className="text-sm">총 {totalNumber} 개</p>
          <div className="flex items-center gap-2">
            {selectedRowIndex !== null && (
              <div className="flex gap-2">
                <button
                  className="bg-red-600 text-textPrimary px-3 py-2 rounded-lg"
                  onClick={handleClickDeleteProduct}
                >
                  삭제
                </button>
                <button
                  className="bg-bgHeader px-3 py-2 rounded-lg"
                  onClick={async () => {
                    const file = await getFile(data[selectedRowIndex].productsFile)
                    if (!file) return
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
                    setProductForm(data[selectedRowIndex])
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
              onSave={handleClickUpdateProduct}
            >
              <div className="flex w-full justify-center">
                <p className="font-bold text-xl">상품 수정</p>
              </div>
              <div className="flex flex-col w-full mt-4 border rounded-lg border-borderDefault">
                <div className="flex w-full h-20 border-b border-borderDefault">
                  <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
                    상품 명
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <Input
                      value={productForm?.productName}
                      name="productName"
                      onChange={handleChangeInput}
                    />
                  </div>
                </div>
                <div className="flex w-full h-20 border-b border-borderDefault">
                  <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
                    상태
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <select
                      value={productForm.productState}
                      className="w-full border border-borderDefault rounded-lg px-2 py-3 text-sm focus:outline-inputFocus"
                      onChange={(e) => {
                        const newProductForm = JSON.parse(JSON.stringify(productForm))
                        newProductForm.productState = e.target.value
                        setProductForm(newProductForm)
                      }}
                    >
                      <option>정상판매</option>
                      <option>품절</option>
                    </select>
                  </div>
                </div>
                <div className="flex w-full h-20 border-b border-borderDefault">
                  <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
                    가격
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <Input
                      value={productForm?.productPrice}
                      step="100"
                      name="productPrice"
                      type="number"
                      onChange={handleChangeInput}
                    />
                  </div>
                </div>
                <div className="flex w-full h-20 border-b border-borderDefault">
                  <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
                    품질
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <select
                      value={productForm.productQuality}
                      className="w-full border border-borderDefault rounded-lg px-2 py-3 text-sm focus:outline-inputFocus"
                      onChange={(e) => {
                        const newProductForm = JSON.parse(JSON.stringify(productForm))
                        newProductForm.productQuality = e.target.value
                        setProductForm(newProductForm)
                      }}
                    >
                      <option>선물용</option>
                      <option>가정용</option>
                    </select>
                  </div>
                </div>
                <div className="flex w-full min-h-20">
                  <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
                    이미지
                  </div>
                  <div className="flex flex-col w-4/5 justify-center px-4 py-2 gap-2">
                    <div className="flex w-full items-center gap-2">
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
                </div>
              </div>
            </CreateProductModal>
            <button
              className="bg-bgPrimary text-textPrimary px-3 py-2 rounded-lg"
              onClick={() => setOpenCreateProductModal(true)}
            >
              추가
            </button>
            <CreateProductModal
              isOpen={openCreateProductModal}
              onClose={() => setOpenCreateProductModal(false)}
              onSave={handleClickSaveProduct}
            >
              <div className="flex w-full justify-center">
                <p className="font-bold text-xl">상품 등록</p>
              </div>
              <div className="flex flex-col w-full mt-4 border rounded-lg border-borderDefault">
                <div className="flex w-full h-20 border-b border-borderDefault">
                  <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
                    상품 명
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <Input
                      value={productForm?.productName}
                      name="productName"
                      onChange={handleChangeInput}
                    />
                  </div>
                </div>
                <div className="flex w-full h-20 border-b border-borderDefault">
                  <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
                    상태
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <select
                      value={productForm.productState}
                      className="w-full border border-borderDefault rounded-lg px-2 py-3 text-sm focus:outline-inputFocus"
                      onChange={(e) => {
                        const newProductForm = JSON.parse(JSON.stringify(productForm))
                        newProductForm.productState = e.target.value
                        setProductForm(newProductForm)
                      }}
                    >
                      <option>정상판매</option>
                      <option>품절</option>
                    </select>
                  </div>
                </div>
                <div className="flex w-full h-20 border-b border-borderDefault">
                  <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
                    가격
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <Input
                      value={productForm?.productPrice}
                      step="100"
                      name="productPrice"
                      type="number"
                      onChange={handleChangeInput}
                    />
                  </div>
                </div>
                <div className="flex w-full h-20 border-b border-borderDefault">
                  <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
                    품질
                  </div>
                  <div className="flex w-4/5 items-center px-4 py-2">
                    <select
                      value={productForm.productQuality}
                      className="w-full border border-borderDefault rounded-lg px-2 py-3 text-sm focus:outline-inputFocus"
                      onChange={(e) => {
                        const newProductForm = JSON.parse(JSON.stringify(productForm))
                        newProductForm.productQuality = e.target.value
                        setProductForm(newProductForm)
                      }}
                    >
                      <option>선물용</option>
                      <option>가정용</option>
                    </select>
                  </div>
                </div>
                <div className="flex w-full min-h-20">
                  <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
                    이미지
                  </div>
                  <div className="flex flex-col w-4/5 justify-center px-4 py-2 gap-2">
                    <div className="flex w-full items-center gap-2">
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
                    setEditMode(false)
                  } else {
                    setSelectedRowIndex(idx)
                    setEditMode(false)
                  }
                }}
              >
                {columns.map(({ key }) => (
                  <td key={key} className="border px-4 py-2">
                    {row[key]}
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
