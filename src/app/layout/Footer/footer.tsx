import React from "react";
import {AppBar} from "@mui/material";
import './footer.scss';

const Footer = () => {
	return (
		<AppBar position="fixed" className="app-container">
			<div className="footer">
				© {new Date().getFullYear()} MyApp | All Rights Reserved
			</div>
		</AppBar>
	);
};

export default Footer;
