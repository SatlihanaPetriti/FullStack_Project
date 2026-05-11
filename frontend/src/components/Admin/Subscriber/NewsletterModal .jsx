import { useState } from "react";
import { Send, UserCheck, X } from "lucide-react";
import "./newsletter.css";

const NewsletterModal = ({ selectedCount, onClose, onSend }) => {
    const [form, setForm] = useState({ subject: "", message: "" });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSend = async () => {
        if (!form.subject.trim() || !form.message.trim() || sending) return;
        setSending(true);
        await onSend(form);
        setSending(false);
        setSent(true);
        setTimeout(() => { setSent(false); onClose(); }, 1500);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="newsletter-overlay" onClick={onClose}>
            <div
                className="newsletter-modal"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="newsletter-header">
                    <div className="newsletter-header-left">
                        <div className="newsletter-icon-box">
                            <Send size={15} />
                        </div>

                        <div>
                            <p className="newsletter-title">
                                Send Newsletter
                            </p>

                            <p className="newsletter-subtitle">
                                {selectedCount} subscriber
                                {selectedCount !== 1 ? "s" : ""} selected
                            </p>
                        </div>
                    </div>

                    <button
                        className="newsletter-close-btn"
                        onClick={onClose}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="newsletter-body">

                    <div className="newsletter-field">
                        <label>Subject</label>

                        <input
                            type="text"
                            value={form.subject}
                            onChange={handleChange}
                            placeholder="e.g. Weekly Update — May 2025"
                            className="newsletter-input"
                            name="subject"
                        />
                    </div>

                    <div className="newsletter-field">
                        <label>Message</label>

                        <textarea
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Write your newsletter content here..."
                            rows={6}
                            className="newsletter-textarea"
                            name="message"
                        />

                        <p className="newsletter-char-count">
                            {form.message.length} characters
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="newsletter-footer">
                    <button
                        onClick={onClose}
                        className="newsletter-cancel-btn"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSend}
                        disabled={!form.subject.trim() || !form.message.trim() || sending}
                        className={`newsletter-send-btn ${form.subject.trim() && form.message.trim()
                            ? "active"
                            : "disabled"
                            }`}
                    >
                        {sent ? (
                            <>
                                <UserCheck size={14} />
                                Sent!
                            </>
                        ) : sending ? (
                            <>Sending...</>
                        ) : (
                            <>
                                <Send size={14} />
                                Send
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewsletterModal;