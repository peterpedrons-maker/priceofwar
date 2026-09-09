import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  sendPasswordResetEmail, 
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export const loginWithEmail = (email: string, password: string) => 
  signInWithEmailAndPassword(auth, email, password);

export const registerWithEmail = (email: string, password: string) => 
  createUserWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = () => 
  signInWithPopup(auth, googleProvider);

export const resetPassword = (email: string) => 
  sendPasswordResetEmail(auth, email);

export const logout = () => 
  signOut(auth);

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => 
  onAuthStateChanged(auth, callback);
