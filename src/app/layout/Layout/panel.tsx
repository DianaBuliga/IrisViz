import React, {useRef} from "react";
import {useDrop} from "react-dnd";
import TabComponent from "./tab";
import useTabStore, {Panel, Tab} from "./layoutStore";
import {Panel as PanelResizable, PanelResizeHandle} from 'react-resizable-panels';

type PanelComponentProps = {
	panel: Panel,
}

const PanelComponent = ({panel}: PanelComponentProps) => {
	const panelRef = useRef<HTMLDivElement | null>(null);
	
	const {moveTab, splitPanel, setCurrentPanel} = useTabStore();
	
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
					const splitType = isHorizontalMiddle ? "horizontal" : "vertical";
					splitPanel(item.panelId, splitType, item.tabId);
				}
			}
		},
	});
	drop(panelRef);
	
	return (
		<>
			<PanelResizable>
				<div
					ref={panelRef}
					className={`panel ${panel.splitType}`}
				>
					<div className="tabHeader"
					     onClick={() => handlePanelClick(panel.id)}>
						{panel.tabs.map((tab) => (
							<TabComponent key={tab.id} tab={tab} panel={panel}/>
						))}
					</div>
					<div className="content"
					     onClick={() => {
						     handlePanelClick(panel.id);
					     }}>
						{panel.tabs.find((t: Tab) => t.id === panel.activeTab)?.component}
					</div>
					{panel.children?.map((childPanel: Panel) => (
						<PanelComponent key={childPanel.id} panel={childPanel}/>
					))}
				</div>
			</PanelResizable>
			<PanelResizeHandle/>
		</>
	);
};

export default PanelComponent;