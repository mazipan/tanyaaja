import { getFirebaseAuth } from 'next-firebase-auth-edge/lib/auth'
import { DecodedIdToken } from 'next-firebase-auth-edge/lib/auth/token-verifier'

import ServiceAccount from '@/../tanyaaja-firebase-adminsdk.json'

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? ''
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? ''

const Auth = getFirebaseAuth(
  {
    projectId: PROJECT_ID,
    privateKey: ServiceAccount.private_key,
    clientEmail: ServiceAccount.client_email,
  },
  API_KEY,
)

export const verifyIdToken = (
  idToken: string,
  checkRevoked?: boolean,
): Promise<DecodedIdToken> => Auth.verifyIdToken(idToken, checkRevoked)

export const deleteUser = (uid: string) => Auth.deleteUser(uid)
