import create from 'zustand';

interface ChartStore {
	chartData: Array<{ timestamp: number; [label: string]: number }>;
	dataLabel: string[];
	addData: (data: { timestamp: number; [label: string]: number }) => void;
	updateLabels: (newLabels: string[]) => void;
	clearData: () => void;
}

const chartStore = create<ChartStore>((set) => ({
	chartData: [],
	dataLabel: [],
	addData: (data) => set((state) => ({
		chartData: [...state.chartData, data],
	})),
	updateLabels: (newLabels) => set((state) => ({
		dataLabel: newLabels,
	})),
	clearData: () => {
		set((state) => ({
			...state,
			chartData: [],
		}))
	},
}));

export default chartStore;
