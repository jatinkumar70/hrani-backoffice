
// ##############################################################################################
// ##################################### CHECK EMPTY OBJECT #####################################
// ##############################################################################################
// 1. Using Object.keys
// const isEmptyObject = (obj: object) => Object.keys(obj).length === 0;

import { uploadSingleFileAsync } from "@/services";
import { IPrivateLead } from "./private-leads.types";
import { IDynamicFileObject } from "@/types/IDynamicObject";

// 2. Using Object.entries
// const isEmptyObject = (obj) => Object.entries(obj).length === 0;

// 3. Using for...in Loop
const isEmptyObject = (obj: object) => {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
};

// Example usage
// console.log(isEmptyObject({})); // true
// console.log(isEmptyObject({ key: 'value' })); // false




// ##############################################################################################
// ################################ Check If Obejct Keys are null ###############################
// ##############################################################################################


export const isNullObjectKeys = (obj: any) => Object.keys(obj).map((key) => obj[key] === null || obj[key] === undefined).filter((key) => key === false).length === 0

// Example usage
// console.log(isEmptyObject({})); // true
// console.log(isEmptyObject({ key: 'value' })); // false


export const uplaodLeadDocuments = async (documents: IDynamicFileObject, data: IPrivateLead): Promise<IPrivateLead> => {

    let lead_payload = data

    for (let key in documents) {
        const document = documents[key]
        if (document) {
            const asPayload = {
                applicant_name: (data.applicant_first_name + " " + data.applicant_last_name || "").trim(),
                filename: document.name,
                // file_ext: documens[key].e
            }
            const logo_path = await uploadSingleFileAsync(document, "LEAD", lead_payload[key as "passport"] || "", asPayload);
            lead_payload[key as "passport"] = logo_path
        }
    }

    return lead_payload
}