'use client'
import { useState } from 'react'
import { MdDone } from 'react-icons/md'
import PersonalInfoDocumentForm from '@/components/documents/PersonalInfo'
import ServiceInfoDocumentForm from '@/components/documents/ServiceInfo'

interface PropsType {
  setSignupAgree: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SignupAgreeForm(props: PropsType) {
  const { setSignupAgree } = props
  const [personalAgree, setPersonalAgree] = useState(false)
  const [serviceAgree, setServiceAgree] = useState(false)
  return (
    <>
      <div className="flex w-1/2 h-48">
        <PersonalInfoDocumentForm />
      </div>
      <button
        className="flex w-1/2 justify-center items-center gap-2 px-4 py-2 border rounded-lg border-borderDefault"
        disabled={personalAgree}
        onClick={() => setPersonalAgree(true)}
      >
        {personalAgree && <MdDone className="text-textSuccess" />}
        동의합니다
      </button>
      <div className="flex w-1/2 h-48 bg-white">
        <ServiceInfoDocumentForm />
      </div>
      <button
        className="flex w-1/2 justify-center items-center gap-2 px-4 py-2 border rounded-lg border-borderDefault"
        disabled={serviceAgree}
        onClick={() => setServiceAgree(true)}
      >
        {serviceAgree && <MdDone className="text-textSuccess" />}
        동의합니다
      </button>
      <button
        className="flex w-1/2 justify-center items-center gap-2 px-4 py-2 border rounded-lg border-borderDefault"
        disabled={serviceAgree && personalAgree}
        onClick={() => {
          setPersonalAgree(true)
          setServiceAgree(true)
        }}
      >
        {serviceAgree && personalAgree && <MdDone className="text-textSuccess" />}
        모두 동의합니다
      </button>
      <button
        className="w-1/2 justify-center px-4 py-2 border rounded-lg bg-bgBtnPrimary text-textBtnPrimary"
        disabled={!serviceAgree || !personalAgree}
        onClick={() => setSignupAgree(true)}
      >
        다음
      </button>
    </>
  )
}
