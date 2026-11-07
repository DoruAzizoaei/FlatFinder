import { useEffect, useState } from "react";

import { db } from "../../services/firebase";

import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  getDoc,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  QueryDocumentSnapshot,
  DocumentData,
  getDocs,
  updateDoc,
  increment,
} from "firebase/firestore";

import { capitalizeName } from "../../utils/auth";

import {
  IConversation,
  IDisplayUser,
  IMessage,
} from "../../interfaces/message";

export const useInbox = (userId?: string) => {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [usersInfo, setUsersInfo] = useState<Record<string, IDisplayUser>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const chatsRef = collection(db, "chats");
    const q = query(chatsRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convs: IConversation[] = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();

        if (!data.participants?.includes(userId)) return;

        const otherUserId = data.participants.find(
          (id: string) => id !== userId
        );
        const unreadCount = data.unreadCounts?.[userId] || 0;

        convs.push({
          chatId: doc.id,
          otherUserId,
          lastMessage: data.lastMessage || "",
          timestamp: data.timestamp,
          title: data.title || "Mesaj nou",
          unreadCount,
        });
      });

      setConversations(convs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    const missingUserIds = conversations
      .map((c) => c.otherUserId)
      .filter((id) => !usersInfo[id]);

    if (missingUserIds.length === 0) return;

    Promise.all(
      missingUserIds.map((id) =>
        fetchUserDisplayInfo(id).then((info) => ({ id, info }))
      )
    ).then((results) => {
      const newUsers: Record<string, IDisplayUser> = {};
      results.forEach(({ id, info }) => {
        newUsers[id] = info;
      });
      setUsersInfo((prev) => ({ ...prev, ...newUsers }));
    });
  }, [conversations, usersInfo]);

  return { conversations, usersInfo, loading };
};

export const fetchUserProfile = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const data = snap.data();
    return {
      displayName: `${capitalizeName(data.firstName)} ${capitalizeName(
        data.lastName
      )}`.trim(),
      email: data.email || "",
    };
  }
  return { displayName: "Necunoscut", email: "" };
};

export const fetchUserDisplayInfo = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();
      const firstName = capitalizeName(data.firstName || "");
      const lastName = capitalizeName(data.lastName || "");
      const displayName = `${firstName} ${lastName}`.trim();

      return {
        displayName: displayName || "Nume indisponibil",
        email: data.email || "Email indisponibil",
      };
    }
  } catch (error) {
    console.error("Eroare la fetch user profile:", error);
  }

  return {
    displayName: "Utilizator necunoscut",
    email: "",
  };
};

export const sendMessage = async ({
  chatId,
  senderId,
  receiverId,
  lastMessage,
  flatInfo,
}: {
  chatId: string;
  senderId: string;
  receiverId: string;
  lastMessage: string;

  flatInfo?: {
    city: string;
    streetName: string;
    streetNumber: number;
  };
}) => {
  const chatRef = doc(db, "chats", chatId);
  const messagesRef = collection(db, "chats", chatId, "messages");

  const messageData: IMessage = {
    participants: [senderId, receiverId],
    senderId,
    receiverId,
    title: flatInfo
      ? `Mesaj for ${capitalizeName(flatInfo.city)}, ${capitalizeName(
          flatInfo.streetName
        )} ${flatInfo.streetNumber}`
      : "Mesaj nou",
    lastMessage,
    timestamp: serverTimestamp(),
    readBy: [senderId],
  };

  try {
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        participants: [senderId, receiverId],
        unreadCounts: {
          [senderId]: 0,
          [receiverId]: 1,
        },
        lastMessage,
        timestamp: serverTimestamp(),
      });
    } else {
      await updateDoc(chatRef, {
        lastMessage,
        timestamp: serverTimestamp(),
        [`unreadCounts.${receiverId}`]: increment(1),
      });
    }
    await addDoc(messagesRef, messageData);
  } catch (error) {
    console.log(error);
  }
};

export const useChat = (chatId?: string) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(
        (doc: QueryDocumentSnapshot<DocumentData>) => ({
          ...doc.data(),
        })
      ) as IMessage[];

      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  return { messages, loading };
};

export const markMessagesAsRead = async (chatId: string, userId: string) => {
  const chatRef = doc(db, "chats", chatId);
  const messagesRef = collection(chatRef, "messages");
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    return;
  }

  const snapshot = await getDocs(messagesRef);

  const updates = snapshot.docs.map(async (msgDoc) => {
    const data = msgDoc.data();
    if (data.receiverId === userId && !data.read) {
      await updateDoc(doc(db, "chats", chatId, "messages", msgDoc.id), {
        read: true,
      });
    }
  });

  await updateDoc(doc(db, "chats", chatId), {
    [`unreadCounts.${userId}`]: 0,
  });

  await Promise.all(updates);
};
