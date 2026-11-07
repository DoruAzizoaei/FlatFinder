import { FieldValue, Timestamp } from "firebase/firestore";

export interface IMessage {
  participants: string[]
  senderId: string;
  receiverId: string;
  title: string;
  lastMessage: string;
  timestamp: Timestamp | FieldValue | null; 
  readBy:string[]
}

export interface IConversation {
   unreadCount: number;
  chatId: string;
  otherUserId: string;
  lastMessage: string;
  timestamp: Timestamp ;
  title: string;
}
export interface IDisplayUser {
  displayName: string;
  email: string;
}