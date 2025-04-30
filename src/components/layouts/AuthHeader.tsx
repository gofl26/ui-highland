import { auth } from '@/auth'
import SessionButtons from '@/components/commons/button/sessionButton'
import CommunityButtons from '@/components/commons/button/communityButton'

export default async function AuthHeader() {
  const token = await auth()

  return (
    <div className="flex justify-end gap-4 px-16 py-2 bg-[#A5948A] text-white">
      <SessionButtons token={token} />
      <CommunityButtons />
    </div>
  )
}
