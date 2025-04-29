'use client'
import { useState } from 'react'
import SignupAgreeForm from '@/components/forms/SignupAgreeForm'
import SignupForm from '@/components/forms/SignupForm'

export default function Signup() {
  const [signupAgree, setSignupAgree] = useState(false)
  const [personalAgree, setPersonalAgree] = useState(false)
  const [serviceAgree, setServiceAgree] = useState(false)

  return (
    <div className="flex flex-col w-full h-full justify-center items-center py-16 px-4 gap-4 text-textDefault">
      <span className="text-4xl font-semibold">회원가입</span>
      {!signupAgree ? (
        <SignupAgreeForm
          personalAgree={personalAgree}
          setPersonalAgree={setPersonalAgree}
          serviceAgree={serviceAgree}
          setServiceAgree={setServiceAgree}
          setSignupAgree={setSignupAgree}
        />
      ) : (
        <SignupForm />
      )}
    </div>
  )
}
