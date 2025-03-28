import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
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
				</ListItem>
			))}
		</List>
	);
};

export default LeftMenu;