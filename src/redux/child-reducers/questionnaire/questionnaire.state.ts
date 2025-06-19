import { ILoadState } from "@/redux/store.enums";
import { IAnswer, IQuestion, IQuestionnaire, IQuestionnaireState, IQuestionOption } from "./questionnaire.types";



export const defaultQuestionnaire: IQuestionnaire = {
    questionnaire_uuid: null,
    questionnaire_name: "",
    question_per_page: 10,
    description: null,
    comment: null,
    status: "ACTIVE"
}
export const defaultQuestion: IQuestion = {
    questions_uuid: null,
    questionnaire_uuid: "",
    questionnaire_name: "",
    question: "",
    question_type: "TEXT",
    description: null,
    comment: null,
    status: "ACTIVE",
    is_required: false
}

export const defaultAnswer: IAnswer = {
    answers_uuid: null,
    service_uuid: "",
    questions_uuid: "",
    question: "",
    questionnaire_uuid: "",
    questionnaire_name: "",
    // lead_uuid: "",
    answer_value: [],
    remark: null,
    status: "ACTIVE"
}

export const defaultQuestionOption: IQuestionOption = {
    questions_options_uuid: null,
    question_option: null,
    questionnaire_uuid: "",
    questionnaire_name: "",
    questions_uuid: null,
    question: "",
    description: null,
    status: "ACTIVE"
}

const sample = [
    {
        question: {
            questions_uuid: null,
            questionnaire_uuid: "",
            questionnaire_name: "",
            question: "",
            question_type: "TEXT",
            description: null,
            comment: null,
            status: "ACTIVE"
        },
        options: [
            {
                questions_options_uuid: null,
                question_option: null,
                questionnaire_uuid: "",
                questionnaire_name: "",
                questions_uuid: null,
                question: "",
                description: null,
                status: "ACTIVE"
            }
        ],
        answer: {
            answers_uuid: null,
            questions_uuid: "",
            question: "",
            questionnaire_uuid: "",
            questionnaire_name: "",
            // lead_uuid: "",
            answer_value: "",
            remark: null,
            status: "ACTIVE"
        }
    }
]

export const defaultQuestionnaireState: IQuestionnaireState = {
    questionnaire_list: {
        loading: ILoadState.idle,
        data: [],
        count: 0,
        error: null,
    },
    single_questionnaire: {
        loading: ILoadState.idle,
        data: defaultQuestionnaire,
        error: null,
    },
    questions_list: {
        loading: ILoadState.idle,
        data: [],
        count: 0,
        error: null,
    },
    single_question: {
        loading: ILoadState.idle,
        data: defaultQuestion,
        error: null,
    },
    answers_list: {
        loading: ILoadState.idle,
        data: [],
        count: 0,
        error: null,
    },
    single_answer: {
        loading: ILoadState.idle,
        data: defaultAnswer,
        error: null,
    },
    questions_options_list: {
        loading: ILoadState.idle,
        data: [],
        count: 0,
        error: null,
    },
    single_questions_option: {
        loading: ILoadState.idle,
        data: defaultQuestionOption,
        error: null,
    },
    questions_with_answers_list: {
        loading: ILoadState.idle,
        data: [],
        count: 0,
        error: null,
    },
}