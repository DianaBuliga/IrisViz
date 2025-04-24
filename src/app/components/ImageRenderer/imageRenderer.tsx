import React, {useEffect, useRef, useState} from "react";
import {subscribeTo, unsubscribeFrom} from "../../websocket/websocket";
import {drawBoundingBoxes} from "./utils";
import './imageRenderer.scss';


const ImageRendererComponent = () => {
	
	const [frame, setFrame] = useState<string | null>(null);
	const [detections, setDetections] = useState<any[]>([]);
	const [imageSize, setImageSize] = useState<{ width: number, height: number } | null>(null);
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
		setImageSize({width: data.width, height: data.height});
	};
	
	const drawFrame = (
		canvas: HTMLCanvasElement,
		frame: string,
		detections: any[],
		originalSize: {
			width: number,
			height: number
		}
	) => {
		const img = new Image();
		const ctx = canvas.getContext("2d");
		
		if (!ctx) return;
		
		img.src = `data:image/jpeg;base64,${frame}`;
		img.onload = () => {
			
			const containerWidth = canvas.parentElement?.clientWidth || originalSize.width;
			const containerHeight = canvas.parentElement?.clientHeight || originalSize.height;
			const scale = Math.min(
				containerWidth / originalSize.width,
				containerHeight / originalSize.height
			);
			
			const scaledWidth = originalSize.width * scale;
			const scaledHeight = originalSize.height * scale;
			
			canvas.style.width = `${scaledWidth}px`;
			canvas.style.height = `${scaledHeight}px`;
			canvas.width = scaledWidth;
			canvas.height = scaledHeight;
			
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
			
			drawBoundingBoxes(ctx, detections, scale);
		};
	};
	
	useEffect(() => {
		if (canvasRef.current && frame && detections.length > 0 && imageSize) {
			const canvas = canvasRef.current;
			
			
			if (canvas) {
				drawFrame(canvas, frame, detections, imageSize);
			}
		}
	}, [frame, detections]);
	
	return (
		<div className='canvas'>
			<canvas ref={canvasRef}/>
		</div>
	);
};

export default ImageRendererComponent;
