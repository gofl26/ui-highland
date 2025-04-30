'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithCredentials } from '@/serverActions/auth'
import { checkEmailDuplicate } from '@/serverActions/handler'
import SignupAgreeForm from '@/components/forms/SignupAgreeForm'
import Input from '@/components/commons/input/defaultInput'
import formatPhoneNumber from '@/utils/formatPhoneNumber'
import type { SignupForm } from '@/types/signup/index'
import ErrorToast from '../commons/toast/ErrorToast'

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

  const [signupAgree, setSignupAgree] = useState(false) //개인정보 활용 동의 여부
  const [emailError, setEamilError] = useState<boolean>()
  const [availableEmail, setAvailableEmial] = useState<boolean>()
  const [availablePassword, setAvailablePassword] = useState<boolean>()
  const [signupForm, setSignupForm] = useState<SignupForm>(initSignupForm)
  const [message, setMessage] = useState<string[]>([])

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newSignupForm = JSON.parse(JSON.stringify(signupForm))
    if (name === 'email') {
      const emailType = emailRegex.test(value)
      if (emailType) setEamilError(true)
      else setEamilError(false)
    }
    if (name === 'password') {
      const passwordType = passwordRegex.test(value)
      if (passwordType) setAvailablePassword(true)
      else setAvailablePassword(false)
    }
    if (name === 'phoneNumber') {
      newSignupForm[name] = formatPhoneNumber(value)
      setSignupForm(newSignupForm)
      return
    }
    newSignupForm[name] = value
    setSignupForm(newSignupForm)
  }
  const handleClickDuplicate = async () => {
    if (!emailError) {
      return
    }
    const result = await checkEmailDuplicate(signupForm.email)
    if (result) setAvailableEmial(true)
    else setAvailableEmial(false)
  }
  const handleClickGender = (gender: string) => {
    const newSignupForm = JSON.parse(JSON.stringify(signupForm))
    newSignupForm.gender = gender
    setSignupForm(newSignupForm)
  }
  const handleClickSignup = async () => {
    const warningMessage: string[] = []
    if (!emailError || !availableEmail) {
      warningMessage.push('이메일을 확인해주세요.')
      setMessage(warningMessage)
      return
    }
    if (!availablePassword) {
      warningMessage.push('비밀번호가 형식이 맞지않습니다.')
      setMessage(warningMessage)
      return
    }
    if (!signupForm.userName) {
      warningMessage.push('이름을 입력해주세요.')
      setMessage(warningMessage)
      return
    }
    try {
      const formData = new FormData()
      Object.entries(signupForm).forEach(([key, value]) => {
        formData.append(key, value.toString())
      })
      const result = await signInWithCredentials(formData)
      if (result?.error) {
        warningMessage.push('회원가입 실패')
        setMessage(warningMessage)
      }
      router.push('/home')
    } catch (error: any) {
      warningMessage.push(error.message)
      setMessage(warningMessage)
    }
  }
  return (
    <>
      {!signupAgree ? (
        <SignupAgreeForm setSignupAgree={setSignupAgree} />
      ) : (
        <div className="flex flex-col w-full justify-center items-center gap-4">
          <form className="flex flex-col w-1/2 border rounded-lg border-borderDefault">
            <div className="flex w-full h-20 border-b border-borderDefault">
              <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
                이메일
                <p className="text-textFail">*</p>
              </div>
              <div className="flex w-4/5 justify-between items-center px-4 py-2 gap-4">
                <div className="flex flex-col w-full">
                  <Input value={signupForm.email} name="email" onChange={handleChangeInput} />
                  {emailError === false && (
                    <p className="text-xs mt-2 text-textFail">이메일 형식이 아닙니다.</p>
                  )}
                  {availableEmail === true ? (
                    <p className="text-xs mt-2 text-textSuccess">사용가능한 이메일입니다.</p>
                  ) : availableEmail === false ? (
                    <p className="text-xs mt-2 text-textFail">사용불가능한 이메일입니다.</p>
                  ) : (
                    <></>
                  )}
                </div>
                <button
                  className="w-40 h-10 rounded-lg bg-bgPrimary text-textPrimary"
                  type="button"
                  onClick={handleClickDuplicate}
                >
                  중복확인
                </button>
              </div>
            </div>
            <div className="flex w-full h-20 border-b border-borderDefault">
              <div className="flex w-1/5 justify-center items-center bg-bgDefault">
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
            <div className="flex w-full h-20 border-b border-borderDefault">
              <div className="flex w-1/5 justify-center items-center bg-bgDefault">
                이름<p className="text-textFail">*</p>
              </div>
              <div className="flex w-4/5 justify-center items-center px-4 py-2">
                <Input value={signupForm.userName} name="userName" onChange={handleChangeInput} />
              </div>
            </div>
            <div className="flex w-full h-20 border-b border-borderDefault">
              <div className="flex w-1/5 justify-center items-center bg-bgDefault">전화번호</div>
              <div className="flex w-4/5 justify-center items-center px-4 py-2">
                <Input
                  value={signupForm.phoneNumber}
                  name="phoneNumber"
                  onChange={handleChangeInput}
                />
              </div>
            </div>
            <div className="flex w-full h-20">
              <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
                성별
              </div>
              <div className="flex w-4/5 items-center px-4 py-2 gap-4">
                <button
                  className={`w-20 px-4 py-2 border border-borderDefault rounded-full ${signupForm.gender === 'male' && 'bg-bgPrimary text-textPrimary'}`}
                  type="button"
                  onClick={() => handleClickGender('male')}
                >
                  남자
                </button>
                <button
                  className={`w-20 px-4 py-2 border border-borderDefault rounded-full ${signupForm.gender === 'female' && 'bg-bgPrimary text-textPrimary'}`}
                  type="button"
                  onClick={() => handleClickGender('female')}
                >
                  여자
                </button>
              </div>
            </div>
          </form>
          <div className="flex justify-center items-center gap-4">
            <button
              className="w-40 px-4 py-2 border rounded-lg border-borderDefault"
              onClick={() => router.push('/home')}
            >
              취소
            </button>
            <button
              className="w-40 px-4 py-2 rounded-lg bg-bgPrimary text-textPrimary"
              onClick={handleClickSignup}
            >
              가입
            </button>
          </div>
          {message.length !== 0 && <ErrorToast message={message} />}
        </div>
      )}
    </>
  )
}
