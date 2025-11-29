import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: 将此处替换为您的 Firebase 项目配置
// 注意：这是一个前端应用，请确保您的 Firestore 安全规则已正确配置。
const firebaseConfig = {
  apiKey: "AIzaSyAFUC-Vc-vBJITVnh2oM369ONG71RSGyXE",
  authDomain: "kolckm-bca2f.firebaseapp.com",
  databaseURL: "https://kolckm-bca2f-default-rtdb.firebaseio.com",
  projectId: "kolckm-bca2f",
  storageBucket: "kolckm-bca2f.firebasestorage.app",
  messagingSenderId: "840830636040",
  appId: "1:840830636040:web:4e6c747abd3dc00fd401bd",
  measurementId: "G-N96R7EPB06"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化 Cloud Firestore 并获取对服务的引用
const db = getFirestore(app);

export { db };
