import React, {useState} from "react";
import {AppBar, Box, Button, Menu, MenuItem} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import HorizontalRuleRoundedIcon from '@mui/icons-material/HorizontalRuleRounded';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import './topMenu.scss';
import menuItems from "./menuTemplate";

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
	
	const [isMaximized, setIsMaximized] = useState(false);
	
	const toggleMaximize = () => {
		if (isMaximized) {
			window.electron.send('restore-window');
		} else {
			window.electron.send('maximize-window');
		}
		setIsMaximized(!isMaximized);
	};
	
	return (
		<>
			<AppBar className="topMenu">
				<div className="appBox">
					<div className="menuList">
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
											key={item.label}
											onClick={() => {
												if (item.action) {
													item.action();
												}
												handleClose();
											}}
											className="MenuItem"
										>
											<div>{item.label}</div>
											<div>{item.shortcut || ''}</div>
										</MenuItem>
									))}
								</Menu>
							</Box>
						))}
					</div>
					<div className="actionButtons">
						<HorizontalRuleRoundedIcon className="icon icon-left" onClick={() => {
							window.electron.send("minimize-window");
						}}/>
						<CheckBoxOutlineBlankOutlinedIcon className="icon icon-middle" onClick={() => toggleMaximize()}/>
						<CloseIcon className="icon icon-right" onClick={() => {
							window.electron.send("close-app");
						}}/>
					</div>
				</div>
			
			</AppBar>
		</>
	);
};

export default TopMenu;
