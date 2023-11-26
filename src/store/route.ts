export const useRouteState = createGlobalState(() => {
  const routeHistory = ref<string[]>([]);
  const canBack = ref(false);
  const canForward = ref(false);
  const currentPathIndex = ref(0);

  function addHistory(path: string) {
    !routeHistory.value.includes(path) && routeHistory.value.push(path);
    const index = routeHistory.value.findIndex((item) => item === path);
    currentPathIndex.value = index;
    if (index !== -1 && index !== routeHistory.value.length - 1) {
      canForward.value = true;
    } else {
      canForward.value = false;
    }
    if (routeHistory.value.length > 1 && index !== 0) {
      canBack.value = true;
    } else {
      canBack.value = false;
    }
  }

  return { routeHistory, canBack, canForward, currentPathIndex, addHistory };
});
