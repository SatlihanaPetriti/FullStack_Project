import { createContext, useContext, useState, useEffect } from "react";
import {
    get_subscribers_service,
    subscribe_service,
    unsubscribe_service,
    send_newsletter_service,
} from "../Services/NewsletterService";

const NewsletterContext = createContext();

export function NewsletterProvider({ children }) {
    const [subscribers, setSubscribers] = useState([]);
    const [status, setStatus] = useState("idle");
    const [errorMsg, setErrorMsg] = useState("");

    // GET SUBSCRIBERS
    const getSubscribers = async () => {
        try {
            const res = await get_subscribers_service();
            setSubscribers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const reset = () => {
        setStatus("idle");
        setErrorMsg("");
    };

    const subscribe = async (email) => {
        if (!email || !email.includes("@")) {
            setErrorMsg("Invalid email");
            setStatus("error");
            return;
        }

        setStatus("loading");
        setErrorMsg("");

        try {
            await subscribe_service(email);
            setStatus("success");
            getSubscribers();
        } catch (err) {
            setErrorMsg(err?.response?.data?.message || "Error");
            setStatus("error");
        }
    };


    const unsubscribe = async (email) => {
        try {
            await unsubscribe_service(email);
            getSubscribers();
        } catch (err) {
            console.error(err);
        }
    };

    const sendNewsletter = async (data) => {
        setStatus("loading");
        setErrorMsg("");

        try {
            const res = await send_newsletter_service(data);
            setStatus("success");
            return res.data;
        } catch (err) {
            setErrorMsg(err?.response?.data?.message || "Error sending");
            setStatus("error");
        }
    };

    useEffect(() => {
        getSubscribers();
    }, []);

    return (
        <NewsletterContext.Provider
            value={{
                subscribers,
                status,
                errorMsg,
                getSubscribers,
                subscribe,
                unsubscribe,
                sendNewsletter,
                reset,
            }}
        >
            {children}
        </NewsletterContext.Provider>
    );
}

// ⚠️ KJO DUHET TË PËRPUTHET ME UI TËN
export function useNewsletter() {
    return useContext(NewsletterContext);
}