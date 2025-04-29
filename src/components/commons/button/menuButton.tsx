'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAtomValue } from 'jotai'
import { atomMenuInfo, atomSiteInfo } from '@/stores/atoms'

export default function MenuButton() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  const menuInfo = useAtomValue(atomMenuInfo)
  const siteInfo = useAtomValue(atomSiteInfo)

  const [logo, setLogo] = useState('')
  useEffect(() => {
    const splitLogoFile = siteInfo.sitesFile.split('/')
    if (splitLogoFile.length !== 2) return
    const image = `${API_URL}/api/files/getFile?fileName=${splitLogoFile[1]}`
    setLogo(image)
  }, [siteInfo, API_URL])
  return (
    <div className="flex gap-4">
      {logo && (
        <Image
          src={logo}
          alt="logo"
          width="200"
          height="50"
          className="cursor-pointer"
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
