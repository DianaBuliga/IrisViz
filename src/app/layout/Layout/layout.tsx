// Layout.tsx
import React from 'react';
import {IconButton} from '@mui/material';
import useTabStore from './layoutStore';
import LeftMenu from "../LeftMenu/leftMenu"; // Import the Zustand store

const Layout = () => {
	const {tabs, activeTab, addTab, removeTab, setActiveTab} = useTabStore();
	
	return (
		<>
			<LeftMenu/>
			<div style={{marginLeft: '3rem', display: 'flex', flexDirection: 'column', marginTop: '2.2rem'}}>
				{/* Tab Header */}
				<div style={{
					display: 'flex',
					padding: '5px',
					backgroundColor: '#f0f0f0',
					borderBottom: '1px solid #ccc'
				}}>
					{tabs.map((tab: {
						id: React.Key | null | undefined;
						icon: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;
						title: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;
					}) => (
						<div
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							style={{
								display: 'flex',
								alignItems: 'center',
								padding: '5px 15px',
								cursor: 'pointer',
								backgroundColor: activeTab === tab.id ? '#ddd' : 'transparent',
								borderRadius: '5px',
								marginRight: '10px',
							}}
						>
							{tab.icon}
							<span style={{marginLeft: '8px'}}>{tab.title}</span>
							<IconButton size="small" onClick={() => removeTab(tab.id)} style={{marginLeft: '5px'}}>
								<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 96 960 960" width="16">
									<path d="M536 832L832 536 536 240 240 536 536 832Z"/>
								</svg>
							</IconButton>
						</div>
					))}
				</div>
				{/* Right Panel - Dynamically render selected tab component */}
				<div style={{border: '1px solid #ccc', padding: '10px', flex: 1}}>
					<div>{tabs.find((tab: { id: any; }) => tab.id === activeTab)?.component}</div>
				</div>
			
			</div>
		</>
	);
};

export default Layout;
