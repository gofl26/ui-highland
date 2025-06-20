'use client'
import { useEffect, useState } from 'react'

import Input from '@/components/commons/input/defaultInput'
import { useToast } from '@/components/commons/toast/ToastProvider'
import { createDelivery } from '@/serverActions/deliveryAddress'
import { juso } from '@/serverActions/handler'
import type { deliveryResponse, deliveryForm } from '@/types/delivery'
import { searchAddressResponse } from '@/types/searchAddress'
import formatPhoneNumber from '@/utils/formatPhoneNumber'

import DefaultPagination from '../commons/button/DefaultPagination'
import Checkbox from '../commons/input/DefaultCheckBox'
import SearchAddressModal from '../modals/SearchAddressModal'
interface props {
  delivery: deliveryResponse[]
}
const initDeliveryForm: deliveryForm = {
  id: 'new',
  deliveryName: '',
  deliveryAddress: '',
  deliveryDetailAddress: '',
  deliveryRecipient: '',
  deliveryPhoneNumber: '',
  deliveryDefault: false,
}
export default function DeliveryForm({ delivery }: props) {
  const [deliveryForm, setDeliveryForm] = useState<deliveryForm>(initDeliveryForm)
  const [selectedDelivery, setSelectedDelivery] = useState<string>()
  const [newDelivery, setNewDelivery] = useState<deliveryResponse[]>([])
  const [openSearchAddressDialog, setOpenSearchAddressDialog] = useState(false)
  const [searchAddressKey, setSearchAddressKey] = useState('')
  const [jusoList, setJusoList] = useState<searchAddressResponse[]>([])
  const [jusoTotalCount, setJusoTotalCount] = useState(0)
  const { showToast } = useToast()

  const handleClickAddDeliveryAddress = () => {
    setSelectedDelivery(undefined)
    setDeliveryForm(initDeliveryForm)
  }
  const handleClickSaveDeliveryBtn = async () => {
    const { id, ...idRemoveForm } = deliveryForm
    const result = await createDelivery(idRemoveForm)
    if (result) {
      setNewDelivery((prev) => [...prev, result[0]])
      setSelectedDelivery(result[0].id)
      showToast('저장 성공', 'success')
    } else showToast('저장 실패', 'error')
  }
  const handleClickSearchAddress = async (from = 1, size = 10) => {
    const result = await juso({ from, size, searchAddressKey })
    if (!result) {
      showToast('주소찾기에 실패했습니다.', 'error')
      return
    }
    const transResult = result.results.juso.map(({ roadAddr, zipNo, jibunAddr }) => ({
      roadAddr,
      zipNo,
      jibunAddr,
    }))
    setJusoList(transResult)
    setJusoTotalCount(result.results.common.totalCount)
  }
  const handleChangeSearchAddressKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAddressKey(event.target.value)
  }
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleClickSearchAddress()
    }
  }
  const handleChangeDeliveryForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newForm = JSON.parse(JSON.stringify(deliveryForm))
    if (name === 'deliveryPhoneNumber') {
      newForm[name] = formatPhoneNumber(value)
    } else newForm[name] = value
    setDeliveryForm(newForm)
  }
  const handleClickJusoItem = (index: number) => {
    const roadAddr = jusoList[index].roadAddr
    const newForm = JSON.parse(JSON.stringify(deliveryForm))
    newForm.deliveryAddress = roadAddr
    setDeliveryForm(newForm)
    setOpenSearchAddressDialog(false)
  }
  const handleChageJusoPagination = (event: React.ChangeEvent<unknown>, page: number) => {
    handleClickSearchAddress(page, 10)
  }
  useEffect(() => {
    const response = delivery.find(({ id }) => selectedDelivery === id)
    if (!response) return

    setDeliveryForm({
      id: response.id,
      deliveryName: response.deliveryName,
      deliveryAddress: response.deliveryAddress,
      deliveryDetailAddress: response.deliveryDetailAddress,
      deliveryRecipient: response.deliveryRecipient,
      deliveryPhoneNumber: response.deliveryPhoneNumber,
      deliveryDefault: response.deliveryDefault,
    })
  }, [selectedDelivery, delivery])

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="w-full max-w-2xl border-b border-borderPrimary">
        <p className="text-lg font-semibold">배송지 관리</p>
      </div>
      <div className="custom-scroll mt-4 flex w-full max-w-2xl gap-4 overflow-x-auto">
        {delivery.map(({ id, deliveryName }, index) => (
          <button
            key={index}
            className={`rounded-lg border px-3 py-1 ${selectedDelivery === id ? 'bg-bgPrimary text-textPrimary' : ''}`}
            onClick={() => setSelectedDelivery(id)}
          >
            {deliveryName}
          </button>
        ))}
        {newDelivery.map(({ id, deliveryName }, index) => (
          <button
            key={index}
            className={`rounded-lg border px-3 py-1 ${selectedDelivery === id ? 'bg-bgPrimary text-textPrimary' : ''}`}
            onClick={() => setSelectedDelivery(id)}
          >
            {deliveryName}
          </button>
        ))}
        <button className="rounded-lg border px-3 py-1" onClick={handleClickAddDeliveryAddress}>
          + 배송지 추가
        </button>
      </div>
      <form className="mt-4 flex w-full max-w-2xl flex-col rounded-lg border border-borderDefault">
        <div className="flex h-20 w-full border-b border-borderDefault">
          <div className="flex w-1/4 items-center justify-center rounded-lg bg-bgDefault">
            배송지 이름
          </div>
          <div className="flex w-3/4 items-center justify-between gap-4 px-4 py-2">
            <div className="flex w-full flex-col">
              <Input
                value={deliveryForm.deliveryName}
                name="deliveryName"
                onChange={handleChangeDeliveryForm}
              />
            </div>
          </div>
        </div>
        <div className="flex h-20 w-full border-b border-borderDefault">
          <div className="flex w-1/4 items-center justify-center rounded-lg bg-bgDefault">
            받는 사람
          </div>
          <div className="flex w-3/4 flex-col justify-center gap-2 px-4 py-2">
            <Input
              value={deliveryForm.deliveryRecipient}
              name="deliveryRecipient"
              onChange={handleChangeDeliveryForm}
            />
          </div>
        </div>
        <div className="flex h-20 w-full border-b border-borderDefault">
          <div className="flex w-1/4 items-center justify-center rounded-lg bg-bgDefault">
            연락처
          </div>
          <div className="flex w-3/4 flex-col justify-center gap-2 px-4 py-2">
            <Input
              value={deliveryForm.deliveryPhoneNumber}
              name="deliveryPhoneNumber"
              onChange={handleChangeDeliveryForm}
            />
          </div>
        </div>
        <div className="flex h-40 w-full border-b border-borderDefault">
          <div className="flex w-1/4 items-center justify-center rounded-lg bg-bgDefault">주소</div>
          <div className="flex w-3/4 flex-col justify-center">
            <div className="flex items-center gap-2 px-4 py-2">
              <input
                value={deliveryForm.deliveryAddress}
                name="deliveryAddress"
                className="flex-1 rounded-lg border border-borderDefault p-2 pr-10 focus:outline-inputFocus"
                disabled
                onChange={handleChangeDeliveryForm}
              />
              <button
                className="rounded-lg border px-3 py-2"
                onClick={(e) => {
                  e.preventDefault()
                  setOpenSearchAddressDialog(true)
                }}
              >
                주소 찾기
              </button>
            </div>
            <div className="flex items-center gap-2 px-4 py-2">
              <Input
                value={deliveryForm.deliveryDetailAddress}
                name="deliveryDetailAddress"
                onChange={handleChangeDeliveryForm}
              />
            </div>
          </div>
        </div>
        <div className="flex h-20 w-full border-b border-borderDefault">
          <div className="flex w-1/4 items-center justify-center rounded-lg bg-bgDefault">
            기본 배송지로 설정
          </div>
          <div className="flex w-3/4 flex-col justify-center gap-2 px-4 py-2">
            <Checkbox
              checked={deliveryForm.deliveryDefault}
              onChange={(value) => {
                const newForm = JSON.parse(JSON.stringify(deliveryForm))
                newForm.deliveryDefault = value
                setDeliveryForm(newForm)
              }}
            />
          </div>
        </div>
      </form>
      {openSearchAddressDialog && (
        <SearchAddressModal
          isOpen={openSearchAddressDialog}
          onClose={() => setOpenSearchAddressDialog(false)}
        >
          <h2 className="mb-4 text-center text-lg font-semibold text-textDefault">
            도로명 주소 안내
          </h2>

          <div className="mb-4 flex gap-4">
            <Input
              type="text"
              value={searchAddressKey}
              onChange={handleChangeSearchAddressKey}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={() => handleClickSearchAddress()}
              className="w-20 rounded-lg bg-bgPrimary text-textPrimary"
            >
              조회
            </button>
          </div>

          {jusoList.length !== 0 && (
            <>
              <div className="grid grid-cols-12 border-b border-gray-300 py-2 text-center text-xs font-medium">
                <div className="col-span-1">No</div>
                <div className="col-span-8">도로명 주소</div>
                <div className="col-span-3">우편번호</div>
              </div>

              <div className="max-h-60 overflow-y-auto">
                {jusoList.map(({ roadAddr, zipNo, jibunAddr }, index) => (
                  <div
                    key={index}
                    className="grid cursor-pointer grid-cols-12 items-center border-b border-gray-100 py-2 text-sm hover:bg-gray-100"
                    onClick={() => handleClickJusoItem(index)}
                  >
                    <div className="col-span-1 text-center text-xs">{index + 1}</div>
                    <div className="col-span-8 text-left">
                      <div className="text-xs">{roadAddr}</div>
                      <div className="text-[10px] text-gray-500">[지번] {jibunAddr}</div>
                    </div>
                    <div className="col-span-3 text-center text-xs">{zipNo}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="mt-4 flex items-center justify-center">
            <DefaultPagination
              totalCount={jusoTotalCount}
              totalPerCount={10}
              onChange={handleChageJusoPagination}
            />
          </div>
        </SearchAddressModal>
      )}
      <div className="mt-4 flex w-full max-w-2xl items-center justify-end">
        <button
          className="rounded-lg bg-bgPrimary px-4 py-2 text-textPrimary"
          onClick={handleClickSaveDeliveryBtn}
        >
          저장
        </button>
      </div>
    </div>
  )
}
