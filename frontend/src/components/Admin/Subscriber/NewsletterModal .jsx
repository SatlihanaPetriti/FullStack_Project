import { useState } from "react";
import { Send, UserCheck, X } from "lucide-react";

import "./newsletter.css";

const NewsletterModal = ({ selectedCount, onClose, onSend }) => {
    const [form, setForm] = useState({
        subject: "",
        message: "",
    });

    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const subject = form.subject.trim();
    const message = form.message.trim();

    const isValid = subject && message;
    const buttonClass = isValid ? "active" : "disabled";

    const updateField = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSend = async () => {
        if (!isValid || sending) return;

        setSending(true);

        await onSend({
            subject,
            message,
        });

        setSending(false);
        setSent(true);

        setTimeout(() => {
            onClose();
        }, 1500);
    };

    return (
        <div className="newsletter-overlay" onClick={onClose}>
            <div
                className="newsletter-modal"
                onClick={(e) => e.stopPropagation()}
            >
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

                <div className="newsletter-body">
                    <div className="newsletter-field">
                        <label>Subject</label>

                        <input
                            type="text"
                            name="subject"
                            value={form.subject}
                            onChange={updateField}
                            placeholder="e.g. Weekly Update — May 2025"
                            className="newsletter-input"
                        />
                    </div>

                    <div className="newsletter-field">
                        <label>Message</label>

                        <textarea
                            name="message"
                            value={form.message}
                            onChange={updateField}
                            placeholder="Write your newsletter content here..."
                            rows={6}
                            className="newsletter-textarea"
                        />

                        <p className="newsletter-char-count">
                            {form.message.length} characters
                        </p>
                    </div>
                </div>

                <div className="newsletter-footer">
                    <button
                        onClick={onClose}
                        className="newsletter-cancel-btn"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSend}
                        disabled={!isValid || sending}
                        className={`newsletter-send-btn ${buttonClass}`}
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