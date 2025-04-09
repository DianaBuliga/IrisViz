import React, {useEffect, useRef, useState} from "react";

const WS_URL = "ws://localhost:8081";

const ObjectDetectionViewer = () => {
	const [messages, setMessages] = useState<any[]>([]);
	const videoRef = useRef<HTMLImageElement | null>(null);
	
	useEffect(() => {
		const socket = new WebSocket(WS_URL);
		
		socket.onopen = () => {
			console.log("✅ WebSocket connected");
		};
		
		socket.onmessage = (event) => {
			console.log("📦 Received:", event.data);
			const data = JSON.parse(event.data);
			console.log("📦 Received:", data);
			
			// Update messages for detection info
			setMessages((prev) => [...prev, data]);
			
			// Convert base64 string back to a Blob (image data)
			const imageData = atob(data.frame); // Decode base64 string to binary data
			const arrayBuffer = new ArrayBuffer(imageData.length);
			const uint8Array = new Uint8Array(arrayBuffer);
			
			// Fill the array with the binary data
			for (let i = 0; i < imageData.length; i++) {
				uint8Array[i] = imageData.charCodeAt(i);
			}
			
			// Create a Blob and generate a URL for the image
			const frameBlob = new Blob([uint8Array], {type: "image/jpeg"});
			const frameUrl = URL.createObjectURL(frameBlob);
			
			if (videoRef.current) {
				videoRef.current.src = frameUrl; // Set the src of the <img> tag
			}
		};
		
		socket.onerror = (err) => {
			console.error("❌ WebSocket error:", err);
		};
		
		socket.onclose = () => {
			console.log("🔌 WebSocket closed");
		};
		
		return () => socket.close();
	}, []);
	
	return (
		<div className="p-4">
			<h2 className="text-xl font-semibold mb-2">Detected Objects</h2>
			<div>
				<img ref={videoRef} alt="Detection Video" style={{width: "100%", maxHeight: "500px"}}/>
			</div>
			
			{messages.map((msg, i) => (
				<div key={i} className="border rounded p-2 mb-2">
					<div>🧾 Total: {msg.count}</div>
					{msg.objects.map((obj: any, j: number) => (
						<div key={j}>
							🔹 {obj.class} @ [{obj.box.join(", ")}]
						</div>
					))}
				</div>
			))}
		</div>
	);
};

export default ObjectDetectionViewer;
