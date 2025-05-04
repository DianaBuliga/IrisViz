import React, {JSX, useEffect, useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {subscribeTo, unsubscribeFrom} from "../../websocket/websocket";

const indentStyle = (level: number) => ({
	paddingLeft: `${level * 16}px`,
	fontWeight: level === 0 ? 600 : 400,
});

const renderRows = (
	label: string,
	obj: any,
	level: number = 0
): JSX.Element[] => {
	const rows: JSX.Element[] = [];
	
	rows.push(
		<TableRow key={`${label}-${level}`}>
			<TableCell style={indentStyle(level)}>{label}</TableCell>
			<TableCell>{typeof obj === "object" ? "" : obj}</TableCell>
		</TableRow>
	);
	
	if (typeof obj === "object" && obj !== null) {
		for (const [key, value] of Object.entries(obj)) {
			rows.push(...renderRows(key, value, level + 1));
		}
	}
	
	return rows;
};

const TableComponent = () => {
	
	const [message, setMessage] = useState({});
	
	useEffect(() => {
		subscribeTo("data", handleMessage);
		
		return () => {
			unsubscribeFrom("data", handleMessage);
		};
	}, []);
	
	const handleMessage = (data: any) => {
		setMessage(data);
	};
	
	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell><strong>Label</strong></TableCell>
						<TableCell><strong>Value</strong></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{Object.entries(message).map(([label, obj]) =>
						renderRows(label, obj)
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default TableComponent;