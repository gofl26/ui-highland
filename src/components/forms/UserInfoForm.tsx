'use client'
import { useState } from 'react'
import Input from '@/components/commons/input/defaultInput'
import { updateUserInfo } from '@/serverActions/handler'
import type { userVerify } from '@/types/users'
import type { SignupForm } from '@/types/signup/index'
import { useToast } from '@/components/commons/toast/ToastProvider'

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
    <div className="flex flex-col w-full justify-center items-center">
      <form className="flex flex-col w-full max-w-2xl border rounded-lg border-borderDefault">
        <div className="flex w-full h-20 border-b border-borderDefault">
          <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
            이메일
          </div>
          <div className="flex w-4/5 justify-between items-center px-4 py-2 gap-4">
            <div className="flex flex-col w-full">
              <Input value={signupForm.email} name="email" disabled />
            </div>
          </div>
        </div>
        <div className="flex w-full h-20">
          <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
            비밀번호<p className="text-textFail">*</p>
          </div>
          <div className="flex flex-col w-4/5 justify-center px-4 py-2 gap-2">
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
      <div className="flex w-full max-w-2xl justify-end items-center mt-4">
        <button
          className="bg-bgPrimary text-textPrimary px-4 py-2 rounded-lg"
          onClick={handleClickSaveBtn}
        >
          저장
        </button>
      </div>
    </div>
  )
}
