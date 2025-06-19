import { vite_app_routes } from "@/router/vite-app-routes";
import PropertyListView from "./page-view/property-list";
import PropertyForm from "./page-view/property-form";
import { Routes } from "@/@types/routes";
import { lazy } from "react";

export const property_module_routes = [
    {
        path: vite_app_routes.app.properties,
        element: <PropertyListView />
    },
    {
        path: `${vite_app_routes.app.properties}/create`,
        element: <PropertyForm />
    },
    {
        path: `${vite_app_routes.app.properties}/edit/:uuid`,
        element: <PropertyForm />
    },
];
export const PropertyRoutes: Routes = [
    {
        key: 'dashboard.property',
        path: vite_app_routes.app.admin.properties,
        component: lazy(() => import('./page-view/property-list')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'admin.properties.edit',
        path: `${vite_app_routes.app.admin.properties}/edit/:uuid`,
        component: lazy(() =>  import('./page-view/property-form')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
        },
    },

]