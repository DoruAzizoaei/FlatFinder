import React, { JSX } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginComponent from "../component/auth/LoginComponent";
import RegisterComponent from "../component/auth/RegisterComponent";

import PrivateRoute from "./PrivateRouteComponent";
import PublicRoute from "./PublicRouteComponent";

import HomeComponent from "../component/users/HomeComponent";
import NewFlatComponent from "../component/flats/NewFlatComponent";
import MyFlatsComponent from "../component/flats/MyFlatsComponent";
import MYProfileComponent from "../component/users/MYProfileComponent";
import FavoriteComponent from "../component/flats/FavoriteComponent";

import ChatComponent from "../component/messages/ChatComponent";
import MessagesPage from "../component/messages/MessagesPage";

import AdminPageComponent from "../component/users/admin/AdminPageComponent";

import { FirestoreUserProvider } from "../context/FirestoreUserContext";
import { useAuth } from "../context/AuthContext";

import NotFoundPage from "./NotFoundComponent";

const AppRoutesComponent: React.FC = (): JSX.Element => {
  const { user, isLoading } = useAuth();
  return (
    <Router>
      <Routes>
        <Route
          element={
            <FirestoreUserProvider>
              <PrivateRoute />
            </FirestoreUserProvider>
          }
        >
          <Route path="/" element={<HomeComponent />} />
          <Route path="/users" element={<AdminPageComponent />} />
          <Route path="/newFlat" element={<NewFlatComponent />} />
          <Route path="/myFlats" element={<MyFlatsComponent />} />
          <Route path="/myProfile/:id" element={<MYProfileComponent />} />
          <Route path="/users/:userId" element={<MYProfileComponent />} />
          <Route path="/myFlats/:userId" element={<MyFlatsComponent />} />
          <Route path="/favorite" element={<FavoriteComponent />} />
          <Route path="/inbox" element={<MessagesPage />}>
            <Route path=":chatId" element={<ChatComponent />} />
          </Route>
        </Route>

        <Route element={<PublicRoute user={user} isLoading={isLoading} />}>
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/register" element={<RegisterComponent />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutesComponent;
