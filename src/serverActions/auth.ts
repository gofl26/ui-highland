'use server'
import { auth, signIn, signOut } from '@/auth'

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
export const signOutWithForm = async () => {
  try {
    const result = await fetch('http://localhost:3001/api/auth/logout', {
      method: 'POST',
    })
    const a = await result.json()
    await signOut()
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
