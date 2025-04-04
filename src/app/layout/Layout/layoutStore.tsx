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
	moveTab: (sourcePanelId: string, targetPanelId: string, tabId: string) => void;
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
		set((state) => {
			const updatedPanels = [...state.panels];
			
			// Helper to remove a panel by ID recursively
			const removeEmptyPanels = (panels: Panel[]): Panel[] => {
				return panels
					.map(panel => {
						if (panel.id === panelId) {
							const filteredTabs = panel.tabs.filter(tab => tab.id !== tabId);
							const isEmpty = filteredTabs.length === 0 && (!panel.children || panel.children.length === 0);
							return isEmpty ? null : {...panel, tabs: filteredTabs};
						}
						if (panel.children) {
							const newChildren = removeEmptyPanels(panel.children).filter(Boolean) as Panel[];
							return {...panel, children: newChildren};
						}
						return panel;
					})
					.filter(Boolean) as Panel[];
			};
			
			const cleanedPanels = removeEmptyPanels(updatedPanels);
			
			const newCurrent = cleanedPanels.length > 0 ? cleanedPanels[0].id : "";
			
			return {
				panels: cleanedPanels,
				currentPanel: state.currentPanel === panelId ? newCurrent : state.currentPanel,
			};
		});
	},
	
	setActiveTab: (panelId, tabId) => {
		set((state) => {
			const updateActiveTab = (panels: Panel[]): Panel[] =>
				panels.map((panel) => {
					if (panel.id === panelId) {
						return {...panel, activeTab: tabId};
					}
					if (panel.children) {
						return {...panel, children: updateActiveTab(panel.children)};
					}
					return panel;
				});
			
			return {panels: updateActiveTab(state.panels)};
		});
	},
	
	moveTab: (fromPanelId, toPanelId, tabId) =>
		set((state) => {
			let tabToMove: Tab | undefined;
			
			const updatePanels = (panels: Panel[]): Panel[] =>
				panels.map(panel => {
					// Remove tab from source panel
					if (panel.id === fromPanelId) {
						const filteredTabs = panel.tabs.filter(tab => {
							if (tab.id === tabId) {
								tabToMove = tab;
								return false;
							}
							return true;
						});
						return {...panel, tabs: filteredTabs};
					}
					
					// Traverse children if exist
					if (panel.children) {
						return {
							...panel,
							children: updatePanels(panel.children),
						};
					}
					
					return panel;
				});
			
			const addTabToTarget = (panels: Panel[]): Panel[] =>
				panels.map(panel => {
					if (panel.id === toPanelId && tabToMove) {
						return {
							...panel,
							tabs: [...panel.tabs, tabToMove],
							activeTab: tabToMove.id,
						};
					}
					if (panel.children) {
						return {
							...panel,
							children: addTabToTarget(panel.children),
						};
					}
					return panel;
				});
			
			let newPanels = updatePanels(state.panels);
			newPanels = addTabToTarget(newPanels);
			
			return {panels: newPanels};
		}),
	setCurrentPanel: (panelId: string) => {
		set((state) => {
			const panelExists = (panels: Panel[]): boolean =>
				panels.some(
					(panel) =>
						panel.id === panelId ||
						(panel.children && panelExists(panel.children))
				);
			
			if (panelExists(state.panels)) {
				return {currentPanel: panelId};
			}
			
			return {}; // panel doesn't exist
		});
	},
	splitPanel: (panelId, splitType, tabId) => {
		set((state) => {
			const panel = state.panels.find((p) => p.id === panelId);
			if (!panel) return state;
			
			const tab = panel.tabs.find((t) => t.id === tabId);
			if (!tab) return state;
			
			let newPanels = state.panels.map((panel) => {
				if (panel.id === panelId) {
					return {...panel, tabs: panel.tabs.filter((t) => t.id !== tabId)};
				}
				return panel;
			});
			
			const newPanel: Panel = {
				id: uuidv4(),
				tabs: [tab],
				splitType: splitType,
				activeTab: tabId,
				children: [],
			};
			if (splitType === "horizontal") {
				newPanels = newPanels.map((p) =>
					p.id === panelId
						? {
							...p,
							children: [...(p.children || []), newPanel], // Add the new panel to the children array
						}
						: p
				);
			} else {
				newPanels.push(newPanel);
			}
			return {panels: newPanels};
		});
	},
}));

export default useTabStore;