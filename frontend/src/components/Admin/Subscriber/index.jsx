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

    const allSelected =
        subscribers.length > 0 &&
        subscribers.every((subscriber) =>
            selected.includes(subscriber.id)
        );

    const selectedCount = selected.length;

    const isSelected = (id) => {
        return selected.includes(id);
    };

    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((selectedId) => selectedId !== id)
                : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (allSelected) {
            setSelected([]);
            return;
        }

        const allSubscriberIds = subscribers.map((subscriber) => subscriber.id);
        setSelected(allSubscriberIds);
    };

    const clearSelection = () => {
        setSelected([]);
    };

    const openModal = () => {
        if (selectedCount === 0) return;
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleSend = async ({ subject, message }) => {
        await sendNewsletter({
            subscriberIds: selected,
            subject,
            message,
        });

        clearSelection();
    };

    return (
        <div className="sp-root">
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
                    onClick={openModal}
                    disabled={selectedCount === 0}
                    className="send-btn"
                >
                    <Send size={14} />
                    Send Newsletter
                    {selectedCount > 0 && ` (${selectedCount})`}
                </button>
            </div>

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
                                        style={{
                                            width: 16,
                                            height: 16,
                                            accentColor: "#16a34a",
                                            cursor: "pointer",
                                        }}
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
                                    <td
                                        colSpan={5}
                                        className="sp-td"
                                        style={{
                                            textAlign: "center",
                                            color: "#9ca3af",
                                            padding: "2.5rem",
                                        }}
                                    >
                                        No subscribers yet
                                    </td>
                                </tr>
                            ) : (
                                subscribers.map((subscriber) => (
                                    <tr
                                        key={subscriber.id}
                                        className={`sp-row ${isSelected(subscriber.id)
                                            ? "sp-row-selected"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            toggleSelect(subscriber.id)
                                        }
                                        style={{ cursor: "pointer" }}
                                    >
                                        <td className="sp-td">
                                            <input
                                                type="checkbox"
                                                checked={isSelected(
                                                    subscriber.id
                                                )}
                                                onChange={() =>
                                                    toggleSelect(subscriber.id)
                                                }
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            />
                                        </td>

                                        <td className="sp-td">
                                            <span className="sp-id">
                                                #{subscriber.id}
                                            </span>
                                        </td>

                                        <td className="sp-td">
                                            <span className="sp-email">
                                                {subscriber.email}
                                            </span>
                                        </td>

                                        <td className="sp-td">
                                            <span
                                                className={`sp-badge ${subscriber.isActive
                                                    ? "sp-badge--active"
                                                    : "sp-badge--inactive"
                                                    }`}
                                            >
                                                {subscriber.isActive ? (
                                                    <>
                                                        <UserCheck size={12} />
                                                        Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserX size={12} />
                                                        Inactive
                                                    </>
                                                )}
                                            </span>
                                        </td>

                                        <td className="sp-td">
                                            <span className="sp-date">
                                                {new Date(
                                                    subscriber.createdAt
                                                ).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedCount > 0 && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <span
                        style={{
                            fontSize: "0.78rem",
                            color: "#6b7280",
                        }}
                    >
                        {selectedCount} selected —{" "}
                        <span
                            onClick={clearSelection}
                            style={{
                                cursor: "pointer",
                                textDecoration: "underline",
                                color: "#9ca3af",
                            }}
                        >
                            clear
                        </span>
                    </span>
                </div>
            )}

            {modalOpen && (
                <NewsletterModal
                    selectedCount={selectedCount}
                    onClose={closeModal}
                    onSend={handleSend}
                />
            )}
        </div>
    );
};

export default SubscribersPage;