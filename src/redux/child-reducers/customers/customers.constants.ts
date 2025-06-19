import { ISelectOption } from "@/types/common.types"
import { capitalizeWord } from "@/utils/format-word"



export const CUSTOMER_FAMILY_RELATION = ["FATHER", "MOTHER", "SPOUSE", "SON", "DAUGHTER", "BROTHER", "SISTER"] as const
export const CUSTOMER_FAMILY_RELATION_TYPE_LIST: ISelectOption[] = CUSTOMER_FAMILY_RELATION.map((relation) => ({
    label: capitalizeWord(relation),
    value: relation
}))

export const CUSTOMER_STATUS_IN_COUNTRY = ["STUDY", "WORK", "PR_OR_GREEN_CARD", "VISITOR"] as const
export const CUSTOMER_STATUS_IN_COUNTRY_LIST: ISelectOption[] = CUSTOMER_STATUS_IN_COUNTRY.map((status) => ({
    label: status === "PR_OR_GREEN_CARD" ? "Permanent Resident/Green Card" : capitalizeWord(status),
    value: status
}))