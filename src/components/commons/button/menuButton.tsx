'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useToast } from '@/components/commons/toast/ToastProvider'
import type { siteResponse } from '@/types/sites'
import type { menuResponse } from '@/types/menu'

interface Props {
  apiUrl: string
  siteInfo: siteResponse
  menuInfo?: menuResponse[]
}

export default function MenuButton(props: Props) {
  const { apiUrl, siteInfo, menuInfo } = props
  const router = useRouter()
  const { showToast } = useToast()

  const [logo, setLogo] = useState('')
  useEffect(() => {
    const splitLogoFile = siteInfo.sitesFile
    if (!splitLogoFile) return
    const image = `${apiUrl}/api/files/getFile?fileName=${splitLogoFile}`
    setLogo(image)
    if (!menuInfo) showToast('메뉴정보 불러오기 중 오류가 발생했습니다.', 'error')
  }, [apiUrl, siteInfo, menuInfo, showToast])
  return (
    <div className="flex gap-4">
      {logo && (
        <Image
          src={logo}
          alt="logo"
          width="0"
          height="0"
          className="cursor-pointer"
          style={{ width: '200px', height: 'auto' }}
          priority
          onClick={() => router.push('/home')}
        />
      )}
      {menuInfo?.map(({ menuName, menuUrl, active }, index) => (
        <button key={index} onClick={() => router.push(menuUrl)} className={active ? '' : 'hidden'}>
          {menuName}
        </button>
      ))}
    </div>
  )
}
