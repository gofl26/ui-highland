'use server'
import { auth, signIn, signOut } from '@/auth'

export const signInWithCredentials = async (formData: FormData) => {
  try {
    await signIn('credentials', {
      userName: formData.get('userName') || '',
      password: formData.get('password') || '',
      displayName: formData.get('displayName') || '',
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
export const signOutWithForm = async (formData: FormData) => {
  await signOut()
}
export { auth as getSession }
