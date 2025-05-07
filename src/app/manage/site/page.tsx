import { getSite } from '@/serverActions/site'
import { getMenu } from '@/serverActions/menu'
import SiteInfoAccordion from '@/components/commons/accordion/SiteInfoAccordion'
import MenuInfoAccordion from '@/components/commons/accordion/MenuInfoAccordion'
import type { menuResponse } from '@/types/menu'
import type { categoryResponse } from '@/types/category'
import { getCategory } from '@/serverActions/categories'
import CategoryInfoAccordion from '@/components/commons/accordion/CategoryInfoAccordion'

export default async function Site() {
  const API_URL = process.env.API_URL || ''
  let site: { id?: string; siteName?: string; sitesFile?: File } = {}
  let menu: menuResponse[] = []
  let category: categoryResponse[] = []
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
    site.id = siteInfo.id
  }
  const menuInfo = await getMenu()
  if (!menuInfo) errorMessage.push('메뉴 정보를 불러오지 못했습니다.')
  else menu = menuInfo

  const categoryInfo = await getCategory()
  if (!categoryInfo) errorMessage.push('카테고리 정보를 불러오지 못했습니다.')
  else category = categoryInfo

  return (
    <div className="flex flex-col w-full p-8 text-textDefault">
      <p className="text-lg font-semibold">사이트 관리</p>
      <SiteInfoAccordion siteInfo={site} />
      <MenuInfoAccordion menuInfo={menu} />
      <CategoryInfoAccordion categoryInfo={category} />
    </div>
  )
}
