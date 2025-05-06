import React, {useEffect} from "react";
import {subscribeTo, unsubscribeFrom} from "./websocket";
import {useNotifications} from "../notification/notificationProvider";

const WebsocketNotification = () => {
	
	const {addNotification} = useNotifications();
	
	useEffect(() => {
		const socket = new WebSocket("ws://localhost:8081");
		
		socket.onopen = () => {
			addNotification("Connected to server", "success");
		};
		
		return () => {
			socket.close();
			addNotification("Disconnected from server", "warning");
			
		};
	}, []);
	
	useEffect(() => {
		subscribeTo("response", handleMessage);
		
		return () => {
			unsubscribeFrom("response", handleMessage);
		};
	}, []);
	
	const handleMessage = (message: any) => {
		addNotification(message.message, message.status);
	};
	
	return <></>;
}

export default WebsocketNotification;