import React, {useState} from "react";
import NotificationListPanel from "./notificationList";
import NotificationsIcon from '@mui/icons-material/Notifications';
import './rightMenu.scss';

const RightMenu = () => {
	const [isPanelOpen, setPanelOpen] = useState(false);
	
	return (
		<div className="rightMenu">
			<NotificationListPanel open={isPanelOpen} onClose={() => setPanelOpen(false)}/>
			<NotificationsIcon onClick={() => setPanelOpen(true)}/>
		</div>
	);
}

export default RightMenu;