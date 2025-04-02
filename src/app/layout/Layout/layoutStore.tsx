import create from 'zustand';
import {v4 as uuidv4} from 'uuid';
import React, {JSX} from "react";

export type Tab = {
	id: string;
	title: string;
	icon: React.ReactNode;
	component: JSX.Element;
};

export type Panel = {
	id: string;
	activeTab: string;
	tabs: Tab[];
	splitType?: 'horizontal' | 'vertical';
	children?: Panel[];
};

type TabStore = {
	panels: Panel[];
	currentPanel: string;
	addTab: (panelId: string, title: string, icon: React.ReactNode, component: JSX.Element) => void;
	removeTab: (panelId: string, tabId: string) => void;
	setActiveTab: (panelId: string, tabId: string) => void;
	moveTab: (sourcePanelId: string, targetPanelId: string, tabId: string, shouldSplit: boolean, splitType: 'horizontal' | 'vertical') => void;
	splitPanel: (panelId: string, splitType: 'horizontal' | 'vertical', tabId: string) => void;
	setCurrentPanel: (panelId: string) => void;
};

const firstId = uuidv4();

const useTabStore = create<TabStore>((set) => ({
	panels: [{id: firstId, activeTab: '', tabs: []}],
	currentPanel: firstId,
	addTab: (panelId, title, icon, component) => {
		set((state) => ({
			panels: state.panels.map((panel) =>
				panel.id === panelId
					? {
						...panel,
						tabs: [...panel.tabs, {id: uuidv4(), title, icon, component}],
						activeTab: panel.tabs.length ? panel.tabs[0].id : '',
					}
					: panel
			),
		}));
	},
	
	removeTab: (panelId, tabId) => {
		set((state) => ({
			panels: state.panels.map((panel) =>
				panel.id === panelId
					? {...panel, tabs: panel.tabs.filter((tab) => tab.id !== tabId)}
					: panel
			),
		}));
	},
	
	setActiveTab: (panelId, tabId) => {
		set((state) => ({
			panels: state.panels.map((panel) =>
				panel.id === panelId ? {...panel, activeTab: tabId} : panel
			),
		}));
	},
	
	moveTab: (fromPanelId, toPanelId, tabId, shouldSplit = false, splitType = 'horizontal') =>
		set((state) => {
			let tabToMove: Tab | undefined;
			let newPanels = state.panels.map((panel) => {
				if (panel.id === fromPanelId) {
					const tab = panel.tabs.find((t) => t.id === tabId);
					if (tab) tabToMove = tab;
					return {...panel, tabs: panel.tabs.filter((t) => t.id !== tabId)};
				}
				return panel;
			});
			
			if (tabToMove) {
				if (shouldSplit) {
					// Create a new panel for the tab
					const newPanel: Panel = {
						id: uuidv4(), // Unique ID
						tabs: [tabToMove],
						splitType: splitType, // or "vertical"
						activeTab: tabToMove.id,
						children: [],
					};
					newPanels.push(newPanel);
				} else {
					// Move the tab to the existing panel
					newPanels = newPanels.map((panel) =>
						panel.id === toPanelId ? {...panel, tabs: [...panel.tabs, tabToMove!]} : panel
					);
				}
			}
			
			return {panels: newPanels};
		}),
	setCurrentPanel: (panelId: string) => {
		set(() => ({currentPanel: panelId}));
	},
	splitPanel: (panelId, splitType, tabId) => {
		set((state) => {
			const panel = state.panels.find((p) => p.id === panelId);
			if (!panel) return state;
			
			const tab = panel.tabs.find((t) => t.id === tabId);
			if (!tab) return state;
			
			return {
				panels: state.panels.map((p) =>
					p.id === panelId
						? {
							...p,
							splitType,
							children: [
								{...p, children: undefined, splitType: splitType},
								{id: uuidv4(), activeTab: tab.id, tabs: [tab]},
							],
						}
						: p
				),
			};
		});
	},
}));

export default useTabStore;