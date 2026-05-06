import { useEffect, useState } from "react";
import { UserCheck, UserX } from "lucide-react";
import { useNewsletter } from "../../../Context/NewsletterContext";
import "./styles.css";

const SubscribersPage = () => {
    const [selected, setSelected] = useState([]);

    const { subscribers, getSubscribers, sendNewsletter } = useNewsletter();

    useEffect(() => {
        getSubscribers();
    }, []);

    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : prev.concat(id)
        );
    };

    const handleSend = async () => {
        if (!selected.length) return;

        await sendNewsletter({
            subscriberIds: selected,
            subject: "Weekly Update",
            message: "Hello from our newsletter",
        });

        setSelected([]);
    };

    return (
        <div className="sp-root">

            {/* HEADER ACTION */}
            <div className="sp-header">
                <div className="sp-header-left">
                    <div className="sp-header-icon">
                        <UserCheck size={18} />
                    </div>
                    <div>
                        <h2 className="sp-title">Subscribers</h2>
                        <p className="sp-subtitle">
                            Manage newsletter audience
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleSend}
                    disabled={!selected.length}
                    className="send-btn"
                >
                    Send Newsletter ({selected.length})
                </button>
            </div>

            {/* TABLE */}
            <div className="sp-body">
                <div className="sp-table-wrap">
                    <table className="sp-table">
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>ID</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {subscribers.map((s) => (
                                <tr
                                    key={s.id}
                                    className={`sp-row ${selected.includes(s.id)
                                        ? "sp-row-selected"
                                        : ""
                                        }`}
                                >
                                    <td className="sp-td">
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(s.id)}
                                            onChange={() => toggleSelect(s.id)}
                                        />
                                    </td>

                                    <td className="sp-td">
                                        <span className="sp-id">#{s.id}</span>
                                    </td>

                                    <td className="sp-td">
                                        <span className="sp-email">
                                            {s.email}
                                        </span>
                                    </td>

                                    <td className="sp-td">
                                        <span
                                            className={`sp-badge ${s.isActive
                                                ? "sp-badge--active"
                                                : "sp-badge--inactive"
                                                }`}
                                        >
                                            {s.isActive ? (
                                                <>
                                                    <UserCheck size={12} /> Active
                                                </>
                                            ) : (
                                                <>
                                                    <UserX size={12} /> Inactive
                                                </>
                                            )}
                                        </span>
                                    </td>

                                    <td className="sp-td">
                                        <span className="sp-date">
                                            {new Date(
                                                s.createdAt
                                            ).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
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