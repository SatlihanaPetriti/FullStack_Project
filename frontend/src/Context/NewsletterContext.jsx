import { createContext, useContext, useState } from "react";
import { subscribeEmail } from "../Services/NewsletterService";

const NewsletterContext = createContext();

export function NewsletterProvider({ children }) {
    const [status, setStatus] = useState("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const subscribe = async (email) => {
        if (!email || !email.includes('@')) {
            setErrorMsg("Please enter a valid email address.");
            setStatus("error");
            return;
        }

        setStatus("loading");
        try {
            await subscribeEmail(email);
            setStatus("success");
        } catch (err) {
            setErrorMsg(err.message || "something went wrong. Please try again.");
            setStatus("error");
        }
    };

    const reset = () => {
        setStatus("idle");
        setErrorMsg("");
    };

    return (
        <NewsletterContext.Provider value={{ status, errorMsg, subscribe, reset }}>
            {children}
        </NewsletterContext.Provider>
    );
}

export function useNewsletter() {
    return useContext(NewsletterContext);
}