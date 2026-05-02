import "./AccountModal.css";

const AccountDropdown = ({ show, handleClose, user, position }) => {
  const firstName = user?.name?.split(" ")[0] || "User";

  if (!show) return null;

  return (
    <>
      {/* click outside */}
      <div className="acc-backdrop" onClick={handleClose}></div>

      {/* dropdown */}
      <div
        className="acc-dropdown"
        style={{
          top: position?.top,
          left: position?.left
        }}
      >
        <div className="acc-welcome">
          Welcome <strong>{firstName}</strong>
        </div>

        <button className="acc-btn acc-green">
          My Profile
        </button>

        <button className="acc-btn acc-green">
          Dashboard
        </button>

        <button className="acc-btn acc-red" onClick={handleClose}>
          Log out
        </button>
      </div>
    </>
  );
};

export default AccountDropdown;