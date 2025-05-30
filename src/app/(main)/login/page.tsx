import LoginForm from '@/components/forms/LoginForm'

export default async function Login() {
  return (
    <div className="flex w-full flex-col items-center text-textDefault">
      <div className="flex h-48 w-full items-center justify-center">
        <p className="text-4xl font-semibold">Login</p>
      </div>
      <LoginForm />
    </div>
  )
}
