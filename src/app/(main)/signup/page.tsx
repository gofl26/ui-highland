import SignupForm from '@/components/forms/SignupForm'

export default function Signup() {
  return (
    <div className="flex flex-col w-full items-center py-8 text-textDefault">
      <div className="flex justify-center items-center w-full h-48">
        <p className="text-4xl font-semibold">회원가입</p>
      </div>
      <SignupForm />
    </div>
  )
}
