import React, {useEffect, useRef, useState} from "react";
import {subscribeTo, unsubscribeFrom} from "../../websocket/websocket";
import {drawBoundingBoxes} from "./utils";


const ImageRendererComponent = () => {
	
	const [frame, setFrame] = useState<string | null>(null);
	const [detections, setDetections] = useState<any[]>([]);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	
	useEffect(() => {
		subscribeTo("image", handleMessage);
		
		return () => {
			unsubscribeFrom("image", handleMessage);
		};
	}, []);
	
	const handleMessage = (data: any) => {
		setFrame(data.frame);
		setDetections(data.objects);
	};
	
	const drawFrame = (canvas: HTMLCanvasElement, frame: string, detections: any[]) => {
		const img = new Image();
		const ctx = canvas.getContext("2d");
		
		if (!ctx) return;
		
		img.src = `data:image/jpeg;base64,${frame}`;
		img.onload = () => {
			console.log(img.width, img.height);
			canvas.width = img.width / 10;
			canvas.height = img.height / 10;
			
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			drawBoundingBoxes(ctx, detections);
		};
	};
	
	useEffect(() => {
		if (canvasRef.current && frame && detections.length > 0) {
			const canvas = canvasRef.current;
			
			
			if (canvas) {
				drawFrame(canvas, frame, detections);
			}
		}
	}, [frame, detections]);
	
	return (
		<div>
			<canvas ref={canvasRef}/>
		</div>
	);
};

export default ImageRendererComponent;
