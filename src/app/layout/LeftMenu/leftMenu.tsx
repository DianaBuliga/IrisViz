import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import components from "../../components/components";
import './leftMenu.scss';
import useTabStore from "../Layout/layoutStore";

const LeftMenu = () => {
	
	const {addTab, currentPanel} = useTabStore();
	
	return (
		<List className="leftMenu">
			{components.map((item, index) => (
				<ListItem key={index} className='listItem'
				          onClick={() => addTab(currentPanel, item.title, item.icon, item.component)}>
					<ListItemIcon>
						{item.icon}
					</ListItemIcon>
				</ListItem>
			))}
		</List>
	);
};

export default LeftMenu;