import React, { JSX, useEffect, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";

import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase";

import MessageForm from "./MessageForm";
import { fetchUserDisplayInfo, markMessagesAsRead, useChat } from "./updateInbox";

import { capitalizeName } from "../../utils/auth";

import { IDisplayUser } from "../../interfaces/message";
import { IFlat } from "../../interfaces/FlatsInterfaces";

import styles from "./styles/message.module.css";


const ChatComponent: React.FC = ():JSX.Element => {
  const { chatId } = useParams();
  const { user } = useAuth();
  const [flatData, setFlatData] = useState<IFlat | null>(null);
  const [receiverInfo, setReceiverInfo] = useState<IDisplayUser | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate()
  
  const receiverId = chatId
    ? chatId.split("_").find((id) => id !== user?.uid) || null
    : null;
  const { messages, loading } = useChat(chatId);

  useEffect(() => {
    if (!chatId || !user?.uid) return;

     const [user1, user2] = chatId.split("_");
  if (user1 !== user.uid && user2 !== user.uid) {
    navigate("/inbox")
    return
  }
    const flatId = chatId.split("_")[2];
    const flatRef = doc(db, "flats", flatId);
    getDoc(flatRef).then((snap) => {
      if (snap.exists()) setFlatData(snap.data() as IFlat);
    });

    if (receiverId) {
      fetchUserDisplayInfo(receiverId).then(setReceiverInfo);
    }
  }, [chatId]);
  useEffect(() => {
  if (chatId && user?.uid) {
    markMessagesAsRead(chatId, user.uid);
  }
}, [chatId, user?.uid]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box className={styles["chatContainer"]}>
      <Box className={styles["chatHeader"]}>
        {flatData && (
          <Typography variant="h6" gutterBottom>
            {capitalizeName(flatData.city)},{" "}
            {capitalizeName(flatData.streetName)} {flatData.streetNumber}
          </Typography>
        )}
        {receiverInfo && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              Către: {receiverInfo.displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {receiverInfo.email}
            </Typography>
          </Box>
        )}
      </Box>
      <Box className={styles["chatMessages"]}>
        {loading ? (
          <Box className={styles["loadingWrapper"]}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          
          <>
            {messages.map((msg, index) => (
              <Box
                key={index}
                className={`${styles["messageRow"]} ${
                  msg.senderId === user?.uid
                    ? styles["ownMessage"]
                    : styles["otherMessage"]
                }`}
              >
                <Paper className={styles["messageBubble"]}>
                  <Typography variant="body1">{msg.lastMessage}</Typography>
                </Paper>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>
      <Box className={styles["chatInput"]}>
        {receiverId && chatId && (
          <MessageForm
            receiverId={receiverId}
            chatId={chatId}
            flatInfo={
              flatData
                ? {
                    city: flatData.city,
                    streetName: flatData.streetName,
                    streetNumber: flatData.streetNumber,
                  }
                : undefined
            }
          />
        )}
      </Box>
    </Box>
  );
};

export default ChatComponent;
