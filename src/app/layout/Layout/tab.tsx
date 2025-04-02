import React, {useRef} from "react";
import useTabStore, {Panel, Tab} from './layoutStore';
import {useDrag} from "react-dnd";
import {IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type TabComponentProps = {
	tab: Tab,
	panel: Panel,
	handlePanelClick: (panelId: string, tabId?: string) => void,
}

const TabComponent = ({tab, panel, handlePanelClick}: TabComponentProps) => {
	
	const tabRef = useRef<HTMLDivElement | null>(null);
	
	const {removeTab} = useTabStore();
	
	const [, drag] = useDrag({
		type: 'TAB',
		item: {panelId: panel.id, tabId: tab.id},
	});
	
	drag(tabRef);
	
	return (
		<div
			ref={tabRef}
			className={`tab ${panel.activeTab === tab.id ? 'active' : ''}`}
			onClick={() => handlePanelClick(panel.id, tab.id)}
		>
			{tab.title}
			<IconButton onClick={() => removeTab(panel.id, tab.id)}>
				<CloseIcon/>
			</IconButton>
		</div>
	);
};

export default TabComponent;
