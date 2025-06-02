import CategoryInfoAccordion from '@/components/commons/accordion/CategoryInfoAccordion'
import MenuInfoAccordion from '@/components/commons/accordion/MenuInfoAccordion'
import SiteInfoAccordion from '@/components/commons/accordion/SiteInfoAccordion'
import { getCategory } from '@/serverActions/categories'
import { getMenu } from '@/serverActions/menu'
import { getSite } from '@/serverActions/site'
import type { categoryResponse } from '@/types/category'
import type { menuResponse } from '@/types/menu'

export default async function Site() {
  const API_URL = process.env.API_URL || ''
  let site: { id?: string; siteName?: string; sitesFile?: File } = {}
  let menu: menuResponse[] | undefined = undefined
  let category: categoryResponse[] | undefined = undefined
  const siteInfo = await getSite()
  if (siteInfo === undefined) {
    return null
  } else if (siteInfo.length > 0) {
    const path = siteInfo[0].sitesFile
    const fileNameArray = path.split('/')
    const fileName = fileNameArray[fileNameArray.length - 1]
    const result = await fetch(`${API_URL}/api/files/getFile?fileName=${fileName}`)
    const blob = await result.blob()
    const file = new File([blob], fileName, { type: blob.type })
    site.siteName = siteInfo[0].siteName
    site.sitesFile = file
    site.id = siteInfo[0].id
  }
  menu = await getMenu()
  category = await getCategory()

  return (
    <div className="flex w-full flex-col p-8 text-textDefault">
      <p className="text-lg font-semibold">사이트 관리</p>
      <SiteInfoAccordion siteInfo={site} />
      {menu && <MenuInfoAccordion menuInfo={menu} />}
      {category && <CategoryInfoAccordion categoryInfo={category} />}
    </div>
  )
}
