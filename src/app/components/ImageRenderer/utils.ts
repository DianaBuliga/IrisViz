const getBoxStyle = (classType: string) => {
	switch (classType) {
		case "car":
			return "red";
		case "person":
			return "green";
		case "traffic light":
			return "yellow";
		case "bicycle":
			return "purple";
		case "motorcycle":
			return "blue";
		case "bus":
			return "cyan";
		case "truck":
			return "magenta";
		default:
			return "";
	}
};

export const drawBoundingBoxes = (ctx: CanvasRenderingContext2D, detections: any[], scale: number = 1) => {
	detections.forEach((obj) => {
		const [x1, y1, x2, y2] = obj.box.map((coordinate: any) => coordinate * scale);
		ctx.beginPath();
		ctx.rect(x1, y1, x2 - x1, y2 - y1);
		ctx.lineWidth = 1.8;
		ctx.strokeStyle = getBoxStyle(obj.class);
		ctx.fillStyle = getBoxStyle(obj.class);
		ctx.stroke();
		ctx.fillText(obj.class, x1, y1 - 10);
	});
}