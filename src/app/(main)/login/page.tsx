import LoginForm from '@/components/forms/LoginForm'

export default async function Login() {
  return (
    <div className="flex flex-col w-full items-center text-textDefault">
      <div className="flex justify-center items-center w-full h-48">
        <p className="text-4xl font-semibold">Login</p>
      </div>
      <LoginForm />
    </div>
  )
}
