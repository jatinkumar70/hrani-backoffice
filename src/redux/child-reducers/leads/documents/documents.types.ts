import type { ILoadState } from "@/redux/store.enums";



export type IDocumentStatus = "PENDING" | "DRAFT" | "FAILED" | "COMPLETED" | "ACTIVE"



export interface IDocument {
    document_signature_id: number
    document_signature_unique_id: number
    document_signature_uuid: string
    module_uuid: string
    module_name: "LEAD"
    original_attachments: any
    email: string
    signer_name: string
    sign_order: number
    document_code: string
    generated_document_response: any
    status: IDocumentStatus
    send_status: IDocumentStatus
    read_status: IDocumentStatus,
    signed_status: IDocumentStatus,
    signed_at: string
    expiry_date: string;
    create_ts?: string;
    insert_ts?: string;
}

export interface IDocumentState {
    multiple_documents_list: {
        loading: ILoadState
        data: IDocument[];
        count: number;
        error: string | null;
    },
}



export interface ISignDocumentRecipient {
    email: string,
    signer_name: string,
    sign_order: number
}
export interface ISignDocument {
    Recipient: ISignDocumentRecipient[],
    module_uuid: string
    module_name: string
    sub_module_uuid: string
    sub_module_name: string
}