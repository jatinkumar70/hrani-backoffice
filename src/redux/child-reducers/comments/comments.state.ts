import { ILoadState } from "@/redux/store.enums";
import { IComment, ICommentState } from "./comments.types";

export const defaultComment: IComment = {
    module_uuid: "",
    module_name: null,
    comment_remark: "",
    status: "ACTIVE",
};

export const defaultCommentState: ICommentState = {
    all_comments: {
        loading: ILoadState.idle,
        data: [],
        count: 0,
        error: null,
    },
    single_comment: {
        loading: ILoadState.idle,
        data: defaultComment,
        error: null,
    },
};