import React, {useState} from 'react';
import {Alert, Snackbar, Stack} from '@mui/material';
import {NotificationType, useNotifications} from "./notificationProvider";
import './notificationToaster.scss';

const NotificationToaster = () => {
	const {notifications} = useNotifications();
	
	const [hiddenNotifications, setHiddenNotifications] = useState<string[]>([]);
	
	const handleClose = (id: string) => {
		setHiddenNotifications((prev) => [...prev, id]);
	};
	
	return (
		<Stack
			spacing={1}
		>
			<Snackbar
				open={notifications.length > 0}
				anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
				autoHideDuration={4000}
				sx={{
					display: 'block',
					width: 'auto',
					marginBottom: '1rem',
				}}
			>
				<div>
					{notifications
						.filter((n) => !hiddenNotifications.includes(n.id))
						.map((notification: {
							id: string;
							type: NotificationType | undefined;
							message: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;
						}) => (
							<Alert
								key={notification.id}
								severity={notification.type}
								onClose={() => handleClose(notification.id)}
								sx={{
									backgroundColor: 'var(--background-transparent)',
									color: 'var(--primary-text)',
									border: '1px solid var(--border-color)',
									height: '2.3rem',
									fontSize: 'small',
									padding: '10px',
									overflow: 'hidden',
								}}
							>
								{notification.message}
							</Alert>
						))}
				</div>
			</Snackbar>
		</Stack>
	);
};

export default NotificationToaster;
