// layout.tsx
import React from 'react';
import useTabStore from './layoutStore';
import './layout.scss';
import LeftMenu from "../LeftMenu/leftMenu";
import Footer from "../Footer/footer";
import PanelComponent from "./panel"
import {PanelGroup} from 'react-resizable-panels';

const Layout = () => {
	const {panels, setActiveTab, setCurrentPanel} = useTabStore();
	
	return (
		<>
			<LeftMenu/>
			<PanelGroup direction='horizontal'>
				<div className="layout">
					{panels.map((panel) => (
						<PanelComponent key={panel.id} panel={panel}/>
					))}
				
				</div>
			
			</PanelGroup>
			<Footer/>
		</>
	);
};
export default Layout;