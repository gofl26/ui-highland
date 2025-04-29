'use client'
import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { atomUserInfo } from '@/stores/atoms'
import Input from '@/components/commons/input/defaultInput'

interface UserForm {
  email: string
  password: string
}

const initialUserForm = {
  email: '',
  password: '',
}

export default function MyInfo() {
  const user = useAtomValue(atomUserInfo)
  const [userForm, setUserForm] = useState<UserForm>(initialUserForm)
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newUserForm = JSON.parse(JSON.stringify(userForm))

    newUserForm[name] = value
    setUserForm(newUserForm)
  }
  return (
    <div className="flex flex-col w-full h-full p-8">
      {/* 페이지 네임 */}
      <p className="text-lg font-semibold text-textDefault">개인정보 수정</p>
      <div className="flex flex-col w-full h-full justify-center items-center">
        <div className="flex border-t border-b w-1/2 p-4">
          <div className="w-24">이메일</div>
          <div className="w-full">
            <input value={user.email} className="w-full" disabled />
          </div>
        </div>
        <div className="flex border-b w-1/2 p-4">
          <div className="w-24">비밀번호</div>
          <div className="w-full">
            <Input
              value={userForm.password}
              name="password"
              type="password"
              placeholder="비밀번호"
              onChange={handleChangeInput}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
