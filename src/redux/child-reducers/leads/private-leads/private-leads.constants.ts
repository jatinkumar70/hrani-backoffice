import { ISelectOption } from "@/types/common.types"
import { ILanguageTestType, IServiceSubType, IServiceType } from "./private-leads.types"
import { capitalizeStatus } from "@/utils"
import { capitalizeUnderScoreWords } from "@/utils/format-word"


export const work_profile_loaction_type = {
    ON_SITE: "On Site",
    HYBRID: "Hybrid",
    REMOTE: "Remote",
}
export const work_profile_loaction_type_list = [
    { label: "On Site", value: "ON_SITE" },
    { label: "Hybrid", value: "HYBRID" },
    { label: "Remote", value: "REMOTE" },
]


export const work_profile_employement_type = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    SELF_EMPLOYED: "Self Employed",
    FREELANCE: "Freelance",
    INTERNSHIP: "Internship",
    TRAINEE: "Trainee"
}
// export type IWorkHistoryEmployemnetType = typeof work_profile_employement_type_list

export const work_profile_employement_type_list = [
    { label: "Full Time", value: "FULL_TIME" },
    { label: "Part Time", value: "PART_TIME" },
    { label: "Self Employed", value: "SELF_EMPLOYED" },
    { label: "Freelance", value: "FREELANCE" },
    { label: "Internship", value: "INTERNSHIP" },
    { label: "Trainee", value: "TRAINEE" },
]



export const ilets_test_table = [

    { proficiency: "Fluent", clb: 10, speaking: "7.5 - 9.0", listening: "8.5 - 9.0", reading: "8.0 - 9.0", writing: "7.5 - 9.0" },
    { proficiency: "Advance2", clb: 9, speaking: "7.0", listening: "8.0", reading: "7.0 - 7.5", writing: "7.0" },
    { proficiency: "Advance1", clb: 8, speaking: "6.5", listening: "7.5", reading: "6.5", writing: "6.5" },
    { proficiency: "Intermediate2", clb: 7, speaking: "6.0", listening: "6.0 - 7.0", reading: "6.0", writing: "6.0" },
    { proficiency: "Intermediate1", clb: 6, speaking: "5.5", listening: "5.5", reading: "5.0 - 5.5", writing: "5.5" },
    { proficiency: "Basic2", clb: 5, speaking: "5.0", listening: "5.0", reading: "4.0 - 4.5", writing: "5.0" },
    { proficiency: "Basic1", clb: 4, speaking: "4.0 - 4.5", listening: "4.5", reading: "3.5", writing: "4.0 - 4.5" },
    { proficiency: "None", clb: 3, speaking: "0 - 3.5", listening: "0 - 4.0", reading: "0 - 3.0", writing: "0 - 3.5" },
]

export const celpip_test_table = [
    { proficiency: "Fluent", clb: 10, speaking: "10 - 12", listening: "10 - 12", reading: "10 - 12", writing: "10 - 12" },
    { proficiency: "Advance2", clb: 9, speaking: "9", listening: "9", reading: "9", writing: "9" },
    { proficiency: "Advance1", clb: 8, speaking: "8", listening: "8", reading: "8", writing: "8" },
    { proficiency: "Intermediate2", clb: 7, speaking: "7", listening: "7", reading: "7", writing: "7" },
    { proficiency: "Intermediate1", clb: 6, speaking: "6", listening: "6", reading: "6", writing: "6" },
    { proficiency: "Basic2", clb: 5, speaking: "5", listening: "5", reading: "5", writing: "5" },
    { proficiency: "Basic1", clb: 4, speaking: "4", listening: "4", reading: "4", writing: "4" },
    { proficiency: "None", clb: 3, speaking: "M, 0 - 3", listening: "M, 0 - 3", reading: "M, 0 - 3", writing: "M, 0 - 3" },
]


