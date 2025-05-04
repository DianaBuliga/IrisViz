import create from "zustand";

type stateStoreType = {
	playControl: boolean;
	setPlayControl: (playControl: boolean) => void;
	timestamp: number;
	setTimestamp: (timestamp: number) => void;
	cleanTab: boolean;
	setCleanTab: (cleanTab: boolean) => void;
}

const stateStore = create<stateStoreType>((set, get) => ({
			playControl: false,
			setPlayControl: (playControl: boolean) => {
				set({playControl});
			},
			timestamp: 0,
			setTimestamp: (timestamp: number) => {
				set({timestamp});
			},
			cleanTab: false,
			setCleanTab: (cleanTab: boolean) => {
				set({cleanTab});
			},
		}
	),
);

export default stateStore;