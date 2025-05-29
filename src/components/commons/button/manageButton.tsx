'use client'
import { useEffect } from 'react'
import { MdOutlineLocalMall, MdOutlinePerson } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import { useSetAtom } from 'jotai'
import { atomUserInfo } from '@/stores/atoms'
import type { userVerify } from '@/types/users'

interface Props {
  userInfo: userVerify | undefined
}
export default function ManageButton({ userInfo }: Props) {
  const router = useRouter()
  const setUser = useSetAtom(atomUserInfo)

  const handleClickManage = () => {
    if (!userInfo) router.push('/login')
    else if (userInfo.role === 'admin') router.push('/manage/orders')
    else if (userInfo.role === 'customer') router.push('/user/myInfo')
  }
  const handleClickCart = () => {
    if (!userInfo) router.push('/login')
    else if (userInfo.role === 'customer') router.push('/user/shopping/cart')
  }
  useEffect(() => {
    if (userInfo) setUser(userInfo)
  }, [userInfo, setUser])
  return (
    <>
      <button onClick={handleClickManage}>
        <MdOutlinePerson size="24" />
      </button>
      {userInfo?.role !== 'admin' && (
        <button onClick={handleClickCart}>
          <MdOutlineLocalMall size="24" />
        </button>
      )}
    </>
  )
}
