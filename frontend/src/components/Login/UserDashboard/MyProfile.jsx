import { useUserContext } from "../../../Context/Auth";
import "./MyProfile.css";

const MyProfile = () => {
    const { user } = useUserContext();

    const initials = user?.name
        ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
        : "U";

    return (
        <div className="profile-container">
            <h2 className="profile-page-title">My Profile</h2>

            <div className="profile-section">
                <div className="profile-card">
                    <div className="profile-card-header">
                        <h3 className="profile-card-title">Personal Info</h3>
                    </div>

                    {/* Avatar row */}
                    <div className="profile-avatar-row">
                        <div className="profile-avatar">{initials}</div>
                        <div className="profile-avatar-info">
                            <p>{user?.name} {user?.lastname}</p>
                            <span>{user?.email}</span>
                        </div>
                    </div>

                    {/* Fields */}
                    <div className="profile-field">
                        <label className="profile-label">First Name</label>
                        <span className="profile-value">{user?.name}</span>
                    </div>
                    <div className="profile-field">
                        <label className="profile-label">Last Name</label>
                        <span className="profile-value">{user?.lastname}</span>
                    </div>
                    <div className="profile-field">
                        <label className="profile-label">Email Address</label>
                        <span className="profile-value">{user?.email}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;