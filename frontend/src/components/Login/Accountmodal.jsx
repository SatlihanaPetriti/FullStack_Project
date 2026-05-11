import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Accountmodal.css";

const AccountDropdown = ({ show, handleClose, user, position, logout }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fullName = user?.name || "User";
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!show) return;

    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        handleClose();
      }
    };

    const handleScroll = () => handleClose();

    document.addEventListener("mousedown", handleClick);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("scroll", handleScroll, true);
    };
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
        "--acc-top": `${position?.top ?? 60}px`,
        "--acc-left": `${position?.left ?? 0}px`,
      }}
    >
      <div className="acc-header">
        <div className="acc-header-left">
          <span className="acc-title">Welcome {fullName}</span>
          {isAdmin && <span className="acc-role-badge">Admin</span>}
        </div>
      </div>

      <ul className="acc-list">
        {isAdmin && (
          <li className="acc-item" style={{ animationDelay: "0.04s" }}>
            <button
              className="acc-btn acc-btn-admin"
              onClick={() => goTo("/admin/overview")}
            >
              Admin Panel
            </button>
          </li>
        )}

        <li className="acc-item" style={{ animationDelay: "0.06s" }}>
          <button className="acc-btn acc-btn-green" onClick={() => goTo("/account/profile")}>
            My Profile
          </button>
        </li>

        <li className="acc-item" style={{ animationDelay: "0.11s" }}>
          <button className="acc-btn acc-btn-green" onClick={() => goTo("/account")}>
            Dashboard
          </button>
        </li>

        <li className="acc-item" style={{ animationDelay: "0.16s" }}>
          <button className="acc-btn acc-btn-red" onClick={() => { logout(); handleClose(); }}>
            Log out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AccountDropdown;