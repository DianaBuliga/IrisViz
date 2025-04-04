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
	
	const {removeTab, setActiveTab} = useTabStore();
	
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
			className={`tab ${panel.activeTab === tab.id ? 'active' : ''}`}
			onClick={() => handleTabClick(panel.id, tab.id)}
		>
			{tab.title}
			<IconButton onClick={() => removeTab(panel.id, tab.id)}>
				<CloseIcon/>
			</IconButton>
		</div>
	);
};

export default TabComponent;
