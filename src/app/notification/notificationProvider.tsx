import React, {createContext, useContext, useState} from 'react';
import {v4 as uuidv4} from "uuid";

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

type Notification = {
	id: string;
	message: string;
	type: NotificationType;
};

type NotificationContextType = {
	notifications: Notification[];
	addNotification: (msg: string, type: NotificationType) => void;
	removeNotification: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({children}: { children: React.ReactNode }) => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	
	const addNotification = (message: string, type: NotificationType) => {
		const id = uuidv4();
		setNotifications((prev) => [...prev, {id, message, type}]);
	};
	
	const removeNotification = (id: string) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	};
	
	return (
		<NotificationContext.Provider value={{notifications, addNotification, removeNotification}}>
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotifications = () => {
	const context = useContext(NotificationContext);
	if (!context) throw new Error("useNotifications must be used within a NotificationProvider");
	return context;
};
