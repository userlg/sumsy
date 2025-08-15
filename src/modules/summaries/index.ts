export * from "./store/summary.store.original";
export * from "./interfaces/Summary";

import SummariesView from "./views/Summaries.vue";

export const summariesRoute = {
    path: "/summaries",
    name: "Summaries",
    component: SummariesView,
};

export { SummariesView };