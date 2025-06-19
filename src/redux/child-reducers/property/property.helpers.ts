import { uploadSingleFileAsync } from "@/services";
import { IProperty } from "./property.types";
import { IDynamicFileObject } from "@/types/IDynamicObject";

// Check if object is empty
export const isEmptyObject = (obj: object) => {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
};

// Check if object keys are null
export const isNullObjectKeys = (obj: any) => Object.keys(obj).map((key) => obj[key] === null || obj[key] === undefined).filter((key) => key === false).length === 0;

// Upload property images
export const uploadPropertyImages = async (documents: IDynamicFileObject, data: IProperty): Promise<IProperty> => {
    let property_payload = { ...data };

    for (let key in documents) {
        const document = documents[key];
        if (document) {
            const asPayload = {
                property_name: property_payload.property_name || "",
                filename: document.name,
            };
            const file_path = await uploadSingleFileAsync(document, "PROPERTY", property_payload[key as keyof IProperty] as string || "", asPayload);
            
            // Handle image uploads specifically
            if (key === "property_images") {
                // If it's an array of images, append to the array
                if (Array.isArray(property_payload.property_images)) {
                    property_payload.property_images = [...property_payload.property_images, file_path];
                } else {
                    property_payload.property_images = [file_path];
                }
            } else {
                // For other document types
                (property_payload as any)[key] = file_path;
            }
        }
    }

    return property_payload;
}; 