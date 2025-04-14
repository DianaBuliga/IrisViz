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

const cleanEmptyPanels = (panels: Panel[]): Panel[] => {
	return panels
		.map(panel => {
			let cleanedChildren = panel.children ? cleanEmptyPanels(panel.children) : undefined;
			
			// If it's a container with only one child, flatten it
			if (cleanedChildren && cleanedChildren.length === 1) {
				return cleanedChildren[0];
			}
			
			// Remove empty containers (no tabs, no children)
			if (panel.tabs.length === 0 && (!cleanedChildren || cleanedChildren.length === 0)) {
				return null;
			}
			
			return {
				...panel,
				children: cleanedChildren,
			};
		})
		.filter(Boolean) as Panel[];
};

const findPanelWithTab = (panels: Panel[], tabId: string): string | null => {
	for (const panel of panels) {
		if (panel.tabs.some(t => t.id === tabId)) return panel.id;
		if (panel.children) {
			const found = findPanelWithTab(panel.children, tabId);
			if (found) return found;
		}
	}
	return null;
};

const firstId = uuidv4();

const useTabStore = create<TabStore>((set) => ({
	panels: [{id: firstId, activeTab: '', tabs: []}],
	currentPanel: firstId,
	addTab: (panelId, title, icon, component) => {
		set((state) => {
			const newTab: Tab = {
				id: uuidv4(),
				title,
				icon,
				component,
			};
			
			const addTabToPanel = (panels: Panel[]): Panel[] =>
				panels.map((panel) => {
					if (panel.id === panelId) {
						return {
							...panel,
							tabs: [...panel.tabs, newTab],
							activeTab: newTab.id,
						};
					}
					if (panel.children) {
						return {
							...panel,
							children: addTabToPanel(panel.children),
						};
					}
					return panel;
				});
			
			return {
				panels: addTabToPanel(state.panels),
				currentPanel: panelId,
			};
		});
	},
	
	removeTab: (panelId, tabId) => {
		set((state) => {
			// Step 1: Actually remove the tab from the panels
			const removeTabFromPanels = (panels: Panel[]): Panel[] => {
				return panels.map(panel => {
					if (panel.id === panelId) {
						const filteredTabs = panel.tabs.filter(tab => tab.id !== tabId);
						return {
							...panel,
							tabs: filteredTabs,
							activeTab: filteredTabs.at(-1)?.id || '',
						};
					}
					if (panel.children) {
						return {
							...panel,
							children: removeTabFromPanels(panel.children),
						};
					}
					return panel;
				});
			};
			
			const updatedPanels = removeTabFromPanels(state.panels);
			
			// Step 2: Clean empty panels after removing the tab
			const cleanedPanels = cleanEmptyPanels(updatedPanels);
			
			const panelStillExists = cleanedPanels.some(p => p.id === state.currentPanel || p.children?.some(c => c.id === state.currentPanel));
			
			return {
				panels: cleanedPanels,
				currentPanel: panelStillExists ? state.currentPanel : (cleanedPanels[0]?.id || ''),
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
			newPanels = cleanEmptyPanels(newPanels);
			
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
	splitPanel: (targetPanelId, splitType, tabId) => {
		set((state) => {
			let tabToMove: Tab | null = null;
			
			// Step 1: Remove the tab from its source panel
			const removeTab = (panels: Panel[]): Panel[] => {
				return panels.map(panel => {
					if (panel.tabs.some(t => t.id === tabId)) {
						const filtered = panel.tabs.filter(t => {
							if (t.id === tabId) {
								tabToMove = t;
								return false;
							}
							return true;
						});
						return {
							...panel,
							tabs: filtered,
							activeTab: filtered.at(-1)?.id || '',
						};
					}
					
					if (panel.children) {
						return {
							...panel,
							children: removeTab(panel.children),
						};
					}
					return panel;
				});
			};
			
			// Step 2: Replace the target panel with a group of two new panels
			const splitInPlace = (panels: Panel[]): Panel[] => {
				return panels.map(panel => {
					if (panel.id === targetPanelId && tabToMove) {
						const originalTabs = panel.tabs;
						
						const child1: Panel = {
							id: uuidv4(),
							tabs: originalTabs,
							activeTab: originalTabs.at(-1)?.id || '',
						};
						
						const child2: Panel = {
							id: uuidv4(),
							tabs: [tabToMove],
							activeTab: tabToMove.id,
						};
						
						return {
							id: uuidv4(), // this becomes a parent panel now
							tabs: [],
							activeTab: '',
							splitType,
							children: [child1, child2],
						};
					}
					
					if (panel.children) {
						return {
							...panel,
							children: splitInPlace(panel.children),
						};
					}
					return panel;
				});
			};
			
			const cleaned = removeTab(state.panels);
			const splitPanels = splitInPlace(cleaned);
			const cleanedPanels = cleanEmptyPanels(splitPanels);
			
			let newPanelId = state.currentPanel;
			if (tabToMove) {
				const findPanelWithTab = (panels: Panel[]): string | null => {
					for (const panel of panels) {
						if (panel.tabs.some(t => t.id === tabToMove!.id)) {
							return panel.id;
						}
						if (panel.children) {
							const found = findPanelWithTab(panel.children);
							if (found) return found;
						}
					}
					return null;
				};
				newPanelId = findPanelWithTab(cleanedPanels) || newPanelId;
			}
			
			return {
				panels: cleanedPanels,
				currentPanel: newPanelId || state.currentPanel,
			};
			
		});
	},
	
}));

export default useTabStore;