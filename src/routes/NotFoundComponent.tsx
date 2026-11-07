import React, { JSX } from "react";
import { useNavigate } from "react-router-dom";

import Lottie from "lottie-react";

import animationData from "../assets/Animation - 1747974941132.json";

import styles from "./styles/style.module.css";

const NotFoundPage: React.FC = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className={styles["nfcContainer"]}>
      <Lottie
        animationData={animationData}
        style={{ width: 600, height: 600 }}
      />
      <h1>Page Not Found</h1>
      <p>Sorry, the page you’re looking for doesn’t exist.</p>

      <button className={styles["button"]} onClick={() => navigate("/")}>
        Go back to home
      </button>
    </div>
  );
};

export default NotFoundPage;
