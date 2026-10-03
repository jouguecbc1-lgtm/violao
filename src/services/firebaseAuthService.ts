import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';
import { UserStats, Instrument } from '../types';

export interface AuthUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  role: 'student' | 'teacher' | 'admin';
}

/**
 * Maps a Firebase user to an internal AuthUserProfile representation
 */
export function mapFirebaseUser(user: FirebaseUser, role: 'student' | 'teacher' | 'admin' = 'student'): AuthUserProfile {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || (user.isAnonymous ? 'Aluno Convidado' : 'Estudante'),
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous,
    role,
  };
}

/**
 * Loads user stats from Firestore or returns null if not found
 */
export async function loadUserStatsFromFirestore(userId: string): Promise<UserStats | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.stats) {
        return data.stats as UserStats;
      }
    }
    return null;
  } catch (error) {
    console.warn('Erro ao carregar dados do Firestore:', error);
    return null;
  }
}

/**
 * Syncs user profile and stats to Firestore
 */
export async function saveUserStatsToFirestore(
  userId: string,
  stats: UserStats,
  userProfile?: Partial<AuthUserProfile>
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(
      userRef,
      {
        id: userId,
        email: userProfile?.email || null,
        displayName: userProfile?.displayName || stats.studentName,
        preferredInstrument: stats.preferredInstrument,
        studentLevel: stats.studentLevel,
        studentGoal: stats.studentGoal,
        streakDays: stats.streakDays,
        exercisesAttempted: stats.exercisesAttempted,
        exercisesCorrect: stats.exercisesCorrect,
        quizScore: stats.quizScore,
        totalTimeMinutes: stats.totalTimeMinutes,
        stats: stats,
        updatedAt: new Date().toISOString(),
        serverUpdated: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Erro ao salvar no Firestore:', error);
  }
}

/**
 * Sign in with Email and Password
 */
export async function loginWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return cred.user;
}

/**
 * Create new account with Email, Password and initial details
 */
export async function registerWithEmail(
  email: string,
  pass: string,
  name: string,
  instrument: Instrument = 'violao'
): Promise<FirebaseUser> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (name.trim()) {
    await updateProfile(cred.user, { displayName: name.trim() });
  }

  // Initialize doc in Firestore
  const userRef = doc(db, 'users', cred.user.uid);
  await setDoc(
    userRef,
    {
      id: cred.user.uid,
      email: cred.user.email,
      displayName: name.trim() || 'Estudante',
      role: 'student',
      preferredInstrument: instrument,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  return cred.user;
}

/**
 * Sign in with Google Popup
 */
export async function loginWithGoogle(): Promise<FirebaseUser> {
  const cred = await signInWithPopup(auth, googleProvider);
  return cred.user;
}

/**
 * Sign in anonymously (Guest quick mode)
 */
export async function loginAnonymouslyUser(): Promise<FirebaseUser> {
  const cred = await signInAnonymously(auth);
  return cred.user;
}

/**
 * Sign out
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Auth state listener
 */
export function onAuthUserChanged(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
