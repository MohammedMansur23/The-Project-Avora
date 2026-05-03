import { signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user }
  } catch (error) {
    if (error.code === 'auth/popup-blocked') {
      // Fall back to redirect if popup is blocked
      await signInWithRedirect(auth, googleProvider);
      return { success: true, user: null }
    }
    return { success: false, error: error.message }
  }
}

export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      return { success: true, user: result.user }
    }
    return { success: false }
  } catch (error) {
    return { success: false, error: error.message }
  }
}