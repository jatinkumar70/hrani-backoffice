import { ILoadState } from "@/redux/store.enums";

export type ICommentModule = "LEAD"

export interface IComment {
    comment_t_uuid?: string;
    module_uuid: string;
    module_name: ICommentModule | null;
    comment_remark: string;

    status: "ACTIVE" | "INACTIVE";

    created_by_name?: string | null;
    created_by_uuid?: string | null;
    create_ts?: string;
    insert_ts?: string;
}

export interface ICommentState {
    all_comments: {
        loading: ILoadState;
        data: IComment[];
        count: number;
        error: string | null;
    };
    single_comment: {
        loading: ILoadState;
        data: IComment;
        error: string | null;
    };
}
