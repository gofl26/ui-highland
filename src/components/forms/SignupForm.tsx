'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from 'next-auth/react'
import Input from '@/components/commons/input/defaultInput'
import { signInWithCredentials } from '@/serverActions/auth'
import formatPhoneNumber from '@/utils/formatPhoneNumber'
import type { SignupForm } from '@/types/signup/index'

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
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex = /^(?!.*(.)\1{2})(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{10,16}$/
  const router = useRouter()

  const [emailError, setEamilError] = useState<boolean>()
  const [availableEmail, setAvailableEmial] = useState<boolean>()
  const [availablePassword, setAvailablePassword] = useState<boolean>()
  const [signupForm, setSignupForm] = useState<SignupForm>(initSignupForm)

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
    try {
      const result = await fetch(`${API_URL}/api/users/checkEmail?email=${signupForm.email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (result.ok) setAvailableEmial(true)
      else setAvailableEmial(false)
    } catch (error) {
      console.info(error)
    }
  }
  const handleClickGender = (gender: string) => {
    const newSignupForm = JSON.parse(JSON.stringify(signupForm))
    newSignupForm.gender = gender
    setSignupForm(newSignupForm)
  }
  const handleClickSignup = async () => {
    if (!emailError || !availableEmail) {
      alert('이메일을 확인해주세요.')
      return
    }
    if (!availablePassword) {
      alert('비밀번호가 형식이 맞지않습니다.')
      return
    }
    if (!signupForm.userName) {
      alert('이름을 입력해주세요.')
      return
    }
    try {
      const formData = new FormData()
      Object.entries(signupForm).forEach(([key, value]) => {
        formData.append(key, value.toString())
      })
      const result = await signInWithCredentials(formData)
      if (result?.error) throw new Error(result.error.message)
      getSession() //세션정보를 한번 가져와서 갱신
      router.push('/home')
    } catch (error) {
      alert(error)
    }
  }
  return (
    <div className="flex flex-col w-full justify-center items-center gap-4">
      <form className="flex flex-col w-1/2 border rounded-lg border-borderDefault">
        <div className="flex w-full h-20 border-b border-borderDefault">
          <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">
            이메일
            <p className="text-textFail">*</p>
          </div>
          <div className="flex flex-col w-4/5 justify-center  px-4 py-2 gap-1">
            <div className="flex w-full gap-4">
              <Input value={signupForm.email} name="email" onChange={handleChangeInput} />
              <button
                className="w-40 h-10 rounded-lg bg-bgDefault"
                type="button"
                onClick={handleClickDuplicate}
              >
                중복확인
              </button>
            </div>
            {emailError === false && (
              <p className="text-xs text-textFail">이메일 형식이 아닙니다.</p>
            )}
            {availableEmail === true ? (
              <p className="text-xs text-textSuccess">사용가능한 이메일입니다.</p>
            ) : availableEmail === false ? (
              <p className="text-xs text-textFail">사용불가능한 이메일입니다.</p>
            ) : (
              <></>
            )}
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
            <Input value={signupForm.phoneNumber} name="phoneNumber" onChange={handleChangeInput} />
          </div>
        </div>
        <div className="flex w-full h-20">
          <div className="flex w-1/5 justify-center items-center rounded-lg bg-bgDefault">성별</div>
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
    </div>
  )
}
