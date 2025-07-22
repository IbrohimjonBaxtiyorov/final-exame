import {
  doc, setDoc, updateDoc, getDoc, arrayUnion,
  collection, addDoc
} from "firebase/firestore";
import { db } from "./config";

// 1. Foydalanuvchini users ga qo‘shish
export async function createUser(userId, userData) {
  await setDoc(doc(db, "users", userId), userData);
}

export async function addUserToGroup(groupId, userId) {
  const groupRef = doc(db, "groups", groupId);
  await updateDoc(groupRef, {
    members: arrayUnion(userId),
    totalMembers: (await getDoc(groupRef)).data().totalMembers + 1
  });
}

// 3. Guruhni yaratish
export async function createGroup(groupId, groupName) {
  await setDoc(doc(db, "groups", groupId), {
    name: groupName,
    createdAt: new Date(),
    members: [],
    totalMembers: 0,
    totalContributed: 0,
    currentRound: 0,
    currentReceiver: null
  });
}

export function subscribeToUser(userId, cb) {
  return onSnapshot(doc(db, "users", userId), (snap) => cb(snap.data()));
}

export function subscribeToGroup(groupId, cb) {
  return onSnapshot(doc(db, "groups", groupId), (snap) => cb(snap.data()));
}

