import React from 'react';
import useTabStore from './layoutStore';
import './layout.scss';
import LeftMenu from "../LeftMenu/leftMenu";
import Footer from "../Footer/footer";
import PanelComponent from "./panel"
import {PanelGroup} from 'react-resizable-panels';

const Layout = () => {
	const {panels} = useTabStore();
	
	return (
		<>
			<LeftMenu/>
			<PanelGroup direction='horizontal' className="customPanelGroup">
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