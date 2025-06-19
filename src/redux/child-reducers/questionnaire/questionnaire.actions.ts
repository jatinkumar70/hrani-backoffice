// #########################################################################################################
// #################################### Questionnaire Module ###############################################
// #########################################################################################################

import { createAsyncThunk } from "@reduxjs/toolkit";
import { axios_Loading_messages, server_base_endpoints } from "@/api";
import axios_base_api from "@/api/axios-base-api";
import { ISearchQueryParamsV2 } from "@/redux/store.types";
import { getSearchQueryParamsV2 } from "@/redux/store.utils";
import { openSnackbarDialog } from "../loading-and-snackbar";
import { createAsyncThunkGetWrapper, createAsyncThunkPostWrapper } from "@/redux/store.wrapper";
import { IAnswer, IQuestion, IQuestionnaire, IQuestionnaireQuestionAnswer, IQuestionOption } from "./questionnaire.types";
import { uuidv4 } from "@/utils";

export const fetchMultipleQuestionnairesAsync = createAsyncThunk<{ count: number, data: IQuestionnaire[] }>(
    'questionnaire/fetchMultipleQuestionnairesAsync', async () => {
        const response = await axios_base_api.get(server_base_endpoints.questionnaire.get_questionnaire)
        const { data } = response.data;
        const count = response.data.totalRecords
        return { count, data }
    },
)

export const fetchMultipleQuestionnairesWithArgsAsync = createAsyncThunk<{ count: number, data: IQuestionnaire[] }, ISearchQueryParamsV2>(
    'questionnaire/fetchMultipleQuestionnairesWithArgsAsync', async (queryParams, thunkAPI) => {
        const searchQuery = getSearchQueryParamsV2(queryParams);
        const response = await axios_base_api.get(`${server_base_endpoints.questionnaire.get_questionnaire}${searchQuery}`)
        const { data, totalRecords: count } = response.data;
        return thunkAPI.fulfillWithValue({ count, data })
    }
)


export const fetchSingleQuestionnaireWithArgsAsync = createAsyncThunkGetWrapper<IQuestionnaire, string>(
    'questionnaire/fetchSingleQuestionnaireWithArgsAsync', async (uuid, thunkAPI) => {
        const response = await axios_base_api.get(`${server_base_endpoints.questionnaire.get_questionnaire}?questionnaire_uuid=${uuid}`)
        return thunkAPI.fulfillWithValue(response.data.data[0])
    },
)


export interface IUpsertSingleQuestionnaireWithCallback {
    payload: IQuestionnaire,
    onSuccess: (isSuccess: boolean, data?: IQuestionnaire) => void
}
export const upsertSingleQuestionnaireWithCallbackAsync = createAsyncThunkPostWrapper<IQuestionnaire, IUpsertSingleQuestionnaireWithCallback>(
    'questionnaire/upsertSingleQuestionnaireWithCallbackAsync', async ({ payload, onSuccess }, thunkAPI) => {
        const { questionnaire_id, insert_ts, create_ts, ...restPayload } = payload
        const response = await axios_base_api.post(server_base_endpoints.questionnaire.upsert_questionnaire, restPayload)
        if (response.status === 200) {
            onSuccess(true, response.data.data)
            thunkAPI.dispatch(openSnackbarDialog({
                variant: "success",
                message: axios_Loading_messages.save_success
            }))
            return thunkAPI.fulfillWithValue(response.data.data)
        }

        onSuccess(false)
        thunkAPI.dispatch(openSnackbarDialog({
            variant: "error",
            message: axios_Loading_messages.save_error

        }))
        return thunkAPI.rejectWithValue(response.status)
    },
)


export const duplicateSingleQuestionnaireWithArgsAsync = createAsyncThunkPostWrapper<IQuestionnaire, string>(
    'questionnaire/duplicateSingleQuestionnaireWithArgsAsync', async (uuid, thunkAPI) => {
        const response = await axios_base_api.post(server_base_endpoints.questionnaire.duplicate_questionnaire, {
            questionnaire_uuid: uuid
        })
        return thunkAPI.fulfillWithValue(response.data.data)
    },
)




// #########################################################################################################
// ######################################## Question Module ################################################
// #########################################################################################################

export const fetchMultipleQuestionsAsync = createAsyncThunk<{ count: number, data: IQuestion[] }>(
    'question/fetchMultipleQuestionsAsync', async () => {
        const response = await axios_base_api.get(server_base_endpoints.questionnaire.get_question)
        const { data } = response.data;
        const count = response.data.totalRecords
        return { count, data }
    },
)

