import LoginForm from '@/components/forms/LoginForm'

export default async function Login() {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center py-16 px-4 gap-4 text-textDefault">
      <span className="text-4xl font-semibold">Login</span>
      <LoginForm />
    </div>
  )
}
