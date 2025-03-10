import React, {useState} from "react";
import {AppBar, Box, Button, Menu, MenuItem, Typography} from "@mui/material";
import './TopMenu.scss';

const menuItems: { [key: string]: string[] } = {
	File: ["New File", "Open File", "Save", "Exit"],
	Edit: ["Undo", "Redo", "Cut", "Copy", "Paste"],
	View: ["Zoom In", "Zoom Out", "Reset Layout"],
	Help: ["About", "Documentation", "Report Issue"],
};

const TopMenu = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [openMenu, setOpenMenu] = useState<string | null>(null);
	
	const handleOpen = (event: { currentTarget: React.SetStateAction<HTMLElement | null> }, menuItem: string) => {
		setAnchorEl(event.currentTarget);
		setOpenMenu(menuItem);
	};
	
	const handleClose = () => {
		setAnchorEl(null);
		setOpenMenu(null);
	};
	
	return (
		<>
			<AppBar>
				<div className="AppBox">
					{Object.keys(menuItems).map((itemMenu) => (
						<Box key={itemMenu} className="menu-box">
							<Button
								onClick={(event) => handleOpen(event, itemMenu)}
								aria-controls={openMenu === itemMenu ? "menu" : "undefined"}
								aria-haspopup="true"
								className="MenuButton"
							>
								{itemMenu}
							</Button>
							<Menu
								anchorEl={anchorEl}
								open={openMenu === itemMenu}
								onClose={handleClose}
							>
								{menuItems[itemMenu].map((item) => (
									<MenuItem
										key={item}
										onClick={() => {
											console.log(item);
											handleClose();
										}}
									>
										<Typography variant="body2">{item}</Typography>
									</MenuItem>
								))}
							</Menu>
						</Box>
					))}
				</div>
			</AppBar>
		</>
	);
};

export default TopMenu;