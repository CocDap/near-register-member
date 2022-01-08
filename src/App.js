import "regenerator-runtime/runtime";
import React from "react";
import "./global.css";

import getConfig from "./config";
const { networkId } = getConfig(process.env.NODE_ENV || "development");

import Login from "./modules/auth/Login";
import Logout from "./modules/auth/Logout";
import MemberRegister from "./modules/member-register/MemberRegister";
import Notification from "./components/Notification/Notification";

export const AppContext = React.createContext(undefined);
export const useAppContext = () => React.useContext(AppContext);

export default function App() {
  const [showNotification, setShowNotification] = React.useState(false);

  if (!window.walletConnection.isSignedIn()) {
    return <Login />;
  }

  console.log(showNotification);

  return (
    <AppContext.Provider value={{ showNotification, setShowNotification }}>
      <Logout style={{ float: "right" }} />
      <MemberRegister />
      {showNotification && <Notification />}
    </AppContext.Provider>
  );
}
