import { JSX } from "react";
import { useParams } from "react-router-dom";

import { Box, Typography } from "@mui/material";

import ChatComponent from "./ChatComponent";
import InboxComponent from "./InboxComponent";

import styles from "./styles/message.module.css";


const MessagesPage: React.FC = ():JSX.Element => {
  const { chatId } = useParams();

  return (
    <Box className={styles["messages-page"]}>
      <Box className={styles["inbox-column"]}>
        <InboxComponent />
      </Box>

      <Box className={styles["chat-column"]}>
        {chatId ? (
          <ChatComponent />
        ) : (
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", mt: 2, textAlign: "center" }}
          >
            Select a conversation
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default MessagesPage;
