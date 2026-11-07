export const firebaseErrorMessages: { [key: string]: string } = {
    "auth/email-already-in-use": "This email address is already registered.",
    "auth/weak-password": "Password is too weak. Please choose a stronger one.",
    "auth/invalid-email": "Invalid email or password",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/too-many-requests": "Too many requests. Please try again later.",
    "auth/account-exists-with-different-credential": "This email is associated with another account. Please use a different method to sign in.",
    "auth/user-disabled": "This user has been disabled. Please contact support.",
    "auth/operation-not-allowed": "This method of sign-in is not allowed. Please enable it in Firebase console.",
    "auth/expired-action-code": "The verification link has expired. Please request a new one.",
    "auth/invalid-action-code": "Invalid or expired code. Please try again.",
    "auth/cancelled-popup-request": "Popup was blocked by the browser. Please disable popup blockers.",
    "auth/popup-blocked": "Popup was blocked by your browser. Please allow popups.",
    "auth/popup-closed-by-user": "Popup was closed before completing the operation.",
    "auth/invalid-password": "Password is not strong enough.",
    "auth/requires-recent-login": "This operation requires recent authentication. Please log in again.",
    "auth/email-not-verified": "Your email is not verified. Please check your inbox for a verification email.",
    "auth/network-request-failed": "A network error occurred. Please check your internet connection.",
    "auth/missing-password": "Invalid email or password",
    "auth/invalid-credential": "Invalid email or password",
    // adaugă și alte erori după cum este necesar
  };
  
  export const getFirebaseErrorMessage = (code: string): string => {
    return firebaseErrorMessages[code] || "An unexpected error occurred. Please try again.";
  };
  