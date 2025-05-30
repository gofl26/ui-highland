import type { Session } from 'next-auth'

import CommunityButtons from '@/components/commons/button/communityButton'
import SessionButtons from '@/components/commons/button/sessionButton'

interface props {
  token: Session | null
}

export default async function AuthHeader({ token }: props) {
  return (
    <div className="flex justify-end gap-4 bg-[#A5948A] px-8 py-2 text-white">
      <SessionButtons token={token} />
      <CommunityButtons />
    </div>
  )
}
