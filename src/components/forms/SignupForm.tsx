'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import Input from '@/components/commons/input/defaultInput'
import { useToast } from '@/components/commons/toast/ToastProvider'
import SignupAgreeForm from '@/components/forms/SignupAgreeForm'
import { signInWithCredentials } from '@/serverActions/auth'
import { checkEmailDuplicate } from '@/serverActions/handler'
import type { SignupForm } from '@/types/signup/index'
import formatPhoneNumber from '@/utils/formatPhoneNumber'

const initSignupForm: SignupForm = {
  email: '',
  password: '',
  userName: '',
  phoneNumber: '',
  receiveEvent: false,
  address: '',
  addressDetail: '',
  gender: '',
}

export default function SignupForm() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex = /^(?!.*(.)\1{2})(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{10,16}$/
  const router = useRouter()
  const { showToast } = useToast()

  const [signupAgree, setSignupAgree] = useState(false) //개인정보 활용 동의 여부
  const [validEmail, setValidEmail] = useState<boolean>()
  const [availableEmail, setAvailableEmial] = useState<boolean>()
  const [availablePassword, setAvailablePassword] = useState<boolean>()
  const [availableUserName, setAvailableUserName] = useState<boolean>()
  const [signupForm, setSignupForm] = useState<SignupForm>(initSignupForm)

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newSignupForm = JSON.parse(JSON.stringify(signupForm))
    if (name === 'password') setAvailablePassword(undefined)
    if (name === 'phoneNumber') {
      newSignupForm[name] = formatPhoneNumber(value)
      setSignupForm(newSignupForm)
      return
    }
    if (name === 'email') setAvailableEmial(undefined)
    newSignupForm[name] = value
    setSignupForm(newSignupForm)
  }
  const handleClickDuplicate = async () => {
    if (!validEmail) return
    const result = await checkEmailDuplicate(signupForm.email)
    if (result) {
      showToast('사용가능한 이메일입니다.', 'success')
      setAvailableEmial(true)
    } else {
      showToast('사용중인 이메일입니다.', 'error')
      setAvailableEmial(false)
    }
  }
  const handleBlurEmailInput = () => {
    const value = signupForm.email
    const emailType = emailRegex.test(value)
    if (emailType) setValidEmail(true)
    else {
      setValidEmail(false)
      showToast('이메일 형식이 아닙니다.', 'error')
    }
  }
  const handleBlurPWInput = () => {
    const value = signupForm.password
    const passwordType = passwordRegex.test(value)
    if (passwordType) setAvailablePassword(true)
    else setAvailablePassword(false)
  }
  const handleBlurNameInput = () => {
    const value = signupForm.userName
    setAvailableUserName(value ? true : false)
  }
  const handleClickGender = (gender: string) => {
    const newSignupForm = JSON.parse(JSON.stringify(signupForm))
    newSignupForm.gender = gender
    setSignupForm(newSignupForm)
  }
  const handleClickSignup = async () => {
    if (!validEmail || !availableEmail) {
      showToast('이메일을 확인해주세요.', 'error')
      return
    }
    if (!availablePassword) {
      showToast('비밀번호가 형식이 맞지않습니다.', 'error')
      return
    }
    if (!availableUserName) {
      showToast('이름을 입력해주세요.', 'error')
      return
    }
    try {
      const formData = new FormData()
      Object.entries(signupForm).forEach(([key, value]) => {
        formData.append(key, value.toString())
      })
      const result = await signInWithCredentials(formData)
      if (result?.error) {
        return showToast('회원가입 실패', 'error')
      }
      window.location.href = '/home'
    } catch (error: any) {
      showToast(error.message, 'error')
    }
  }
  return (
    <>
      {!signupAgree ? (
        <SignupAgreeForm setSignupAgree={setSignupAgree} />
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <form className="flex w-1/2 flex-col">
            <div
              className={`flex h-20 w-full rounded-t-lg border ${validEmail === false ? 'border-textFail' : '-mb-px border-borderDefault'}`}
            >
              <div className="flex w-1/5 items-center justify-center rounded-lg bg-bgDefault">
                이메일
                <p className="text-textFail">*</p>
              </div>
              <div className="flex w-4/5 items-center justify-between gap-4 px-4 py-2">
                <div className="flex flex-1 flex-col">
                  <Input
                    value={signupForm.email}
                    name="email"
                    onChange={handleChangeInput}
                    onBlur={handleBlurEmailInput}
                  />
                </div>
                <button
                  className="h-10 w-20 rounded-lg bg-bgPrimary text-textPrimary"
                  type="button"
                  onClick={handleClickDuplicate}
                >
                  중복확인
                </button>
              </div>
            </div>
            <div
              className={`flex h-20 w-full border ${validEmail === false ? 'border-t-0' : ''} ${availablePassword === false ? 'border-textFail' : '-mb-px border-borderDefault'}`}
            >
              <div className="flex w-1/5 items-center justify-center bg-bgDefault">
                비밀번호<p className="text-textFail">*</p>
              </div>
              <div className="flex w-4/5 flex-col justify-center gap-2 px-4 py-2">
                <Input
                  value={signupForm.password}
                  type="password"
                  name="password"
                  onChange={handleChangeInput}
                  onBlur={handleBlurPWInput}
                />
                <p className="text-xs">
                  10~16자, 소문자·숫자·특수문자(!@#$%^&*) 포함, 동일 문자 3회 연속 불가
                </p>
              </div>
            </div>
            <div
              className={`flex h-20 w-full rounded-b-lg border ${availablePassword === false ? 'border-t-0' : ''} ${availableUserName === false ? 'border-textFail' : 'border-borderDefault'}`}
            >
              <div className="flex w-1/5 items-center justify-center rounded-lg bg-bgDefault">
                이름<p className="text-textFail">*</p>
              </div>
              <div className="flex w-4/5 items-center justify-center px-4 py-2">
                <Input
                  value={signupForm.userName}
                  name="userName"
                  onChange={handleChangeInput}
                  onBlur={handleBlurNameInput}
                />
              </div>
            </div>
          </form>
          <form className="flex w-1/2 flex-col divide-y divide-borderDefault rounded-lg border border-borderDefault">
            <div className="flex h-20 w-full">
              <div className="flex w-1/5 items-center justify-center rounded-ss-lg bg-bgDefault">
                전화번호
              </div>
              <div className="flex w-4/5 items-center justify-center px-4 py-2">
                <Input
                  value={signupForm.phoneNumber}
                  name="phoneNumber"
                  onChange={handleChangeInput}
                />
              </div>
            </div>
            <div className="flex h-20 w-full">
              <div className="flex w-1/5 items-center justify-center rounded-lg bg-bgDefault">
                성별
              </div>
              <div className="flex w-4/5 items-center gap-4 px-4 py-2">
                <button
                  className={`w-20 rounded-full border border-borderDefault px-4 py-2 ${signupForm.gender === 'male' && 'bg-bgPrimary text-textPrimary'}`}
                  type="button"
                  onClick={() => handleClickGender('male')}
                >
                  남자
                </button>
                <button
                  className={`w-20 rounded-full border border-borderDefault px-4 py-2 ${signupForm.gender === 'female' && 'bg-bgPrimary text-textPrimary'}`}
                  type="button"
                  onClick={() => handleClickGender('female')}
                >
                  여자
                </button>
              </div>
            </div>
          </form>
          <div className="flex items-center justify-center gap-4">
            <button
              className="w-40 rounded-lg border border-borderDefault px-4 py-2"
              onClick={() => router.push('/home')}
            >
              취소
            </button>
            <button
              className="w-40 rounded-lg bg-bgPrimary px-4 py-2 text-textPrimary"
              onClick={handleClickSignup}
            >
              가입
            </button>
          </div>
        </div>
      )}
    </>
  )
}