export const tef_canada_test_table = [
    { proficiency: "Fluent", clb: 10, speaking: "393 - 450", listening: "316 - 360", reading: "263 - 300", writing: "393 - 450" },
    { proficiency: "Advance2", clb: 9, speaking: "371 - 392", listening: "298 - 315", reading: "248 - 262", writing: "371-392" },
    { proficiency: "Advance1", clb: 8, speaking: "349 - 370", listening: "280 - 297", reading: "233 - 247", writing: "349-370" },
    { proficiency: "Intermediate2", clb: 7, speaking: "310 - 348", listening: "249 - 279", reading: "207 - 232", writing: "310-348" },
    { proficiency: "Intermediate1", clb: 6, speaking: "271 - 309", listening: "217 - 248", reading: "181 - 206", writing: "271-309" },
    { proficiency: "Basic2", clb: 5, speaking: "226 - 270", listening: "181 - 216", reading: "151 - 180", writing: "226-270" },
    { proficiency: "Basic1", clb: 4, speaking: "181 - 225", listening: "145 - 180", reading: "121 - 150", writing: "181-225" },
    { proficiency: "None", clb: 3, speaking: "0 - 180", listening: "0 - 144", reading: "0 - 120", writing: "0 - 180" },
]

export const tcf_canada_test_table = [
    { proficiency: "Fluent", clb: 10, speaking: "16 - 20", listening: "549 - 699", reading: "549 - 699", writing: "16 - 20" },
    { proficiency: "Advance2", clb: 9, speaking: "14 - 15", listening: "523 - 548", reading: "524 - 548", writing: "14 - 15" },
    { proficiency: "Advance1", clb: 8, speaking: "12 - 13", listening: "503 - 522", reading: "499 - 523", writing: "12 - 13" },
    { proficiency: "Intermediate2", clb: 7, speaking: "10 - 11", listening: "458 - 502", reading: "453 - 498", writing: "10 - 11" },
    { proficiency: "Intermediate1", clb: 6, speaking: "7 - 9", listening: "398 - 457", reading: "406 - 452", writing: "7 - 9" },
    { proficiency: "Basic2", clb: 5, speaking: "6", listening: "369 - 397", reading: "375 - 405", writing: "6" },
    { proficiency: "Basic1", clb: 4, speaking: "4 - 5", listening: "331 - 368", reading: "342 - 374", writing: "4 - 5" },
    { proficiency: "None", clb: 3, speaking: "0 - 3", listening: "0 - 330", reading: "0 - 341", writing: "0 - 3" },
]

export const pte_core_test_table = [
    { proficiency: "Fluent", clb: 10, speaking: "89 - 90", listening: "89 - 90", reading: "88 - 90", writing: "90" },
    { proficiency: "Advance2", clb: 9, speaking: "84 - 88", listening: "82 - 88", reading: "78 - 87", writing: "88 - 89" },
    { proficiency: "Advance1", clb: 8, speaking: "76 - 83", listening: "71 - 81", reading: "69 - 77", writing: "79 - 87" },
    { proficiency: "Intermediate2", clb: 7, speaking: "68 - 75", listening: "60 - 70", reading: "60 - 68", writing: "69 - 78" },
    { proficiency: "Intermediate1", clb: 6, speaking: "59 - 67", listening: "50 - 59", reading: "51 - 59", writing: "60 - 68" },
    { proficiency: "Basic2", clb: 5, speaking: "51 - 58", listening: "39 - 49", reading: "42 - 50", writing: "51 - 59" },
    { proficiency: "Basic1", clb: 4, speaking: "42 - 50", listening: "28 - 38", reading: "33 - 41", writing: "41 - 50" },
    { proficiency: "None", clb: 3, speaking: "0 - 41", listening: "0 - 27", reading: "0 - 32", writing: "0 - 40" },
]



export const english_language_equivalency_charts = {
    ILETS: ilets_test_table,
    CELPIP: celpip_test_table,
    PTE: pte_core_test_table,
}
export const french_language_equivalency_charts = {
    TEF: tef_canada_test_table,
    TCF: tcf_canada_test_table
}

export const language_equivalency_charts = {
    ...english_language_equivalency_charts,
    ...french_language_equivalency_charts
}


