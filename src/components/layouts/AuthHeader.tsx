import type { Session } from 'next-auth'
import SessionButtons from '@/components/commons/button/sessionButton'
import CommunityButtons from '@/components/commons/button/communityButton'

interface props {
  token: Session | null
}

export default async function AuthHeader({ token }: props) {

  return (
    <div className="flex justify-end gap-4 px-8 py-2 bg-[#A5948A] text-white">
      <SessionButtons token={token} />
      <CommunityButtons />
    </div>
  )
}
