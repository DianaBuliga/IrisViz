export {};

declare global {
	interface Window {
		electron: {
			send: (channel: string, data?: any) => void;
			receive: (channel: string, callback: (...args: any[]) => void) => void;
		};
	}
}
