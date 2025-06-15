'use client'
import { useState } from 'react'

import Input from '@/components/commons/input/defaultInput'
import { useToast } from '@/components/commons/toast/ToastProvider'
import { updateUserInfo } from '@/serverActions/handler'
import type { SignupForm } from '@/types/signup/index'
import type { userVerify } from '@/types/users'

interface Props {
  userInfo: userVerify
}

export default function UserInfoForm(props: Props) {
  const { userInfo } = props
  const initSignupForm: SignupForm = {
    email: userInfo.email!!,
    password: '',
    userName: '',
    phoneNumber: '',
    receiveEvent: false,
    address: '',
    addressDetail: '',
    gender: '',
  }
  const passwordRegex = /^(?!.*(.)\1{2})(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{10,16}$/
  const { showToast } = useToast()

  const [signupForm, setSignupForm] = useState<SignupForm>(initSignupForm)
  const [availablePassword, setAvailablePassword] = useState<boolean>()

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newSignupForm = JSON.parse(JSON.stringify(signupForm))
    if (name === 'password') {
      const passwordType = passwordRegex.test(value)
      if (passwordType) setAvailablePassword(true)
      else setAvailablePassword(false)
    }
    newSignupForm[name] = value
    setSignupForm(newSignupForm)
  }
  const handleClickSaveBtn = async () => {
    try {
      const body = {
        password: signupForm.password,
      }
      const result = await updateUserInfo(body)
      if (result) showToast('수정 성공', 'success')
      else showToast('수정 실패', 'error')
    } catch (error) {
      showToast('수정 실패', 'error')
    }
  }
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="w-full max-w-2xl border-b border-borderPrimary">
        <p>비밀번호 변경</p>
      </div>
      <form className="mt-4 flex w-full max-w-2xl flex-col rounded-lg border border-borderDefault">
        <div className="flex h-20 w-full border-b border-borderDefault">
          <div className="flex w-1/5 items-center justify-center rounded-lg bg-bgDefault">
            이메일
          </div>
          <div className="flex w-4/5 items-center justify-between gap-4 px-4 py-2">
            <div className="flex w-full flex-col">
              <Input value={signupForm.email} name="email" disabled />
            </div>
          </div>
        </div>
        <div className="flex h-20 w-full">
          <div className="flex w-1/5 items-center justify-center rounded-lg bg-bgDefault">
            비밀번호<p className="text-textFail">*</p>
          </div>
          <div className="flex w-4/5 flex-col justify-center gap-2 px-4 py-2">
            <Input
              value={signupForm.password}
              type="password"
              name="password"
              onChange={handleChangeInput}
            />
            {availablePassword === false && (
              <p className="text-xs text-textFail">
                10~16자, 소문자·숫자·특수문자(!@#$%^&*) 포함, 동일 문자 3회 연속 불가
              </p>
            )}
          </div>
        </div>
      </form>
      <div className="mt-4 flex w-full max-w-2xl items-center justify-end">
        <button
          className="rounded-lg bg-bgPrimary px-4 py-2 text-textPrimary"
          onClick={handleClickSaveBtn}
        >
          저장
        </button>
      </div>
    </div>
  )
}
