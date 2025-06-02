import SignupForm from '@/components/forms/SignupForm'

export default function Signup() {
  return (
    <div className="flex w-full flex-col items-center py-8 text-textDefault">
      <div className="flex h-48 w-full items-center justify-center">
        <p className="text-4xl font-semibold">회원가입</p>
      </div>
      <SignupForm />
    </div>
  )
}
