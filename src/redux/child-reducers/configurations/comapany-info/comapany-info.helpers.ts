import { IDynamicFileObject } from "@/types/IDynamicObject";
import { ICompanyInformation } from "./comapany-info.types";
import { FILE_UPLOAD_KEYS } from "@/enums";
import { uploadSingleFileAsync } from "@/services";




export const uplaodCompanyDocuments = async (documents: IDynamicFileObject, data: ICompanyInformation): Promise<ICompanyInformation> => {

    let company_payload = data

    for (let key in documents) {
        const document = documents[key]
        if (document) {
            const asPayload = {
                company_name: data.company_name,
                filename: document.name,
            }
            const logo_path = await uploadSingleFileAsync(document, FILE_UPLOAD_KEYS.COMPANY_INFORMATION, company_payload[key as "company_name"] || "", asPayload);
            company_payload[key as "company_name"] = logo_path
        }
    }

    return company_payload
}