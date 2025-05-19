'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithCredentials } from '@/serverActions/auth'
import Input from '@/components/commons/input/defaultInput'
import { useToast } from '@/components/commons/toast/ToastProvider'
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
    if (result?.error) showToast(result.error.message, 'error')
    else router.push('/home')
  }

  return (
    <div className="flex flex-col min-w-96 justify-center items-center gap-2">
      <form className="flex flex-col w-full rounded-lg gap-4" onSubmit={onClickLogin}>
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
        <button className="w-full px-4 py-2 rounded-lg bg-bgPrimary text-textPrimary">
          로그인
        </button>
      </form>
      <div className="flex w-full justify-between items-center">
        <button onClick={() => router.push('/signup')}>회원가입</button>
        <div className="flex gap-2">
          <button>아이디 찾기</button>
          <p className="w-1 h-5 border-l border-textDefault"></p>
          <button>비밀번호 찾기</button>
        </div>
      </div>
      <div className="flex w-full justify-between items-center mt-10 gap-4">
        <div className="flex flex-1 h-1 border-b" />
        <p className="w-20">간편 로그인</p>
        <div className="flex flex-1 h-1 border-b" />
      </div>
      <div className="flex w-full justify-between items-center gap-4">
        <button className="flex flex-1 px-4 py-2 rounded-lg justify-center bg-[#FEE500]">
          카카오
        </button>
      </div>
    </div>
  )
}
