import UserListGrid from '@/components/grid/UserListGrid'
import { getUsers } from '@/serverActions/handler'

export default async function Users() {
  const users = await getUsers()
  return (
    <div className="flex flex-col w-full p-8 text-textDefault">
      <p className="text-lg font-semibold">유저 관리</p>
      {users && <UserListGrid users={users} />}
    </div>
  )
}
