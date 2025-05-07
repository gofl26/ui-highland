'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { siteResponse } from '@/types/sites'
import type { menuResponse } from '@/types/menu'

interface Props {
  apiUrl: string
  siteInfo: siteResponse
  menuInfo: menuResponse[]
}

export default function MenuButton(props: Props) {
  const { apiUrl, siteInfo, menuInfo } = props
  const router = useRouter()

  const [logo, setLogo] = useState('')
  useEffect(() => {
    const splitLogoFile = siteInfo.sitesFile.split('/')
    if (splitLogoFile.length !== 2) return
    const image = `${apiUrl}/api/files/getFile?fileName=${splitLogoFile[1]}`
    setLogo(image)
  }, [apiUrl, siteInfo])
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
      {menuInfo.map(({ menuName, menuUrl, active }, index) => (
        <button key={index} onClick={() => router.push(menuUrl)} className={active ? '' : 'hidden'}>
          {menuName}
        </button>
      ))}
    </div>
  )
}
