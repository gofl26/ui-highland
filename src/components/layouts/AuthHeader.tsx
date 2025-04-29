import { auth } from '@/auth'
import { serverFetch } from '@/lib/serverFetch'
import SessionButtons from '@/components/commons/button/sessionButton'
import CommunityButtons from '@/components/commons/button/communityButton'
import ErrorToast from '@/components/commons/toast/ErrorToast'

export default async function AuthHeader() {
  const API_URL = process.env.API_URL
  const token = await auth()

  let categories = null
  let errorMessage = null

  try {
    categories = await serverFetch(`${API_URL}/api/categories/get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    errorMessage = '카테고리 정보를 불러오지 못했습니다.'
  } catch (error) {
    errorMessage = '카테고리 정보를 불러오지 못했습니다.'
    console.error('🔥 fetch error:', error)
  }
  return (
    <div className="flex justify-end gap-4 px-16 py-2 bg-[#A5948A] text-white">
      {errorMessage && <ErrorToast message={errorMessage} />}
      <SessionButtons token={token} />
      <CommunityButtons />
    </div>
  )
}
