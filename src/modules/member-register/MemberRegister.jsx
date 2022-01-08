import React, { useCallback, useState } from "react";
import { useAppContext } from "../../App";
import { debounce } from "../../utils";

const MemberRegister = () => {
  const { setShowNotification } = useAppContext();
  const [inputValue, setInputValue] = useState();
  const [accountName, setAccountName] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const debouncedSave = useCallback(
    debounce(async (value) => {
      try {
        setLoading(true);
        await window.contract
          .find_member({ account_id: window.accountId, slot: +value })
          .then((accountName) => {
            if (accountName === "Undefined") {
              setAccountName("");
              setButtonDisabled(false);
            } else {
              setAccountName(accountName);
              setButtonDisabled(true);
            }
          });
      } catch (e) {
        alert("Something went wrong. Please input again");
        throw e;
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const onChange = (event) => {
    const { value } = event.target;
    if (value) {
      setInputValue(value);
      debouncedSave(value);
    } else {
      setButtonDisabled(true);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    setLoading(false);
    try {
      // make an update call to the smart contract
      await window.contract.register({
        account_id: window.accountId,
        slot: +inputValue,
      });
    } catch (e) {
      alert(
        "Something went wrong! " +
          "Maybe you need to sign out and back in? " +
          "Check your browser console for more info."
      );
      throw e;
    } finally {
      setLoading(true);
    }

    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 11000);
  };

  return (
    <main>
      <h1>Welcome {window.accountId}!</h1>
      {loading && <h3>Loading ...</h3>}
      <form onSubmit={onSubmit}>
        <fieldset id="fieldset">
          <div style={{ display: "flex" }}>
            <input
              id="slot"
              type="number"
              placeholder="Please input slot"
              onChange={onChange}
              style={{ flex: 2 }}
            />
            <button disabled={buttonDisabled} style={{ marginLeft: "10px" }}>
              Register
            </button>
          </div>
        </fieldset>
      </form>
      {accountName && (
        <h2>{`This slot has been registered by ${accountName}`}</h2>
      )}
    </main>
  );
};

export default MemberRegister;
