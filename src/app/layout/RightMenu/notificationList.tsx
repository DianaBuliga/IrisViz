import React, {useEffect} from 'react';
import {Drawer, IconButton, List, ListItem, ListItemText} from '@mui/material';
import {useNotifications} from '../../notification/notificationProvider';
import './notifications.scss';
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


type Props = {
	open: boolean;
	onClose: () => void;
};

const NotificationListPanel: React.FC<Props> = ({open, onClose}) => {
	const {notifications} = useNotifications();
	
	useEffect(() => {
		console.log(notifications);
	}, [notifications]);
	
	return (
		<Drawer className='drawer' anchor="right" variant="persistent" open={open} onClose={onClose}>
			<div className='notificationPanel'>
				
				<div className='notificationPanelHeader'>
					<h3>Notifications</h3>
					<IconButton onClick={onClose}>
						<CloseIcon/>
					</IconButton>
				</div>
				
				<List className='notificationList'>
					{notifications.map((n) => (
						<ListItem key={n.id}>
							{n.type === 'error' && <ErrorIcon className="notificationIcon error"/>}
							{n.type === 'warning' && <WarningIcon className="notificationIcon warning"/>}
							{n.type === 'success' && <CheckCircleIcon className="notificationIcon success"/>}
							{n.type === 'info' && <InfoIcon className="notificationIcon info"/>}
							<ListItemText
								primary={n.message}
							/>
						</ListItem>
					))}
				</List>
			</div>
		</Drawer>
	);
};

export default NotificationListPanel;
