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
    <div className="flex flex-col items-center gap-4">
      <div className="flex h-48 w-1/2">
        <PersonalInfoDocumentForm />
      </div>
      <button
        className="flex w-1/2 items-center justify-center gap-2 rounded-lg border border-borderDefault px-4 py-2"
        disabled={personalAgree}
        onClick={() => setPersonalAgree(true)}
      >
        {personalAgree && <MdDone className="text-textSuccess" />}
        동의합니다
      </button>
      <div className="flex h-48 w-1/2 bg-white">
        <ServiceInfoDocumentForm />
      </div>
      <button
        className="flex w-1/2 items-center justify-center gap-2 rounded-lg border border-borderDefault px-4 py-2"
        disabled={serviceAgree}
        onClick={() => setServiceAgree(true)}
      >
        {serviceAgree && <MdDone className="text-textSuccess" />}
        동의합니다
      </button>
      <button
        className="flex w-1/2 items-center justify-center gap-2 rounded-lg border border-borderDefault px-4 py-2"
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
        className="w-1/2 justify-center rounded-lg border bg-bgBtnPrimary px-4 py-2 text-textBtnPrimary"
        disabled={!serviceAgree || !personalAgree}
        onClick={() => setSignupAgree(true)}
      >
        다음
      </button>
    </div>
  )
}
