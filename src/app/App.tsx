import React from "react";

import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

import TopMenu from "./layout/TopMenu/topMenu";
import RightMenu from "./layout/RightMenu/rightMenu";
import Layout from "./layout/Layout/layout";
import {NotificationProvider} from "./notification/notificationProvider";
import NotificationToaster from "./notification/notificationToaster";
import WebsocketNotification from "./websocket/websocketNotification";
import Footer from "./layout/Footer/footer";

const App = () => {
	
	
	return (
		<NotificationProvider>
			<NotificationToaster/>
			<WebsocketNotification/>
			<>
				<TopMenu/>
				
				<DndProvider backend={HTML5Backend}>
					<Layout/>
				</DndProvider>
				
				<RightMenu/>
				<Footer/>
			
			</>
		</NotificationProvider>
	
	);
};

export default App;
