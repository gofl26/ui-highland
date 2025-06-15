'use server'
import { authFetch } from '@/lib/authFetch'
import type { searchAddressResponse } from '@/types/searchAddress'
import type { userVerify, userResponse } from '@/types/users'

const API_URL = process.env.API_URL || ''

export async function checkEmailDuplicate(email: string) {
  try {
    const result = await fetch(`${API_URL}/api/users/checkEmail?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (result.ok) return true
    else return false
  } catch (error) {
    return
  }
}

export async function getUserInfo(): Promise<userVerify | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/auth/tokenVerify`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const { user }: { user: userVerify } = await result.json()
    return user
  } catch (error) {
    return
  }
}
interface updateBody {
  password: string
}
export async function updateUserInfo(body: updateBody) {
  try {
    const result = await authFetch(`${API_URL}/api/users/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (result.ok) return true
    return false
  } catch (error) {
    return
  }
}

export async function getUsers(
  query: string = '',
): Promise<{ rows: userResponse[]; total: number } | undefined> {
  try {
    const result = await authFetch(`${API_URL}/api/users/getAll?${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const { data } = await result.json()
    return data
  } catch (error) {
    return
  }
}

interface updateUsers {
  id?: string
  userName?: string
  role?: string
  phoneNumber?: string
  gender?: string
}
export async function updateUsers(body: updateUsers) {
  try {
    const result = await authFetch(`${API_URL}/api/users/updateAll`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (result.ok) return true
    return false
  } catch (error) {
    return
  }
}

export async function deleteUser(id: string) {
  try {
    const result = await authFetch(`${API_URL}/api/users/deleteAll`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
    if (result.ok) return true
    return false
  } catch (error) {
    return
  }
}

export async function getFile(file: string) {
  try {
    const fileNameArray = file.split('/')
    const fileName = fileNameArray[fileNameArray.length - 1]
    const result = await fetch(`${API_URL}/api/files/getFile?fileName=${fileName}`)
    const blob = await result.blob()
    return new File([blob], fileName, { type: blob.type })
  } catch (error) {
    return
  }
}

export async function uploadFile(formData: FormData) {
  try {
    const result = await authFetch(`${API_URL}/api/files/upload`, {
      method: 'POST',
      body: formData,
    })
    const { url } = await result.json()
    const path = url
    const fileNameArray = path.split('/')
    const fileName = fileNameArray[fileNameArray.length - 1]
    const a = `${API_URL}/api/files/getFile?fileName=${fileName}`
    return a
  } catch (error) {
    return
  }
}
interface jusoDataType {
  from: number
  size: number
  searchAddressKey: string
}
export async function juso(
  jusoData: jusoDataType,
): Promise<{ results: { juso: searchAddressResponse[] } } | undefined> {
  try {
    const result = await fetch(
      `${API_URL}/api/juso/get?currentPage=${jusoData.from}&countPerPage=${jusoData.size}&keyword=${jusoData.searchAddressKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    const { message } = await result.json()
    return message
  } catch (error) {
    return
  }
}
