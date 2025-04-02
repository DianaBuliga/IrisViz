import React, {useRef} from "react";
import {useDrop} from "react-dnd";
import TabComponent from "./tab";
import useTabStore, {Panel, Tab} from "./layoutStore";

type PanelComponentProps = {
	panel: Panel,
	handlePanelClick: (panelId: string, tabId?: string) => void,
}

const PanelComponent = ({panel, handlePanelClick}: PanelComponentProps) => {
	const panelRef = useRef<HTMLDivElement | null>(null);
	
	const {moveTab} = useTabStore();
	
	const [, drop] = useDrop({
		accept: 'TAB',
		drop: (item: { panelId: string; tabId: string }, monitor) => {
			if (monitor.didDrop()) return;
			
			const panelRect = panelRef.current?.getBoundingClientRect();
			const clientOffset = monitor.getClientOffset();
			
			if (panelRect && clientOffset) {
				const isHorizontalMiddle = clientOffset.y > panelRect.top + panelRect.height / 2;
				const splitType = isHorizontalMiddle ? "horizontal" : "vertical";
				console.log(splitType, clientOffset.y, panelRect, isHorizontalMiddle);
				console.log(panelRect.top, panelRect.height / 2);
				
				
				moveTab(item.panelId, panel.id, item.tabId, true, splitType);
			}
		},
	});
	drop(panelRef);
	
	return (
		<div
			ref={panelRef}
			className={`panel ${panel.splitType}`}
			onClick={() => handlePanelClick(panel.id)}
			style={{
				display: panel.splitType === "horizontal" ? "block" : "flex",
				flexDirection: panel.splitType === "horizontal" ? "row" : "column",
				height: "100%", // Ensure panel takes full height
			}}
		>
			<div className="tabHeader">
				{panel.tabs.map((tab) => (
					<TabComponent key={tab.id} tab={tab} panel={panel} handlePanelClick={handlePanelClick}/>
				))}
			</div>
			<div className="content">{panel.tabs.find((t: Tab) => t.id === panel.activeTab)?.component}</div>
			{panel.children?.map((childPanel: Panel) => (
				<PanelComponent key={childPanel.id} panel={childPanel} handlePanelClick={handlePanelClick}/>
			))}
		</div>
	);
};

export default PanelComponent;