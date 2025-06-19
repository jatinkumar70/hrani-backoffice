import { ILoadState } from "@//redux/store.enums";
import { IDocumentState } from "./documents.types";




export const defaultDocumentState: IDocumentState = {
    multiple_documents_list: {
        loading: ILoadState.idle,
        data: [],
        count: 0,
        error: null
    },
}