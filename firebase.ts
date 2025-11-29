import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// 从环境变量中读取 Firebase 配置，以提高安全性并解决 Netlify 部署问题。
// 您需要在 Netlify 的项目设置中配置这些环境变量。
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// 检查关键配置是否存在，如果不存在则提示错误
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error("Firebase configuration is missing. Please set up your environment variables in Netlify.");
}

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化 Cloud Firestore 并获取对服务的引用
const db = getFirestore(app);

export { db };