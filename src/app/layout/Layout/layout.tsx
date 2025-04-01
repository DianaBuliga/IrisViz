import React, {useState} from 'react';
import {IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import useTabStore from './layoutStore';
import LeftMenu from "../LeftMenu/leftMenu"; // Import the Zustand store
import './layout.scss';
import Footer from "../Footer/footer";

const Layout = () => {
	const {panels, removeTab, setActiveTab, reorderTabs, addPanel, removePanel, setLastClickedPanel} = useTabStore();
	const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null); // State to track the hovered tab index
	
	const handleDragStart = (e: React.DragEvent<HTMLDivElement>, panelId: string, index: number) => {
		e.dataTransfer.setData('tabIndex', index.toString());
		e.dataTransfer.setData('panelId', panelId);
		(e.target as HTMLDivElement).style.opacity = '0.5';
	};
	
	const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
		e.preventDefault();
		setDraggedOverIndex(index);
	};
	
	const handleDrop = (e: React.DragEvent<HTMLDivElement>, panelId: string, index: number) => {
		e.preventDefault();
		const draggedIndex = parseInt(e.dataTransfer.getData('tabIndex'), 10);
		const draggedPanelId = e.dataTransfer.getData('panelId');
		if (draggedPanelId !== panelId) {
		} else if (draggedIndex !== index) {
			reorderTabs(panelId, draggedIndex, index);
		}
		setDraggedOverIndex(null);
	};
	
	const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
		(e.target as HTMLDivElement).style.opacity = '1';
		setDraggedOverIndex(null);
	};
	
	return (
		<>
			<LeftMenu/>
			<div className="layout">
				<div className="panels">
					{panels.map((panel) => (
						<div key={panel.id} className="panel">
							<div className="tabHeader">
								{panel.tabs.map((tab, index) => (
									<div
										key={tab.id}
										draggable
										onDragStart={(e) => handleDragStart(e, panel.id, index)}
										onDragOver={(e) => handleDragOver(e, index)}
										onDrop={(e) => handleDrop(e, panel.id, index)}
										onDragEnd={handleDragEnd}
										onClick={() => {
											setActiveTab(panel.id, tab.id);
											setLastClickedPanel(panel.id);
										}}
										className={`headerComponent ${panel.activeTab === tab.id ? 'active' : ''}`}
										style={{borderBottom: panel.activeTab === tab.id ? '3px solid var(--third-accent)' : 'none'}}
									>
										<span className="tabIcon">{tab.icon}</span>
										<span className="tabTitle">{tab.title}</span>
										<IconButton className="tabClose" onClick={() => removeTab(panel.id, tab.id)}>
											<CloseIcon/>
										</IconButton>
									</div>
								))}
							</div>
							<div className="tabComponent">
								<div>{panel.tabs.find((tab) => tab.id === panel.activeTab)?.component}</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<Footer/>
		</>
	);
};

export default Layout;