export const fetchMultipleQuestionsWithArgsAsync = createAsyncThunk<{ count: number, data: IQuestion[] }, { queryParams: ISearchQueryParamsV2, questionnaire_uuid: string }>(
    'question/fetchMultipleQuestionsWithArgsAsync', async ({ queryParams, questionnaire_uuid }, thunkAPI) => {
        const searchQuery = getSearchQueryParamsV2(queryParams);
        const response = await axios_base_api.get(`${server_base_endpoints.questionnaire.get_question}${searchQuery}&questionnaire_uuid=${questionnaire_uuid}`)
        const { data, totalRecords: count } = response.data;
        const finalList = data.map((item: any) => ({ ...item, id: uuidv4() }))
        return thunkAPI.fulfillWithValue({ count, data: finalList })
    }
)

export const fetchMultipleQuestionsOfQuestionnaireAsync = createAsyncThunk<{ count: number, data: IQuestion[] }, string>(
    'question/fetchMultipleQuestionsWithArgsAsync', async (questionnaire_uuid, thunkAPI) => {
        const response = await axios_base_api.get(`${server_base_endpoints.questionnaire.get_question}?questionnaire_uuid=${questionnaire_uuid}`)
        const { data, totalRecords: count } = response.data;
        const finalList = data.map((item: any) => ({ ...item, id: uuidv4() }))
        return thunkAPI.fulfillWithValue({ count, data: finalList })
    }
)

export const fetchSingleQuestionWithArgsAsync = createAsyncThunkGetWrapper<IQuestion, string>(
    'question/fetchSingleQuestionWithArgsAsync', async (uuid, thunkAPI) => {
        const response = await axios_base_api.get(`${server_base_endpoints.questionnaire.get_question}?questions_uuid=${uuid}`)
        return thunkAPI.fulfillWithValue(response.data.data[0])
    },
)


export interface IUpsertSingleQuestionWithCallback {
    payload: IQuestion,
    onSuccess: (isSuccess: boolean, data?: IQuestion) => void
}
export const upsertSingleQuestionWithCallbackAsync = createAsyncThunkPostWrapper<IQuestion, IUpsertSingleQuestionWithCallback>(
    'question/upsertSingleQuestionWithCallbackAsync', async ({ payload, onSuccess }, thunkAPI) => {
        const { insert_ts, create_ts, id, questions_unique_id, ...restPayload } = payload
        const response = await axios_base_api.post(server_base_endpoints.questionnaire.upsert_question, restPayload)
        if (response.status === 200) {
            onSuccess(true, response.data.data)
            thunkAPI.dispatch(openSnackbarDialog({
                variant: "success",
                message: axios_Loading_messages.save_success
            }))
            return thunkAPI.fulfillWithValue(response.data.data)
        }

        onSuccess(false)
        thunkAPI.dispatch(openSnackbarDialog({
            variant: "error",
            message: axios_Loading_messages.save_error

        }))
        return thunkAPI.rejectWithValue(response.status)
    },
)



export const fetchMultipleQuestionsWithAnswersAsync = createAsyncThunk<{ count: number, data: IQuestionnaireQuestionAnswer[] }, { service_uuid: string, questionnaire_uuid: string, }>(
    'question/fetchMultipleQuestionsWithAnswersAsync', async ({ questionnaire_uuid, service_uuid }, thunkAPI) => {
        const response = await axios_base_api.get(`${server_base_endpoints.questionnaire.get_question_with_answer}?questionnaire_uuid=${questionnaire_uuid}&service_uuid=${service_uuid}`)
        const { data, totalRecords: count } = response.data;
        const finalList = data.map((item: any) => ({ ...item, id: uuidv4() }))
        return thunkAPI.fulfillWithValue({ count, data: finalList })
    }
)


// #########################################################################################################
// ######################################## Answer Module ################################################
// #########################################################################################################

export const fetchMultipleAnswersAsync = createAsyncThunk<{ count: number, data: IAnswer[] }>(
    'answer/fetchMultipleAnswersAsync', async () => {
        const response = await axios_base_api.get(server_base_endpoints.questionnaire.get_answer)
        const { data } = response.data;
        const count = response.data.totalRecords
        return { count, data }
    },
)

export const fetchMultipleAnswersWithArgsAsync = createAsyncThunk<{ count: number, data: IAnswer[] }, ISearchQueryParamsV2>(
    'answer/fetchMultipleAnswersWithArgsAsync', async (queryParams, thunkAPI) => {
        const searchQuery = getSearchQueryParamsV2(queryParams);
        const response = await axios_base_api.get(`${server_base_endpoints.questionnaire.get_answer}${searchQuery}`)
        const { data, totalRecords: count } = response.data;
        return thunkAPI.fulfillWithValue({ count, data })
    }
)

export const fetchAnswerForQuestionWithArgsAsync = createAsyncThunkGetWrapper<IAnswer, string>(
    'answer/fetchAnswerForQuestionWithArgsAsync', async (uuid, thunkAPI) => {
        const response = await axios_base_api.get(`${server_base_endpoints.questionnaire.get_answer}?questions_uuid=${uuid}&status=ACTIVE`)
        return thunkAPI.fulfillWithValue(response.data.data[0])
    },
)

