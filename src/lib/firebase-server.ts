import { cert, initializeApp } from 'firebase-admin/app'

export const getFirebaseAdminApp = initializeApp({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  credential: cert({
    // use the same project id with firebase for client
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    // From service account key
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  }),
})
