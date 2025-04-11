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
	
	const drawFrame = (ctx: CanvasRenderingContext2D, frame: string, detections: any[]) => {
		const img = new Image();
		img.src = `data:image/jpeg;base64,${frame}`;
		img.onload = () => {
			ctx.drawImage(img, 0, 0);
			console.log(img);
			
			drawBoundingBoxes(ctx, detections);
		};
	};
	
	useEffect(() => {
		if (canvasRef.current && frame && detections.length > 0) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");
			if (ctx) {
				drawFrame(ctx, frame, detections);
			}
		}
	}, [frame, detections]);
	
	return (
		<div>
			<canvas ref={canvasRef} width={640} height={480}/>
		</div>
	);
};

export default ImageRendererComponent;
