export * from "./store/case.store";


import CasesView from "./views/Cases.vue";

export const casesRoute = {
    path: "/cases",
    name: "Cases",
    component: CasesView,
};

export { CasesView };