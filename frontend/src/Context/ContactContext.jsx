import { createContext, useContext, useState } from 'react';
import { send_contact_message_service } from '../Services/ContactService';

const ContactContext = createContext({});

const ContactProvider = ({ children }) => {
    const [success, setSuccess] = useState(null);

    const sendMessage = async (messageData) => {
        setSuccess(null);
        try {
            await send_contact_message_service(messageData);
            setSuccess(true);
        } catch (error) {
            setSuccess(false);
            throw error;
        }
    };
    const values = { success, sendMessage };


    return (
        <ContactContext.Provider value={values}>
            {children}
        </ContactContext.Provider>
    );
};

export const useContactContext = () => useContext(ContactContext);

export { ContactProvider, ContactContext };