import { useProfilesRoutes } from './user-profiles'
import { useVouchersRoutes } from './vouchers'
import { useRoleGroupsRoutes } from './role-groups'
import { PropertyRoutes } from './property/Property.router'
import { BookingRoutes } from './booking'
import { useRoleRoutes } from './security'
import { EnquiryRoutes } from './enquiry/enquiry.router'
import { InventoryRoutes } from './inventory/inventory.router'
import areasRoutes from './areas/Areas.router'
import { FormulaRoutes } from './formula/Formula.router'
import { useReferralRoutes } from './referral'

export const adminRoutes = [
    ...useProfilesRoutes,
    ...useVouchersRoutes,
    ...PropertyRoutes,
    ...BookingRoutes,
    ...useRoleGroupsRoutes,
    ...useRoleRoutes,
    ...EnquiryRoutes,
    ...InventoryRoutes,
    ...areasRoutes,
    ...FormulaRoutes,
    ...useReferralRoutes,
]
