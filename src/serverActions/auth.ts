'use server'
import { auth, signIn, signOut } from '@/auth'

const API_URL = process.env.API_URL || ''

export const signInWithCredentials = async (formData: FormData) => {
  try {
    await signIn('credentials', {
      email: formData.get('email') || '',
      password: formData.get('password') || '',
      userName: formData.get('userName') || '',
      phoneNumber: formData.get('phoneNumber') || '',
      gender: formData.get('gender') || '',
      redirect: false,
    })
    return { message: 'success' }
  } catch (error: any) {
    if (error.type === 'AuthError') {
      return {
        error: { message: error.message },
      }
    }
    return { error: { message: 'Failed to login', error: error } }
  }
}
interface logoutBodyForm {
  sessionId: string
}
export const signOutWithForm = async (body: logoutBodyForm) => {
  try {
    const result = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    console.info(result.ok)
    if (result.ok) {
      await signOut()
      return true
    }
  } catch (error: any) {
    if (error.type === 'AuthError') {
      return {
        error: { message: error.message },
      }
    }
    return { error: { message: 'Failed to logout', error: error } }
  }
}
export { auth as getSession }
