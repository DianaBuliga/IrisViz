import React, {useRef} from "react";
import {useDrop} from "react-dnd";
import TabComponent from "./tab";
import useTabStore, {Panel, Tab} from "./layoutStore";
import {Panel as ResizablePanel, PanelGroup, PanelResizeHandle} from 'react-resizable-panels';

type PanelComponentProps = {
	panel: Panel,
}

const PanelComponent = ({panel}: PanelComponentProps) => {
	const panelRef = useRef<HTMLDivElement | null>(null);
	
	const {moveTab, splitPanel, setCurrentPanel, panels} = useTabStore();
	
	const handlePanelClick = (panelId: string) => {
		setCurrentPanel(panelId);
	}
	
	const [, drop] = useDrop({
		accept: 'TAB',
		drop: (item: { panelId: string; tabId: string }, monitor) => {
			if (monitor.didDrop()) return;
			
			const panelRect = panelRef.current?.getBoundingClientRect();
			const clientOffset = monitor.getClientOffset();
			
			let shouldSplit = true;
			
			if (panelRect && clientOffset) {
				const isOverHeader = clientOffset.y < panelRect.top + 40; // Adjust this value to suit the height of your panel header
				if (isOverHeader) {
					// Move the tab to this panel (do not split)
					moveTab(item.panelId, panel.id, item.tabId);
				} else {
					// Split the panel (this behavior can remain as it was before)
					const isHorizontalMiddle = clientOffset.y > panelRect.top + panelRect.height / 2;
					const splitType = isHorizontalMiddle ? "vertical" : "horizontal";
					
					console.log(splitType);
					splitPanel(panel.id, splitType, item.tabId);
				}
			}
		},
	});
	drop(panelRef);
	
	const renderSinglePanel = () => (
		<div
			ref={panelRef}
			className="panel"
			onClick={() => handlePanelClick(panel.id)}
		>
			<div className="tabHeader">
				{panel.tabs.map((tab) => (
					<TabComponent key={tab.id} tab={tab} panel={panel}/>
				))}
			</div>
			<div className="content">
				{panel.tabs.find((t: Tab) => t.id === panel.activeTab)?.component}
			</div>
		</div>
	);
	
	if (panel.children && panel.children.length > 0) {
		const direction = panel.splitType === "horizontal" ? "horizontal" : "vertical";
		
		return (
			<PanelGroup direction={direction} className="resizable-group">
				{panel.children.map((childPanel, index) => (
					<React.Fragment key={childPanel.id}>
						<ResizablePanel defaultSize={100 / (panel.children ? panel.children.length : 10)}>
							<PanelComponent panel={childPanel}/>
						</ResizablePanel>
						{panel.children && index < panel.children.length - 1 && <PanelResizeHandle/>}
					</React.Fragment>
				))}
			</PanelGroup>
		);
	}
	
	return (
		<ResizablePanel>
			{renderSinglePanel()}
		</ResizablePanel>
	);
};

export default PanelComponent;