// export type IEnglishLanguageTest = keyof typeof english_language_equivalency_charts
// export type IFrenchLanguageTest = keyof typeof french_language_equivalency_charts
export type ILanguageTest = keyof (typeof english_language_equivalency_charts & typeof french_language_equivalency_charts)
// export type ILanguage = "ENGLISH" | "FRENCH"

const language_test_label = {
    ILETS: "ILETS",
    CELPIP: "CELPIP-G",
    PTE: "PTE Core",
    TEF: "TEF",
    TCF: "TCF"
}
export const getLanguageOptions = (currnetTest?: ILanguageTest): ISelectOption[] => {
    if (Object.keys(english_language_equivalency_charts).includes(currnetTest as "ILETS")) {
        return Object.keys(french_language_equivalency_charts).map((key) => {
            return { label: language_test_label[key as "ILETS"], value: key }
        })
    }
    if (Object.keys(french_language_equivalency_charts).includes(currnetTest as "ILETS")) {
        return Object.keys(english_language_equivalency_charts).map((key) => {
            return { label: language_test_label[key as "ILETS"], value: key }
        })
    }
    return Object.keys(language_equivalency_charts).map((key) => {
        return { label: language_test_label[key as "ILETS"], value: key }
    })
}

export const getLanguageProficiencyOptions = (test: ILanguageTest, testType: ILanguageTestType): ISelectOption[] => {
    if (test && testType) {
        return (language_equivalency_charts[test] || []).map((option) => {
            return { label: `${option[testType.toLowerCase() as "clb"]}`, value: option.clb }
        })
    }
    return []
}








// export type IType = "PR" | "WORK_PERMIT" | "STUDY" | "VISITOR"

export const lead_servise_subtype = {
    PR: ["EXPRESS_ENTRY", "PNP_FEDRAL", "ONTARIIO_PNP"],
    WORK_PERMIT: ["LMIA", "PGWP", "DEPENDENT_WORK_PERMIT", "PNP_WORK_PERMIT", "ICT"],
    STUDY: ["SCHOOLS", "UNIVERSITIES"],
    VISITOR: ["VISITOR", "BUSINESS", "SUPER_VISA"]
}

export const LEAD_SERVICES_TYPE_LIST = Object.keys(lead_servise_subtype).map((option) => {
    return { label: capitalizeStatus(option), value: option }
});

export const getServiceSubTypeOptions = (serviceType: IServiceType): ISelectOption[] => {
    if (serviceType) {
        return (lead_servise_subtype[serviceType] || []).map((option) => {
            return { label: capitalizeStatus(option), value: option }
        })
    }
    return []
}
















// export const english_ilets_test_table = [

//     { proficiency: "Fluent", clb: "10 or more", speaking: "7.5 or more", listening: "8.5 or more", reading: "7.5 or more", writing: "7.5 or more" },
//     { proficiency: "Advance2", clb: "9", speaking: "7.0", listening: "8.0", reading: "7.0", writing: "7.0" },
//     { proficiency: "Advance1", clb: "8", speaking: "6.5", listening: "7.5", reading: "6.5", writing: "6.5" },
//     { proficiency: "Intermediate2", clb: "7", speaking: "6.0", listening: "6.0", reading: "6.0", writing: "6.0" },
//     { proficiency: "Intermediate1", clb: "6", speaking: "5.5", listening: "5.5", reading: "5.5", writing: "5.5" },
//     { proficiency: "Basic2", clb: "5", speaking: "5.0", listening: "5.0", reading: "5.0", writing: "5.0" },
//     { proficiency: "Basic1", clb: "4", speaking: "4.5", listening: "4.5", reading: "4.5", writing: "4.5" },
//     { proficiency: "None", clb: "3 or less", speaking: "4.0 or less", listening: "3.0 or less", reading: "4.0 or less", writing: "4.0 or less" },
// ]

// export const english_celpip_test_table = [

