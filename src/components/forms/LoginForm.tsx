'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import Input from '@/components/commons/input/defaultInput'
import { useToast } from '@/components/commons/toast/ToastProvider'
import { signInWithCredentials } from '@/serverActions/auth'
import { LoginForm as LoginFormType } from '@/types/login'

const initLoginForm: LoginFormType = {
  email: '',
  password: '',
}

export default function LoginForm() {
  const router = useRouter()
  const { showToast } = useToast()

  const [loginForm, setLoginForm] = useState(initLoginForm)

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newLoginForm = JSON.parse(JSON.stringify(loginForm))

    newLoginForm[name] = value
    setLoginForm(newLoginForm)
  }
  const onClickLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const result = await signInWithCredentials(formData)
    if (result?.error) return showToast(result.error.message, 'error')
    window.location.href = '/home'
  }

  return (
    <div className="flex min-w-96 flex-col items-center justify-center gap-2">
      <form className="flex w-full flex-col gap-4 rounded-lg" onSubmit={onClickLogin}>
        <Input
          value={loginForm.email}
          placeholder="이메일"
          name="email"
          onChange={handleChangeInput}
        />
        <Input
          value={loginForm.password}
          name="password"
          type="password"
          placeholder="비밀번호"
          onChange={handleChangeInput}
        />
        <button className="w-full rounded-lg bg-bgPrimary px-4 py-2 text-textPrimary">
          로그인
        </button>
      </form>
      <div className="flex w-full items-center justify-between">
        <button onClick={() => router.push('/signup')}>회원가입</button>
        <div className="flex gap-2">
          <button>아이디 찾기</button>
          <p className="h-5 w-1 border-l border-textDefault"></p>
          <button>비밀번호 찾기</button>
        </div>
      </div>
      <div className="mt-10 flex w-full items-center justify-between gap-4">
        <div className="flex h-1 flex-1 border-b" />
        <p className="w-20">간편 로그인</p>
        <div className="flex h-1 flex-1 border-b" />
      </div>
      <div className="flex w-full items-center justify-between gap-4">
        <button className="flex flex-1 justify-center rounded-lg bg-[#FEE500] px-4 py-2">
          카카오
        </button>
      </div>
    </div>
  )
}
