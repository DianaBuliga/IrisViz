import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const LeftMenu = () => {
	return (
		<List>
			{['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
				<ListItem key={text}>
					<ListItemIcon>
						{index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}
					</ListItemIcon>
					<ListItemText primary={text}/>
				</ListItem>
			))}
		</List>
	);
};

export default LeftMenu;