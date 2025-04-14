import React, {useRef} from "react";
import useTabStore, {Panel, Tab} from './layoutStore';
import {useDrag} from "react-dnd";
import {IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type TabComponentProps = {
	tab: Tab,
	panel: Panel,
}

const TabComponent = ({tab, panel}: TabComponentProps) => {
	
	const tabRef = useRef<HTMLDivElement | null>(null);
	
	const {removeTab, setActiveTab, currentPanel} = useTabStore();
	const isTabFocused = currentPanel === panel.id;
	const isTabActive = tab.id === panel.activeTab;
	
	const handleTabClick = (panelId: string, tabId: string) => {
		setActiveTab(panelId, tabId);
	}
	
	const [, drag] = useDrag({
		type: 'TAB',
		item: {panelId: panel.id, tabId: tab.id},
	});
	
	drag(tabRef);
	
	return (
		<div
			ref={tabRef}
			className={`tab ${isTabActive ? 'active' : ''} ${isTabFocused && isTabActive ? "focused" : ""}`}
			onClick={() => handleTabClick(panel.id, tab.id)}
		>
			<span className="tabIcon">{tab.icon}</span>
			<span className="tabTitle">{tab.title}</span>
			<IconButton className='tabClose' onClick={() => removeTab(panel.id, tab.id)}>
				<CloseIcon/>
			</IconButton>
		</div>
	);
};

export default TabComponent;
