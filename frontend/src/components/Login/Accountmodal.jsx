import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Accountmodal.css";

const AccountDropdown = ({ show, handleClose, user, position, logout }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const firstName = user?.name?.split(" ")[0] || "User";

  useEffect(() => {
    if (!show) return;

    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [show, handleClose]);

  if (!show) return null;

  const goTo = (path) => {
    navigate(path);
    handleClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="acc-card"
      style={{
        position: "fixed",
        top: position?.top ?? 60,
        left: position?.left ?? 0,
        zIndex: 9999,
      }}
    >
      <div className="acc-welcome">
        Welcome, <strong>{firstName}</strong>
      </div>

      <button
        className="acc-btn acc-btn-green"
        onClick={() => goTo("/account/profile")}
      >
        My Profile
      </button>

      <button
        className="acc-btn acc-btn-green"
        onClick={() => goTo("/account")}
      >
        Dashboard
      </button>

      <button
        className="acc-btn acc-btn-red"
        onClick={() => {
          logout();
          handleClose();
        }}
      >
        Log out
      </button>
    </div>
  );
};

export default AccountDropdown;