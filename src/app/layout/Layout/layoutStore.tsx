import create from 'zustand';
import {v4 as uuidv4} from 'uuid';
import React, {JSX} from "react";

type Tab = {
	id: string;
	title: string;
	icon: React.ReactNode;
	component: JSX.Element;
};

type TabStore = {
	tabs: Tab[];
	activeTab: string;
	addTab: (title: string, icon: React.ReactNode, component: JSX.Element) => void;
	removeTab: (id: React.Key | null | undefined) => void;
	setActiveTab: (id: React.Key | null | undefined) => void;
};

const useTabStore = create<TabStore>((set: any) => ({
	tabs: [],
	activeTab: '',
	addTab: (title: string, icon: React.ReactNode, component: any) => {
		const newTab = {
			id: uuidv4(),
			title,
			icon,
			component,
		};
		set((state: { tabs: any; }) => ({
			tabs: [...state.tabs, newTab],
			activeTab: newTab.id, // Set the newly added tab as active by default
		}));
	},
	removeTab: (id: React.Key | null | undefined) => {
		set((state: { tabs: Tab[]; }) => {
			const remainingTabs = state.tabs.filter((tab: Tab) => tab.id !== id);
			return {
				tabs: remainingTabs,
				// Set the last tab as active if there's still any tab left
				activeTab: remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].id : '',
			};
		});
	},
	setActiveTab: (id: React.Key | null | undefined) => set({activeTab: id}),
}));

export default useTabStore;