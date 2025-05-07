import log from "electron-log";

type MessageHandler = (data: any) => void;

interface WebSocketMessage {
	type: string;
	
	[key: string]: any;
}

const subscribers: Record<string, MessageHandler[]> = {};
const lastMessages: Record<string, any> = {};

const socket = new WebSocket('ws://localhost:8081');

socket.onopen = () => {
	log.info('Connected to server');
};

socket.onmessage = (event: MessageEvent) => {
	try {
		const data: WebSocketMessage = JSON.parse(event.data);
		
		if (!data) return;
		
		if (Array.isArray(data)) {
			data.forEach((item: any) => {
				const {type} = item;
				
				if (type) {
					lastMessages[type] = item;
					if (subscribers[type]) {
						subscribers[type].forEach((callback) => callback(item));
					}
				}
			});
		} else {
			const {type} = data;
			
			if (type) {
				lastMessages[type] = data;
				if (subscribers[type]) {
					subscribers[type].forEach((callback) => callback(data));
				}
			}
		}
		
	} catch (err) {
		log.error('Could not parsing WebSocket message');
		console.error(" Error parsing WebSocket message:", err);
	}
};

export function subscribeTo(type: string, callback: MessageHandler): void {
	if (!subscribers[type]) {
		subscribers[type] = [];
	}
	subscribers[type].push(callback);
	
	if (lastMessages[type]) {
		callback(lastMessages[type]);
	}
}

export function unsubscribeFrom(type: string, callback: MessageHandler): void {
	if (subscribers[type]) {
		subscribers[type] = subscribers[type].filter((cb) => cb !== callback);
	}
}

export function sendMessage(message: WebSocketMessage): void {
	if (socket.readyState === WebSocket.OPEN) {
		socket.send(JSON.stringify(message));
		log.info('Sent message', message);
	} else {
		log.warn('WebSocket not ready. Message not sent');
		console.warn("WebSocket not ready. Message not sent:", message);
	}
}