export const fetchSingleAnswerWithArgsAsync = createAsyncThunkGetWrapper<IAnswer, string>(
    'answer/fetchSingleAnswerWithArgsAsync', async (uuid, thunkAPI) => {
        const response = await axios_base_api.get(`${server_base_endpoints.questionnaire.get_answer}?answers_uuid=${uuid}`)
        return thunkAPI.fulfillWithValue(response.data.data[0])
    },
)


export interface IUpsertSingleAnswerWithCallback {
    payload: IAnswer,
    onSuccess: (isSuccess: boolean, data?: IAnswer) => void
}
export const upsertSingleAnswerWithCallbackAsync = createAsyncThunkPostWrapper<IAnswer, IUpsertSingleAnswerWithCallback>(
    'answer/upsertSingleAnswerWithCallbackAsync', async ({ payload, onSuccess }, thunkAPI) => {
        const { insert_ts, create_ts, leads_uuid, ...restPayload } = payload
        const response = await axios_base_api.post(server_base_endpoints.questionnaire.upsert_answer, restPayload)
        if (response.status === 200) {
            onSuccess(true, response.data.data)
            thunkAPI.dispatch(openSnackbarDialog({
                variant: "success",
                message: axios_Loading_messages.save_success
            }))
            return thunkAPI.fulfillWithValue(response.data.data)
        }

        onSuccess(false)
        thunkAPI.dispatch(openSnackbarDialog({
            variant: "error",
            message: axios_Loading_messages.save_error

        }))
        return thunkAPI.rejectWithValue(response.status)
    },
)







// #########################################################################################################
// ##################################### QuestionOption Module #############################################
// #########################################################################################################

export const fetchMultipleQuestionOptionsAsync = createAsyncThunk<{ count: number, data: IAnswer[] }>(
    'question-qption/fetchMultipleQuestionOptionsAsync', async () => {
        const response = await axios_base_api.get(server_base_endpoints.questionnaire.get_questions_options)
        const { data } = response.data;
        const count = response.data.totalRecords
        return { count, data }
    },
)

export const fetchMultipleQuestionOptionsWithArgsAsync = createAsyncThunk<{ count: number, data: IQuestionOption[] }, ISearchQueryParamsV2>(
    'question-qption/fetchMultipleQuestionOptionsWithArgsAsync', async (queryParams, thunkAPI) => {
        const searchQuery = getSearchQueryParamsV2(queryParams);
        const response = await axios_base_api.get(`${server_base_endpoints.questionnaire.get_questions_options}${searchQuery}`)
        const { data, totalRecords: count } = response.data;
        return thunkAPI.fulfillWithValue({ count, data })
    }
)


export const fetchSingleQuestionOptionsAsync = createAsyncThunkGetWrapper<{ count: number, data: IQuestionOption[] }, string>(
    'question-qption/fetchSingleQuestionOptionsAsync', async (uuid, thunkAPI) => {
        const response = await axios_base_api.get(`${server_base_endpoints.questionnaire.get_questions_options}?questions_uuid=${uuid}`)
        const { data, totalRecords: count } = response.data;
        return thunkAPI.fulfillWithValue({ count, data })
    },
)

export const fetchSingleQuestionOptionWithArgsAsync = createAsyncThunkGetWrapper<IQuestionOption, string>(
    'question-qption/fetchSingleQuestionOptionWithArgsAsync', async (uuid, thunkAPI) => {
        const response = await axios_base_api.get(`${server_base_endpoints.questionnaire.get_questions_options}?questions_options_uuid=${uuid}`)
        return thunkAPI.fulfillWithValue(response.data.data[0])
    },
)


export interface IUpsertSingleQuestionOptionWithCallback {
    payload: IQuestionOption,
    onSuccess: (isSuccess: boolean, data?: IQuestionOption) => void
}
export const upsertSingleQuestionOptionWithCallbackAsync = createAsyncThunkPostWrapper<IAnswer, IUpsertSingleQuestionOptionWithCallback>(
    'question-qption/upsertSingleQuestionOptionWithCallbackAsync', async ({ payload, onSuccess }, thunkAPI) => {
        const { insert_ts, create_ts, questions_options_id, question_option_type, ...restPayload } = payload
        const response = await axios_base_api.post(server_base_endpoints.questionnaire.upsert_questions_options, restPayload)
        if (response.status === 200) {
            onSuccess(true, response.data.data)
            thunkAPI.dispatch(openSnackbarDialog({
                variant: "success",
                message: axios_Loading_messages.save_success
            }))
            return thunkAPI.fulfillWithValue(response.data.data)
        }

        onSuccess(false)
        thunkAPI.dispatch(openSnackbarDialog({
            variant: "error",
            message: axios_Loading_messages.save_error

        }))
        return thunkAPI.rejectWithValue(response.status)
    },
)