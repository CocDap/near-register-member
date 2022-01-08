import React from "react";
import getConfig from "../../config";

const nearConfig = getConfig(process.env.NODE_ENV || "development");

const Login = () => {
  const onLogin = () => {
    window.walletConnection.requestSignIn(nearConfig.contractName);
  };

  return (
    <main>
      <p style={{ textAlign: "center", marginTop: "2.5em" }}>
        <button onClick={onLogin}>Connect Wallet</button>
      </p>
    </main>
  );
};

export default Login;
