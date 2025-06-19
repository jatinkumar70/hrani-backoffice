import { DASHBOARDS_PREFIX_PATH } from '@/constants/route.constant'

export const APP_BASE_ROUTE = {
    root: '/',
    app: '/app',
    auth: '/auth',
}
export const vite_app_routes = {
    auth: {
        sign_in: `${APP_BASE_ROUTE['auth']}/sign-in`,
        sign_up: `${APP_BASE_ROUTE['auth']}/sign-up`,
    },

    app: {
        dashboard: {
            ecommerce: `${APP_BASE_ROUTE['app']}/dashboard/ecommerce`,
            project: `${APP_BASE_ROUTE['app']}/dashboard/project`,
            marketing: `${APP_BASE_ROUTE['app']}/dashboard/marketing`,
            analytic: `${APP_BASE_ROUTE['app']}/dashboard/analytic`,
        },
        concept: {
            ai: {
                chat: `${APP_BASE_ROUTE['app']}/concepts/ai/chat`,
                image: `${APP_BASE_ROUTE['app']}/concepts/ai/image`,
            },
            customers: {
                customer_list: `${APP_BASE_ROUTE['app']}/customers/ai/customer-list`,
                image: `${APP_BASE_ROUTE['app']}/customers/ai/image`,
            },
        },
        transactions: `${APP_BASE_ROUTE['app']}/transactions`,
        properties: `${APP_BASE_ROUTE['app']}/properties`,
        payment_links: `${APP_BASE_ROUTE['app']}/payment-links`,
        reports: `${APP_BASE_ROUTE['app']}/reports`,
        payment_button: `${APP_BASE_ROUTE['app']}/payment-button`,
        payment_pages: `${APP_BASE_ROUTE['app']}/payment-pages`,
        calendar: `${APP_BASE_ROUTE['app']}/calendar`,
        chat: `${APP_BASE_ROUTE['app']}/chat`,
        mailbox: `${APP_BASE_ROUTE['app']}/mailbox`,
        emails: `${APP_BASE_ROUTE['app']}/emails`,
        forms: `${APP_BASE_ROUTE['app']}/forms`,
        invoices: `${APP_BASE_ROUTE['app']}/invoices`,
        leads: `${APP_BASE_ROUTE['app']}/leads`,
        inventory_calendar: `${APP_BASE_ROUTE['app']}/inventory-calendar`,
        whatsapp: {
            whatsapp_root: `${APP_BASE_ROUTE['app']}/whatsapp`,
            whatsapp_campaigns: `${APP_BASE_ROUTE['app']}/whatsapp/campaigns`,
            whatsapp_audiences: `${APP_BASE_ROUTE['app']}/whatsapp/audiences`,
            whatsapp_templates: `${APP_BASE_ROUTE['app']}/whatsapp/templates`,
            whatsapp_settings: `${APP_BASE_ROUTE['app']}/whatsapp/settings`,
        },
        project_management: {
            root: `${APP_BASE_ROUTE['app']}/project-management`,
            dashboard: `${APP_BASE_ROUTE['app']}/project-management/dashboard`,
            projects: `${APP_BASE_ROUTE['app']}/project-management/projects`,
            tasks: `${APP_BASE_ROUTE['app']}/project-management/tasks`,
            schedule_tasks: `${APP_BASE_ROUTE['app']}/project-management/schedule-tasks`,
            task_categories: `${APP_BASE_ROUTE['app']}/project-management/task-categories`,
        },

        qr_codes: `${APP_BASE_ROUTE['app']}/qr-codes`,
        ecommerce: {
            root: `${APP_BASE_ROUTE['app']}/ecommerce`,
            dashboard: `${APP_BASE_ROUTE['app']}/ecommerce/dashboard`,
            products: `${APP_BASE_ROUTE['app']}/ecommerce/products`,
            categories: `${APP_BASE_ROUTE['app']}/ecommerce/categories`,
            tags: `${APP_BASE_ROUTE['app']}/ecommerce/tags`,
            inventory: `${APP_BASE_ROUTE['app']}/ecommerce/inventory`,
            customers: `${APP_BASE_ROUTE['app']}/ecommerce/customers`,
            orders: `${APP_BASE_ROUTE['app']}/ecommerce/orders`,
        },

        admin: {
            users: `${APP_BASE_ROUTE['app']}/users`,
            properties: `${APP_BASE_ROUTE['app']}${DASHBOARDS_PREFIX_PATH}/property`,
            booking: `${APP_BASE_ROUTE['app']}/admin/booking`,
            vouchers: `${APP_BASE_ROUTE['app']}/admin/vouchers`,
            enquiry: `${APP_BASE_ROUTE['app']}/admin/enquiry`,
            inventory: `${APP_BASE_ROUTE['app']}/admin/inventory`,
            areas: `${APP_BASE_ROUTE['app']}/admin/property/areas`,
            formula_mapping: `${APP_BASE_ROUTE['app']}/admin/formula-mapping`,
            formula_calculator_logs: `${APP_BASE_ROUTE['app']}/admin/formula-calculator-logs`,
            security: {
                root: `${APP_BASE_ROUTE['app']}/security`,
                security_groups: `${APP_BASE_ROUTE['app']}/security/security-groups`,
                security_groups_duplicate: `${APP_BASE_ROUTE['app']}/security/security-groups-duplicate`,
                approvals: `${APP_BASE_ROUTE['app']}/security/approvals`,
                role_groups: `${APP_BASE_ROUTE['app']}/security/role-groups`,
            },
            referral: `${APP_BASE_ROUTE['app']}/admin/referral`,
        },
    },
}
