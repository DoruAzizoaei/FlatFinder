import React, { JSX, useState } from "react";

import { Box, Button, TextField } from "@mui/material";

import { useAuth } from "../../context/AuthContext";

import { sendMessage } from "./updateInbox";

import { IFlat } from "../../interfaces/FlatsInterfaces";

import styles from "./styles/message.module.css";


type Props = {
  receiverId: string;
  chatId: string;
  flatInfo?: Pick<IFlat, "city" | "streetName" | "streetNumber">;
  onSuccess?: () => void;
};

const MessageForm: React.FC<Props> = ({
  receiverId,
  chatId,
  flatInfo,
  onSuccess,
}): JSX.Element => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message.trim() || !user) return;

    try {
      await sendMessage({
        chatId,
        senderId: user.uid,
        receiverId,
        lastMessage: message.trim(),
        flatInfo,
      });

      setMessage("");
      onSuccess?.();
    } catch (error) {
      console.error("Error to send message", error);
    }
  };

  return (
    <Box className={styles["messageForm"]}>
      <TextField
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a message..."
      />
      <Button
        className={styles["messageButton"]}
        variant="contained"
        onClick={handleSend}
      >
        Send
      </Button>
    </Box>
  );
};

export default MessageForm;
