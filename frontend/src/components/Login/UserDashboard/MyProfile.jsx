import { useUserContext } from "../../../Context/Auth";
import "./MyProfile.css";

const MyProfile = () => {
    const { user } = useUserContext();

    if (!user) {
        return <p className="loading">No user found</p>;
    }

    return (
        <div className="profile-container">
            <h2 className="title">My Profile</h2>

            <div className="profile-card">
                <p><span>Name:</span> {user.name}</p>
                <p><span>Last Name:</span> {user.lastname}</p>
                <p><span>Email:</span> {user.email}</p>
            </div>
        </div>
    );
};

export default MyProfile;