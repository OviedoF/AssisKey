import React, { useState, createContext, useEffect } from "react";

export const dataContext = createContext();

export const DataProvider = ({ children }) => {
  const [user, setUser] = useState({})
  const [snackbar, setSnackbar] = useState({
    visible: false,
    text: "",
    type: "success",
  })
  const [loading, setLoading] = useState(false)
  const [qrForEntry, setQrForEntry] = useState(false)
  const [dangerModal, setDangerModal] = useState({
    visible: false,
    title: "",
    text: "",
    buttons: [],
  })

  return (
    <dataContext.Provider
      value={{
        user,
        setUser,
        snackbar,
        setSnackbar,
        loading,
        setLoading,
        qrForEntry,
        setQrForEntry,
        dangerModal,
        setDangerModal,
      }}
    >
      {children}
    </dataContext.Provider>
  );
};
