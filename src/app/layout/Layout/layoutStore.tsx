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
};

type TabStore = {
	panels: Panel[];
	activeTab: string;
	lastClickedPanel: string;
	setLastClickedPanel: (panelId: string) => void;
	addTab: (panelId: string, title: string, icon: React.ReactNode, component: JSX.Element) => void;
	removeTab: (panelId: string, tabId: string) => void;
	setActiveTab: (panelId: string, tabId: string) => void;
	reorderTabs: (panelId: string, draggedIndex: number, targetIndex: number) => void;
	addPanel: () => void;
	removePanel: (panelId: string) => void;
};

const useTabStore = create<TabStore>((set: any) => ({
	panels: [
		{id: '1', activeTab: '', tabs: []},
	],
	activeTab: '',
	lastClickedPanel: '1',
	setLastClickedPanel: (panelId: string) => set({lastClickedPanel: panelId}),
	addTab: (panelId: string, title: string, icon: React.ReactNode, component: JSX.Element) => {
		const newTab = {
			id: uuidv4(),
			title,
			icon,
			component,
		};
		set((state: { panels: Panel[] }) => {
			const panelIndex = state.panels.findIndex(p => p.id === panelId);
			const panel = state.panels[panelIndex];
			return {
				panels: state.panels.map((p, index) => index === panelIndex ? {
					...p,
					tabs: [...p.tabs, newTab],
					activeTab: newTab.id,
				} : p),
			};
		});
	},
	removeTab: (panelId: string, tabId: string) => {
		set((state: { panels: Panel[] }) => {
			const panelIndex = state.panels.findIndex(p => p.id === panelId);
			const panel = state.panels[panelIndex];
			const remainingTabs = panel.tabs.filter((tab: Tab) => tab.id !== tabId);
			return {
				panels: state.panels.map((p, index) => index === panelIndex ? {
					...p,
					tabs: remainingTabs,
					activeTab: remainingTabs.length > 0 ? remainingTabs[0].id : '',
				} : p),
			};
		});
	},
	setActiveTab: (panelId: string, tabId: string) => {
		set((state: { panels: Panel[] }) => {
			const panelIndex = state.panels.findIndex(p => p.id === panelId);
			return {
				panels: state.panels.map((p, index) => index === panelIndex ? {...p, activeTab: tabId} : p),
			};
		});
	},
	reorderTabs: (panelId: string, draggedIndex: number, targetIndex: number) => {
		set((state: { panels: Panel[] }) => {
			const panelIndex = state.panels.findIndex(p => p.id === panelId);
			const panel = state.panels[panelIndex];
			const newTabs = [...panel.tabs];
			const [movedTab] = newTabs.splice(draggedIndex, 1);
			newTabs.splice(targetIndex, 0, movedTab);
			return {
				panels: state.panels.map((p, index) => index === panelIndex ? {...p, tabs: newTabs} : p),
			};
		});
	},
	addPanel: () => {
		set((state: { panels: Panel[] }) => {
			const newPanel = {id: `panel-${state.panels.length + 1}`, activeTab: '', tabs: []};
			return {panels: [...state.panels, newPanel]};
		});
	},
	removePanel: (panelId: string) => {
		set((state: { panels: Panel[] }) => {
			return {panels: state.panels.filter(panel => panel.id !== panelId)};
		});
	},
}));

export default useTabStore;