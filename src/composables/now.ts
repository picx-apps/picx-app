export const now = useStorage("picx-now", Date.now());

export const updateNow = () => (now.value = Date.now());
