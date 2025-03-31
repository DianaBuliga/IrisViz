import React, {useState} from "react";
import TopMenu from "./layout/TopMenu/topMenu";
import Layout from "./layout/Layout/layout";

const App = () => {
	const [charts, setCharts] = useState<number[]>([]);
	const [idCounter, setIdCounter] = useState(1);
	
	const addChart = () => {
		setCharts([...charts, idCounter]);
		setIdCounter(idCounter + 1);
	};
	
	return (
		<>
			<TopMenu/>
			
			<Layout/>
		
		</>
	);
};

export default App;
