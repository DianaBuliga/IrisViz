import React from 'react';
import ReactDOM from 'react-dom/client';
import TopMenu from "./layout/TopMenu";
import "./global.scss";

const App = () => {
	return (
		<>
			<TopMenu/>
		</>
	);
};

const rootElement = document.getElementById('root');

if (rootElement) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<App/>
		</React.StrictMode>
	);
}
