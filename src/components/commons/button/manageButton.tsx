'use client'
import { MdOutlineLocalMall, MdOutlinePerson } from 'react-icons/md'
import { useAtomValue } from 'jotai'
import { useRouter } from 'next/navigation'
import { atomUserInfo } from '@/stores/atoms'
export default function ManageButton() {
  const userInfo = useAtomValue(atomUserInfo)
  const router = useRouter()
  const handleClickManage = () => {
    if (userInfo.role === 'admin') router.push('/manage/site')
    else router.push('/')
  }
  return (
    <>
      <button onClick={handleClickManage}>
        <MdOutlinePerson size="24" />
      </button>
      <button>
        <MdOutlineLocalMall size="24" />
      </button>
    </>
  )
}