//     { proficiency: "Fluent", clb: "10 or more", speaking: "10", listening: "5H / 10", reading: "5H / 10", writing: "5H / 10" },
//     { proficiency: "Advance2", clb: "9", speaking: "5L / 9", listening: "5L / 9", reading: "5L / 9", writing: "5L / 9" },
//     { proficiency: "Advance1", clb: "8", speaking: "4H / 8", listening: "4H / 8", reading: "4H / 8", writing: "4H / 8" },
//     { proficiency: "Intermediate2", clb: "7", speaking: "4L / 7", listening: "4L / 7", reading: "4L / 7", writing: "4L / 7" },
//     { proficiency: "Intermediate1", clb: "6", speaking: "3H / 6", listening: "3H / 6", reading: "3H / 6", writing: "3H / 6" },
//     { proficiency: "Basic2", clb: "5", speaking: "3L / 5", listening: "3L / 5", reading: "3L / 5", writing: "3L / 5" },
//     { proficiency: "Basic1", clb: "4", speaking: "2H / 4", listening: "2H / 4", reading: "2H / 4", writing: "2H / 4" },
//     { proficiency: "None", clb: "3 or less", speaking: "2L / 3 or less", listening: "2L / 3 or less", reading: "2L / 3 or less", writing: "2L / 3 or less" },
// ]


// export const french_tef_test_table = [
//     { proficiency: "Fluent", clb: "10", speaking: "393 or above", listening: "316 or above", reading: "263 or above", writing: "393 or above" },
//     { proficiency: "Advance2", clb: "9", speaking: "371-392", listening: "298-315", reading: "248-262", writing: "371-392" },
//     { proficiency: "Advance1", clb: "8", speaking: "349-370", listening: "280-297", reading: "233-247", writing: "349-370" },
//     { proficiency: "Intermediate2", clb: "7", speaking: "310-348", listening: "249-279", reading: "207-232", writing: "310-348" },
//     { proficiency: "Intermediate1", clb: "6", speaking: "271-309", listening: "217-248", reading: "181-206", writing: "271-309" },
//     { proficiency: "Basic2", clb: "5", speaking: "226-270", listening: "181-216", reading: "151-180", writing: "226-270" },
//     { proficiency: "Basic1", clb: "4", speaking: "181-225", listening: "145-180", reading: "121-150", writing: "181-225" },
//     { proficiency: "None", clb: "3 or less", speaking: "180 or less", listening: "144 or less", reading: "120 or less", writing: "180 or less" },
// ]

// export const french_tcf_test_table = [
//     { proficiency: "Fluent", clb: "10", speaking: "18-20", listening: "600 or more", reading: "600 or more", writing: "18-20" },
//     { proficiency: "Advance2", clb: "9", speaking: "16-17", listening: "550-599", reading: "550-599", writing: "16-17" },
//     { proficiency: "Advance1", clb: "8", speaking: "14-15", listening: "500-549", reading: "500-549", writing: "14-15" },
//     { proficiency: "Intermediate2", clb: "7", speaking: "12-13", listening: "450-499", reading: "450-499", writing: "12-13" },
//     { proficiency: "Intermediate1", clb: "6", speaking: "10-11", listening: "400-449", reading: "400-449", writing: "10-11" },
//     { proficiency: "Basic2", clb: "5", speaking: "8-9", listening: "350-399", reading: "350-399", writing: "8-9" },
//     { proficiency: "Basic1", clb: "4", speaking: "6-7", listening: "300-349", reading: "300-349", writing: "6-7" },
//     { proficiency: "None", clb: "3 or less", speaking: "5 or less", listening: "299 or less", reading: "299 or less", writing: "5 or less" },
// ]




export const RETAINER_AGREEMENT_TYPE = ["LMIA", "RETAINER_AGREEMENT", "CONSULTATION_AGREEMENT"] as const
export const RETAINER_AGREEMENT_TYPE_LIST: ISelectOption[] = RETAINER_AGREEMENT_TYPE.map((status) => ({
    label: capitalizeUnderScoreWords(status),
    value: status
}))