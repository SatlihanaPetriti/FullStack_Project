import { useEffect, useState } from "react";
import { UserCheck, UserX, Send } from "lucide-react";
import { useNewsletter } from "../../../Context/NewsletterContext";
import NewsletterModal from "./NewsletterModal ";
import "./styles.css";

const SubscribersPage = () => {
    const [selected, setSelected] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    const { subscribers, getSubscribers, sendNewsletter } = useNewsletter();

    useEffect(() => {
        getSubscribers();
    }, []);

    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        const allSelected = subscribers.every((s) => selected.includes(s.id));
        setSelected(allSelected ? [] : subscribers.map((s) => s.id));
    };

    const handleSend = async ({ subject, message }) => {
        await sendNewsletter({
            subscriberIds: selected,
            subject,
            message,
        });
        setSelected([]);
    };

    const allSelected =
        subscribers.length > 0 && subscribers.every((s) => selected.includes(s.id));

    return (
        <div className="sp-root">

            {/* HEADER */}
            <div className="sp-header">
                <div className="sp-header-left">
                    <div className="sp-header-icon">
                        <UserCheck size={18} />
                    </div>
                    <div>
                        <h2 className="sp-title">Subscribers</h2>
                        <p className="sp-subtitle">Manage newsletter audience</p>
                    </div>
                </div>

                <button
                    onClick={() => selected.length && setModalOpen(true)}
                    disabled={!selected.length}
                    className="send-btn"
                >
                    <Send size={14} />
                    Send Newsletter{selected.length > 0 && ` (${selected.length})`}
                </button>
            </div>

            {/* TABLE */}
            <div className="sp-body">
                <div className="sp-table-wrap">
                    <table className="sp-table">
                        <thead>
                            <tr>
                                <th className="sp-th">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={toggleAll}
                                        style={{ width: 16, height: 16, accentColor: "#16a34a", cursor: "pointer" }}
                                    />
                                </th>
                                <th className="sp-th">ID</th>
                                <th className="sp-th">Email</th>
                                <th className="sp-th">Status</th>
                                <th className="sp-th">Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {subscribers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="sp-td" style={{ textAlign: "center", color: "#9ca3af", padding: "2.5rem" }}>
                                        No subscribers yet
                                    </td>
                                </tr>
                            ) : subscribers.map((s) => (
                                <tr
                                    key={s.id}
                                    className={`sp-row ${selected.includes(s.id) ? "sp-row-selected" : ""}`}
                                    onClick={() => toggleSelect(s.id)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td className="sp-td">
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(s.id)}
                                            onChange={() => toggleSelect(s.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className="sp-td">
                                        <span className="sp-id">#{s.id}</span>
                                    </td>
                                    <td className="sp-td">
                                        <span className="sp-email">{s.email}</span>
                                    </td>
                                    <td className="sp-td">
                                        <span className={`sp-badge ${s.isActive ? "sp-badge--active" : "sp-badge--inactive"}`}>
                                            {s.isActive
                                                ? <><UserCheck size={12} /> Active</>
                                                : <><UserX size={12} /> Inactive</>
                                            }
                                        </span>
                                    </td>
                                    <td className="sp-td">
                                        <span className="sp-date">
                                            {new Date(s.createdAt).toLocaleDateString("en-GB", {
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

            {/* FOOTER */}
            {selected.length > 0 && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>
                        {selected.length} selected —{" "}
                        <span
                            onClick={() => setSelected([])}
                            style={{ cursor: "pointer", textDecoration: "underline", color: "#9ca3af" }}
                        >
                            clear
                        </span>
                    </span>
                </div>
            )}

            {modalOpen && (
                <NewsletterModal
                    selectedCount={selected.length}
                    onClose={() => setModalOpen(false)}
                    onSend={handleSend}
                />
            )}
        </div>
    );
};

export default SubscribersPage;