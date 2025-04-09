import React, {useEffect, useRef, useState} from "react";

const WS_URL = "ws://localhost:8081";

const ImageRendererComponent = () => {
	
	const [frame, setFrame] = useState<string | null>(null);
	const [detections, setDetections] = useState<any[]>([]);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	
	useEffect(() => {
		const socket = new WebSocket(WS_URL);
		
		socket.onopen = () => {
			console.log("✅ WebSocket connected");
		};
		
		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log("📦 Received:", data);
			
			// Update state with frame and detections
			setFrame(data.frame); // base64 image
			setDetections(data.objects); // List of detected objects
		};
		
		socket.onerror = (err) => {
			console.error("❌ WebSocket error:", err);
		};
		
		socket.onclose = () => {
			console.log("🔌 WebSocket closed");
		};
		
		return () => socket.close();
	}, []);
	
	// Function to draw bounding boxes on the canvas
	const drawBoundingBoxes = (ctx: CanvasRenderingContext2D, frame: string, detections: any[]) => {
		const img = new Image();
		img.src = `data:image/jpeg;base64,${frame}`;
		img.onload = () => {
			// Draw the image on the canvas
			ctx.drawImage(img, 0, 0);
			
			// Draw bounding boxes
			detections.forEach((obj) => {
				const [x1, y1, x2, y2] = obj.box;
				ctx.beginPath();
				ctx.rect(x1, y1, x2 - x1, y2 - y1);
				ctx.lineWidth = 2;
				ctx.strokeStyle = "green";
				ctx.fillStyle = "green";
				ctx.stroke();
				ctx.fillText(obj.class, x1, y1 - 10);
			});
		};
	};
	
	useEffect(() => {
		if (canvasRef.current && frame && detections.length > 0) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");
			if (ctx) {
				drawBoundingBoxes(ctx, frame, detections);
			}
		}
	}, [frame, detections]);
	
	return (
		<div>
			<h2>Detected Objects</h2>
			<canvas ref={canvasRef} width={640} height={480}/>
		</div>
	);
};

export default ImageRendererComponent;
