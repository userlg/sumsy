//export * from "./store/summary.store";
export * from "./interfaces/Case";

import CasesView from "./views/Cases.vue";

export const casesRoute = {
    path: "/cases",
    name: "Cases",
    component: CasesView,
};

export { CasesView };