import { createSlice } from "@reduxjs/toolkit";

import { ILoadState } from "@/redux/store.enums";
import { defaultQuestionnaireState } from "./questionnaire.state";
import {
    fetchMultipleAnswersWithArgsAsync,
    fetchMultipleQuestionnairesWithArgsAsync,
    fetchMultipleQuestionOptionsWithArgsAsync,
    fetchMultipleQuestionsWithAnswersAsync,
    fetchMultipleQuestionsWithArgsAsync,
    fetchSingleAnswerWithArgsAsync,
    fetchSingleQuestionnaireWithArgsAsync,
    fetchSingleQuestionOptionsAsync,
    fetchSingleQuestionOptionWithArgsAsync,
    fetchSingleQuestionWithArgsAsync
} from "./questionnaire.actions";



const questionnaireSlice = createSlice({
    initialState: defaultQuestionnaireState,
    name: "questionnaire",
    reducers: {
        clearQuestionnaireFullStateSync: (state) => {
            return defaultQuestionnaireState
        },
        clearQuestionnaireListStateSync: (state) => {
            state.questionnaire_list.loading = defaultQuestionnaireState.questionnaire_list.loading
            state.questionnaire_list.data = defaultQuestionnaireState.questionnaire_list.data
            state.questionnaire_list.error = defaultQuestionnaireState.questionnaire_list.error
        },
        clearSingleQuestionnaireStateSync: (state) => {
            state.single_questionnaire.loading = defaultQuestionnaireState.single_questionnaire.loading
            state.single_questionnaire.data = defaultQuestionnaireState.single_questionnaire.data
            state.single_questionnaire.error = defaultQuestionnaireState.single_questionnaire.error
        },
        clearQuestionsListStateSync: (state) => {
            state.questions_list.loading = defaultQuestionnaireState.questions_list.loading
            state.questions_list.data = defaultQuestionnaireState.questions_list.data
            state.questions_list.error = defaultQuestionnaireState.questions_list.error
        },
        clearQuestionsWithAnswersListStateSync: (state) => {
            state.questions_with_answers_list.loading = defaultQuestionnaireState.questions_with_answers_list.loading
            state.questions_with_answers_list.data = defaultQuestionnaireState.questions_with_answers_list.data
            state.questions_with_answers_list.error = defaultQuestionnaireState.questions_with_answers_list.error
        },
        clearSingleQuestionStateSync: (state) => {
            state.single_question.loading = defaultQuestionnaireState.single_question.loading
            state.single_question.data = defaultQuestionnaireState.single_question.data
            state.single_question.error = defaultQuestionnaireState.single_question.error
        },
        clearAnswersListStateSync: (state) => {
            state.answers_list.loading = defaultQuestionnaireState.answers_list.loading
            state.answers_list.data = defaultQuestionnaireState.answers_list.data
            state.answers_list.error = defaultQuestionnaireState.answers_list.error
        },
        clearSingleAnswerStateSync: (state) => {
            state.single_answer.loading = defaultQuestionnaireState.single_answer.loading
            state.single_answer.data = defaultQuestionnaireState.single_answer.data
            state.single_answer.error = defaultQuestionnaireState.single_answer.error
        },
        clearQuestionOptionsListStateSync: (state) => {
            state.questions_options_list.loading = defaultQuestionnaireState.questions_options_list.loading
            state.questions_options_list.data = defaultQuestionnaireState.questions_options_list.data
            state.questions_options_list.error = defaultQuestionnaireState.questions_options_list.error
        },
        clearSingleQuestionOptionStateSync: (state) => {
            state.single_questions_option.loading = defaultQuestionnaireState.single_questions_option.loading
            state.single_questions_option.data = defaultQuestionnaireState.single_questions_option.data
            state.single_questions_option.error = defaultQuestionnaireState.single_questions_option.error
        },
    },
    extraReducers: (builder) => {
        // ############################# fetchMultipleQuestionnairesWithArgsAsync ######################################
        builder.addCase(fetchMultipleQuestionnairesWithArgsAsync.pending, (state, action) => {
            state.questionnaire_list.loading = ILoadState.pending
        })
        builder.addCase(fetchMultipleQuestionnairesWithArgsAsync.fulfilled, (state, action) => {
            state.questionnaire_list.loading = ILoadState.succeeded
            state.questionnaire_list.data = action.payload.data
            state.questionnaire_list.count = action.payload.count
            state.questionnaire_list.error = null
        })
        builder.addCase(fetchMultipleQuestionnairesWithArgsAsync.rejected, (state, action) => {
            state.questionnaire_list.error = action.error.message as string
        })
        // #################################### fetchSingleQuestionnaireWithArgsAsync ##############################################
        builder.addCase(fetchSingleQuestionnaireWithArgsAsync.pending, (state, action) => {
            state.single_questionnaire.loading = ILoadState.pending
        })
        builder.addCase(fetchSingleQuestionnaireWithArgsAsync.fulfilled, (state, action) => {
            state.single_questionnaire.loading = ILoadState.succeeded
            state.single_questionnaire.data = action.payload
            state.single_questionnaire.error = null
        })
        builder.addCase(fetchSingleQuestionnaireWithArgsAsync.rejected, (state, action) => {
            state.single_questionnaire.error = action.error.message as string
        })






        // ############################# fetchMultipleQuestionsWithArgsAsync ######################################
        builder.addCase(fetchMultipleQuestionsWithArgsAsync.pending, (state, action) => {
            state.questions_list.loading = ILoadState.pending
        })
        builder.addCase(fetchMultipleQuestionsWithArgsAsync.fulfilled, (state, action) => {
            state.questions_list.loading = ILoadState.succeeded
            state.questions_list.data = action.payload.data
            state.questions_list.count = action.payload.count
            state.questions_list.error = null
        })
        builder.addCase(fetchMultipleQuestionsWithArgsAsync.rejected, (state, action) => {
            state.questions_list.error = action.error.message as string
        })
        // ############################# fetchMultipleQuestionsWithAnswersAsync ######################################
        builder.addCase(fetchMultipleQuestionsWithAnswersAsync.pending, (state, action) => {
            state.questions_with_answers_list.loading = ILoadState.pending
        })
        builder.addCase(fetchMultipleQuestionsWithAnswersAsync.fulfilled, (state, action) => {
            state.questions_with_answers_list.loading = ILoadState.succeeded
            state.questions_with_answers_list.data = action.payload.data
            state.questions_with_answers_list.count = action.payload.count
            state.questions_with_answers_list.error = null
        })
        builder.addCase(fetchMultipleQuestionsWithAnswersAsync.rejected, (state, action) => {
            state.questions_with_answers_list.error = action.error.message as string
        })


        // #################################### fetchSingleQuestionWithArgsAsync ##############################################
        builder.addCase(fetchSingleQuestionWithArgsAsync.pending, (state, action) => {
            state.single_question.loading = ILoadState.pending
        })
        builder.addCase(fetchSingleQuestionWithArgsAsync.fulfilled, (state, action) => {
            state.single_question.loading = ILoadState.succeeded
            state.single_question.data = action.payload
            state.single_question.error = null
        })
        builder.addCase(fetchSingleQuestionWithArgsAsync.rejected, (state, action) => {
            state.single_question.error = action.error.message as string
        })






        // ############################# fetchMultipleAnswersWithArgsAsync ######################################
        builder.addCase(fetchMultipleAnswersWithArgsAsync.pending, (state, action) => {
            state.answers_list.loading = ILoadState.pending
        })
        builder.addCase(fetchMultipleAnswersWithArgsAsync.fulfilled, (state, action) => {
            state.answers_list.loading = ILoadState.succeeded
            state.answers_list.data = action.payload.data
            state.answers_list.count = action.payload.count
            state.answers_list.error = null
        })
        builder.addCase(fetchMultipleAnswersWithArgsAsync.rejected, (state, action) => {
            state.answers_list.error = action.error.message as string
        })
        // #################################### fetchSingleAnswerWithArgsAsync ##############################################
        builder.addCase(fetchSingleAnswerWithArgsAsync.pending, (state, action) => {
            state.single_answer.loading = ILoadState.pending
        })
        builder.addCase(fetchSingleAnswerWithArgsAsync.fulfilled, (state, action) => {
            state.single_answer.loading = ILoadState.succeeded
            state.single_answer.data = action.payload
            state.single_answer.error = null
        })
        builder.addCase(fetchSingleAnswerWithArgsAsync.rejected, (state, action) => {
            state.single_answer.error = action.error.message as string
        })





        // ############################# fetchMultipleQuestionOptionsWithArgsAsync ######################################
        builder.addCase(fetchMultipleQuestionOptionsWithArgsAsync.pending, (state, action) => {
            state.questions_options_list.loading = ILoadState.pending
        })
        builder.addCase(fetchMultipleQuestionOptionsWithArgsAsync.fulfilled, (state, action) => {
            state.questions_options_list.loading = ILoadState.succeeded
            state.questions_options_list.data = action.payload.data
            state.questions_options_list.count = action.payload.count
            state.questions_options_list.error = null
        })
        builder.addCase(fetchMultipleQuestionOptionsWithArgsAsync.rejected, (state, action) => {
            state.questions_options_list.error = action.error.message as string
        })
        // ############################# fetchSingleQuestionOptionsAsync ######################################
        builder.addCase(fetchSingleQuestionOptionsAsync.pending, (state, action) => {
            state.questions_options_list.loading = ILoadState.pending
        })
        builder.addCase(fetchSingleQuestionOptionsAsync.fulfilled, (state, action) => {
            state.questions_options_list.loading = ILoadState.succeeded
            state.questions_options_list.data = action.payload.data
            state.questions_options_list.count = action.payload.count
            state.questions_options_list.error = null
        })
        builder.addCase(fetchSingleQuestionOptionsAsync.rejected, (state, action) => {
            state.questions_options_list.error = action.error.message as string
        })
        // #################################### fetchSingleQuestionOptionWithArgsAsync ##############################################
        builder.addCase(fetchSingleQuestionOptionWithArgsAsync.pending, (state, action) => {
            state.single_questions_option.loading = ILoadState.pending
        })
        builder.addCase(fetchSingleQuestionOptionWithArgsAsync.fulfilled, (state, action) => {
            state.single_questions_option.loading = ILoadState.succeeded
            state.single_questions_option.data = action.payload
            state.single_questions_option.error = null
        })
        builder.addCase(fetchSingleQuestionOptionWithArgsAsync.rejected, (state, action) => {
            state.single_questions_option.error = action.error.message as string
        })
    },
});

export const questionnaireReducer = questionnaireSlice.reducer;
export const {
    clearQuestionnaireFullStateSync,
    clearQuestionnaireListStateSync,
    clearSingleQuestionStateSync,
    clearSingleQuestionnaireStateSync,
    clearQuestionsListStateSync,
    clearAnswersListStateSync,
    clearSingleAnswerStateSync,
    clearQuestionOptionsListStateSync,
    clearSingleQuestionOptionStateSync,
    clearQuestionsWithAnswersListStateSync
} = questionnaireSlice.actions;
