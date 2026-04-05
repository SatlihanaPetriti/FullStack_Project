const API_URL = "http://localhost:3000/mail/subscribe";

export const subscribeEmail = async (email) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error occurred while sending the email.");
    }

    return await response.json();
};