import React, {useState} from "react";

import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

import TopMenu from "./layout/TopMenu/topMenu";
import Layout from "./layout/Layout/layout";

const App = () => {
	const [charts, setCharts] = useState<number[]>([]);
	const [idCounter, setIdCounter] = useState(1);
	
	return (
		<>
			<TopMenu/>
			
			<DndProvider backend={HTML5Backend}>
				<Layout/>
			</DndProvider>
		
		</>
	);
};

export default App;
