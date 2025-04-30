import { getSite } from '@/serverActions/handler'
import SiteInfoAccordion from '@/components/commons/accordion/SiteInfoAccordion'
import type { siteResponse } from '@/types/sites'

export default async function Site() {
  const API_URL = process.env.API_URL || ''
  let site: { id?: string; siteName?: string; sitesFile?: File; preview?: string } = {}
  let errorMessage = []
  const siteInfo = await getSite()
  if (!siteInfo) {
    errorMessage.push('사이트 정보를 불러오지 못했습니다.')
  } else {
    const path = siteInfo.sitesFile
    const fileNameArray = path.split('/')
    const fileName = fileNameArray[fileNameArray.length - 1]
    const result = await fetch(`${API_URL}/api/files/getFile?fileName=${fileName}`)
    const blob = await result.blob()
    const file = new File([blob], fileName, { type: blob.type })
    site.siteName = siteInfo.siteName
    site.sitesFile = file
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        site.preview = reader.result
      }
    }
  }
  const menu

  return (
    <div className="flex flex-col w-full p-8 text-textDefault">
      <p className="text-lg font-semibold">사이트 관리</p>
      <SiteInfoAccordion siteInfo={site} />
      <MenuInfoAccordion />
    </div>
  )
}
