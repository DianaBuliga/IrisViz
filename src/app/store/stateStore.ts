import create from "zustand";

type stateStoreType = {
	playControl: boolean;
	setPlayControl: (playControl: boolean) => void;
}

const stateStore = create<stateStoreType>((set, get) => ({
			playControl: false,
			setPlayControl: (playControl: boolean) => {
				set({playControl});
			}
		}
	),
);

export default stateStore;