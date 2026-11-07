import React, { JSX, useEffect, useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Badge, Box, Typography } from "@mui/material";

import { useAuth } from "../../context/AuthContext";
import { useInbox } from "./updateInbox";

import styles from "./styles/message.module.css";


const InboxComponent: React.FC = (): JSX.Element => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { conversations, usersInfo, loading } = useInbox(user?.uid);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const { chatId } = useParams();

  useEffect(() => {
    if (location.pathname === "/inbox") {
      setActiveChat(null);
    } else if (chatId) {
      setActiveChat(chatId);
    }
  }, [location.pathname]);

  if (loading) return <Typography>Loading conversations...</Typography>;

  const handleChatClick = (chatId: string) => {
    navigate(`/inbox/${chatId}`);
    setActiveChat(chatId);
  };

  return (
    <Box className={styles["inboxContainer"]}>
      <Typography variant="h6" gutterBottom>
        Inbox
      </Typography>
      {conversations.length === 0 ? (
        <Typography>No conversations yet.</Typography>
      ) : (
        conversations.map((conversation) => {
          const userInfo = usersInfo[conversation.otherUserId];
          return (
            <Badge
              key={conversation.chatId}
              className={`${styles["item"]} ${
                activeChat === conversation.chatId ? styles["active"] : ""
              }`}
              color="error"
              variant="dot"
              invisible={conversation.unreadCount === 0}
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
              onClick={() => handleChatClick(conversation.chatId)}
            >
              <Box className={styles["conversation"]}>
                <Typography variant="h6" className={styles["message"]}>
                  {userInfo ? userInfo.displayName : conversation.title}
                </Typography>
                {userInfo && (
                  <Typography className={styles["message"]} variant="body2">
                    {userInfo.email}
                  </Typography>
                )}
                <Typography variant="body2" className={styles["message"]}>
                  {conversation.lastMessage}
                </Typography>
                <Typography variant="caption">
                  {conversation.timestamp?.toDate?.().toLocaleString?.() ?? ""}
                </Typography>
              </Box>
            </Badge>
          );
        })
      )}
    </Box>
  );
};

export default InboxComponent;
