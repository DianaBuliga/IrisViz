// layout.tsx
import React from 'react';
import useTabStore from './layoutStore';
import './layout.scss';
import LeftMenu from "../LeftMenu/leftMenu";
import Footer from "../Footer/footer";
import PanelComponent from "./panel"

const Layout = () => {
	const {panels, setActiveTab, moveTab, splitPanel, removeTab, setCurrentPanel} = useTabStore();
	
	const handlePanelClick = (panelId: string, tabId?: string) => {
		if (tabId) setActiveTab(panelId, tabId);
		setCurrentPanel(panelId);
	};
	
	return (
		<>
			<LeftMenu/>
			<div className="layout">
				{panels.map((panel) => (
					<PanelComponent key={panel.id} panel={panel} handlePanelClick={handlePanelClick}/>
				))}
			</div>
			<Footer/>
		</>
	);
};
export default Layout;