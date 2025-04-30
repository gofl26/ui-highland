import SignupForm from '@/components/forms/SignupForm'

export default function Signup() {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center py-16 px-4 gap-4 text-textDefault">
      <span className="text-4xl font-semibold">회원가입</span>
      <SignupForm />
    </div>
  )
}
