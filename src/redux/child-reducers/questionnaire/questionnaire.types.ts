
import { ILoadState } from "@/redux/store.enums";

export interface IQuestionnaire {
    questionnaire_uuid: string | null,
    questionnaire_name: string,
    question_per_page: number,
    description: string | null,
    comment: string | null,
    status: "ACTIVE" | "INACTIVE"

    questionnaire_id?: number
    create_ts?: string
    insert_ts?: string
}
export interface IQuestion {
    questions_uuid: string | null,
    questionnaire_uuid: string,
    questionnaire_name: string,
    // occur_from: string,
    // occur_from_uuid: string,
    question: string,
    question_type: any,
    description: string | null,
    comment: string | null,
    status: "ACTIVE" | "INACTIVE"
    is_required: boolean
    id?: string
    questions_unique_id?: number
    create_ts?: string
    insert_ts?: string
}
export interface IAnswer {
    answers_uuid: string | null,
    service_uuid: string
    questions_uuid: string,
    question: string,
    questionnaire_uuid: string,
    questionnaire_name: string,
    leads_uuid?: string,
    answer_value: string[],
    remark: string | null,
    status: "ACTIVE" | "INACTIVE"

    create_ts?: string
    insert_ts?: string
}

export interface IQuestionOption {
    questions_options_uuid: string | null,
    question_option: string | null,
    questionnaire_uuid: string,
    questionnaire_name: string,
    questions_uuid: string | null,
    question: string
    description: string | null,
    status: "ACTIVE" | "INACTIVE"

    questions_options_id?: number
    question_option_type?: string
    create_ts?: string
    insert_ts?: string
}

export interface IQuestionnaireQuestionAnswer {
    question: IQuestion
    options: IQuestionOption[]
    answer: IAnswer
}

export interface IQuestionnaireState {
    questionnaire_list: {
        loading: ILoadState
        data: IQuestionnaire[]
        count: number;
        error: string | null;
    },
    single_questionnaire: {
        loading: ILoadState
        data: IQuestionnaire
        error: string | null;
    },
    questions_list: {
        loading: ILoadState
        data: IQuestion[]
        count: number;
        error: string | null;
    },
    single_question: {
        loading: ILoadState
        data: IQuestion
        error: string | null;
    },
    answers_list: {
        loading: ILoadState
        data: IAnswer[]
        count: number;
        error: string | null;
    },
    single_answer: {
        loading: ILoadState
        data: IAnswer
        error: string | null;
    },
    questions_options_list: {
        loading: ILoadState
        data: IQuestionOption[]
        count: number;
        error: string | null;
    },
    single_questions_option: {
        loading: ILoadState
        data: IQuestionOption
        error: string | null;
    },
    questions_with_answers_list: {
        loading: ILoadState
        data: IQuestionnaireQuestionAnswer[]
        count: number;
        error: string | null;
    },
}
