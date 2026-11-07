import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "firebase/auth";

import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import MailIcon from "@mui/icons-material/Mail";
import PersonIcon from "@mui/icons-material/Person";
import RealEstateAgentIcon from "@mui/icons-material/RealEstateAgent";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";

import logo from "../../assets/logo.png";

import { useAuth } from "../../context/AuthContext";
import { useFirestoreUser } from "../../context/FirestoreUserContext";

import { useInbox } from "../messages/updateInbox";

import { Role } from "../../interfaces/UsersInterfaces";

import { getInitials } from "../../utils/auth";

import styles from "./styles/NavBarComponent.module.css";

type Anchor = "right";

const NavbarComponent: React.FC<{ user: User | null }> = ({
  user,
}): JSX.Element => {
  const [state, setState] = useState({ right: false });
  const { firestoreUser } = useFirestoreUser();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { conversations } = useInbox(user?.uid);
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      className={styles["drawerMenu"]}
      sx={{ width: anchor === "right" ? 250 : "auto" }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {firestoreUser?.userRole === Role.admin && (
          <ListItem disablePadding className={styles["listItem"]}>
            <ListItemButton onClick={() => navigate("/users")}>
              <ListItemIcon>
                <SupervisedUserCircleIcon />
              </ListItemIcon>
              <ListItemText primary="All users" />
            </ListItemButton>
          </ListItem>
        )}
        {user && (
          <Box>
            <ListItem>
              <h3>Welcom {firestoreUser?.displayName}</h3>
            </ListItem>
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding className={styles["listItem"]}>
              <ListItemButton
                onClick={() => navigate(`/myProfile/${user.uid}`)}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding className={styles["listItem"]}>
              <ListItemButton onClick={() => navigate(`/inbox`)}>
                <ListItemIcon>
                  <Badge
                    badgeContent={totalUnread}
                    invisible={totalUnread === 0}
                    color="error"
                  >
                    <MailIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Messages" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding className={styles["listItem"]}>
              <ListItemButton onClick={() => navigate(`/myFlats`)}>
                <ListItemIcon>
                  <RealEstateAgentIcon />
                </ListItemIcon>
                <ListItemText primary="My Flats" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding className={styles["listItem"]}>
              <ListItemButton onClick={() => navigate(`/newFlat`)}>
                <ListItemIcon>
                  <RealEstateAgentIcon />
                </ListItemIcon>
                <ListItemText primary="New Flat" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding className={styles["listItem"]}>
              <ListItemButton onClick={() => navigate(`/favorite`)}>
                <ListItemIcon>
                  <FavoriteIcon />
                </ListItemIcon>
                <ListItemText primary="Favorite" />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding className={styles["listItem"]}>
              <ListItemButton onClick={async () => await logout()}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </Box>
        )}
      </List>
    </Box>
  );

  return (
    <div className={styles["navbarContainer"]}>
      <div className={styles["logoDiv"]} onClick={() => navigate("/")}>
        <img src={logo} alt="Logo" className={styles["logo"]} />
      </div>
      {/* Avatarul utilizatorului */}
      {user && (
        <Avatar
          className={styles["avatar"]}
          alt={user.displayName || "User"}
          src={user.photoURL || ""}
          onClick={toggleDrawer("right", true)}
          sx={{ bgcolor: user.photoURL ? "transparent" : " #7d98a1ff" }}
        >
          {!user.photoURL &&
            getInitials(
              firestoreUser ? `${firestoreUser.displayName}` : "User",
            )}
        </Avatar>
      )}

      <Drawer
        anchor="right"
        open={state["right"]}
        onClose={toggleDrawer("right", false)}
      >
        {list("right")}
      </Drawer>
    </div>
  );
};

export default NavbarComponent;
