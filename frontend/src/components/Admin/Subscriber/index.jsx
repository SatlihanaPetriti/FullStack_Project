import { useEffect, useState } from "react";
import axios from "axios";
import { UserCheck, UserX } from "lucide-react";
import "./styles.css";

const SubscribersPage = () => {
    const [subscribers, setSubscribers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/mail/subscribers")
            .then((res) => setSubscribers(res.data));
    }, []);

    return (
        <div className="sp-root">
            <div className="sp-body">
                <div className="sp-table-wrap">
                    <table className="sp-table">
                        <thead>
                            <tr>
                                <th className="sp-th sp-th--id">ID</th>
                                <th className="sp-th sp-th--email">Email</th>
                                <th className="sp-th sp-th--status">Status</th>
                                <th className="sp-th sp-th--date">Subscribed At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscribers.map((s, i) => (
                                <tr key={s.id} className="sp-row" style={{ "--row-i": i }}>
                                    <td className="sp-td"><span className="sp-id">#{s.id}</span></td>
                                    <td className="sp-td">
                                        <div className="sp-email-cell">
                                            <span className="sp-email">{s.email}</span>
                                        </div>
                                    </td>
                                    <td className="sp-td">
                                        <span className={`sp-badge ${s.isActive ? "sp-badge--active" : "sp-badge--inactive"}`}>
                                            {s.isActive ? <>
                                            <UserCheck size={11} /> Active</> : <><UserX size={11} /> Unsubscribed</>}
                                        </span>
                                    </td>
                                    <td className="sp-td">
                                        <span className="sp-date">
                                            {new Date(s.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SubscribersPage;