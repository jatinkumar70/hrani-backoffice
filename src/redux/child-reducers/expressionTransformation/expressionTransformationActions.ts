import { createAsyncThunk } from "@reduxjs/toolkit";
import { saveLoaderCompleted, saveLoaderProgress, showMessage } from "../../messages/messagesActions";
import { ERROR_MESSAGES } from "../../store.enums";
import { IFormula } from "../formula/formula.types";
import { IExpressionTransfromFunsVars, IExpressionValidatePayload, IExpresssionTranform, IExternalVariable, IVariableItem } from "./expressionTransformation.types";
import { server_base_endpoints } from "@/api";
import axios_base_api from "@/api/axios-base-api";

// Fetch Expression Columns
export const fetchInternalFunctionsAsync = createAsyncThunk<{ count: number, data: IExpressionTransfromFunsVars }>(
  'expressionTransformation/fetchInternalFunctionsAsync',
  async (queryParams, thunkAPI) => {
    try {
      const response = await axios_base_api.get(server_base_endpoints.formulas.get_formula_external_functions);
      const { data, totalRecords: count } = response.data;
      return { count, data };
    } catch (error: any) {
      thunkAPI.dispatch(
        showMessage({
          type: "error",
          message: error.response?.data?.message || error.message,
          displayAs: "snackbar",
        })
      );
      return thunkAPI.rejectWithValue(ERROR_MESSAGES.SERVER_ERROR);
    }
  }
);

// Fetch Expression Functions
export const fetchExpressionFunctionsAsync = createAsyncThunk<IExpressionTransfromFunsVars>(
  'expressionTransformation/fetchExpressionFunctionsAsync',
  async (_, thunkAPI) => {
    try {
      const response = await axios_base_api.get(`${server_base_endpoints.formulas.get_formula_internal_functions}?all_at_once=true`);
      const data = response.data.data;
      if (Object.keys(data).length > 0) {
        return data;
      }
      return thunkAPI.rejectWithValue(ERROR_MESSAGES.NO_RECORD_FOUND);
    } catch (error: any) {
      thunkAPI.dispatch(
        showMessage({
          type: "error",
          message: error.response?.data?.message || error.message,
          displayAs: "snackbar",
        })
      );
      return thunkAPI.rejectWithValue(ERROR_MESSAGES.SERVER_ERROR);
    }
  }
);

interface IGetExternalVariable extends IExternalVariable {
  raw_id: string
  raw_pms_booking_id: string
  raw_pms_booking_uuid: string
}

export const fetchExternalVariablesAsync = createAsyncThunk<{ count: number, data: IExternalVariable[] }, string>(
  'expressionTransformation/fetchExternalVariablesAsync',
  async (source_reference_in_pms, thunkAPI) => {
    try {
      const response = await axios_base_api.get(server_base_endpoints.formulas.get_formula_external_variable, {
        params: {
          source_reference_in_pms
        }
      });
      const { data, currentRecords } = response.data
      const newRecords: IExternalVariable[] = data.length > 0 ? data.map((item: IGetExternalVariable) => {
        const { raw_id, raw_pms_booking_id, ...rest} = item
        return rest
      }) : []
      return thunkAPI.fulfillWithValue({ count: currentRecords, data: newRecords })
    } catch (error: any) {
      thunkAPI.dispatch(
        showMessage({
          type: "error",
          message: error.response?.data?.message || error.message,
          displayAs: "snackbar",
        })
      );
      return thunkAPI.rejectWithValue(ERROR_MESSAGES.SERVER_ERROR);
    }
  }
);


// Fetch Expression Mappings
export const fetchExpressionMappingsAsync = createAsyncThunk<{ data: IExpresssionTranform[], selectedTable: string }, string>(
  'expressionTransformation/fetchExpressionMappingsAsync',
  async (selectedTable, thunkAPI) => {
    try {
      const response = await axios_base_api.get(`/csio/get-csio-formula-calculator-log?table_name=${selectedTable}`);
      const data = response.data.data;
      return { data, selectedTable };
    } catch (error: any) {
      thunkAPI.dispatch(
        showMessage({
          type: "error",
          message: error.response?.data?.message || error.message,
          displayAs: "snackbar",
        })
      );
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Upsert Expression Functions
export const upsertExpressionFunctionsAsync = createAsyncThunk<IFormula, { data: IFormula, onCallback: (isSuccess: boolean, data?: IFormula) => void }>(
  'expressionTransformation/upsertExpressionFunctionsAsync',
  async ({ data, onCallback }, thunkAPI) => {
    try {
      const { created_by_uuid, create_ts, insert_ts, modified_by_uuid, formula_calculator_unique_id, ...rest } = data;
      const response = await axios_base_api.post(server_base_endpoints.formulas.upsert_formula_calculator, { ...rest });
      const responseData = response.data.data;
      onCallback(true, responseData);
      thunkAPI.dispatch(
        showMessage({
          type: "success",
          message: "Mapping completed successfully!",
          displayAs: "snackbar",
        })
      );
      return responseData;
    } catch (error: any) {
      onCallback(false);
      thunkAPI.dispatch(
        showMessage({
          type: "error",
          message: error.response?.data?.message || error.message,
          displayAs: "snackbar",
        })
      );
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Validate Expression
export const validateSingleFormulaAsync = createAsyncThunk<{ isSuccess: boolean, message: string }, { payload: IExpressionValidatePayload, onCallback: (isSuccess: boolean, message: string) => void }>(
  'expressionTransformation/validateSingleFormulaAsync',
  async ({ payload, onCallback }, thunkAPI) => {
    try {
      thunkAPI.dispatch(saveLoaderProgress());
      const response = await axios_base_api.post(server_base_endpoints.formulas.validate_formula, payload);
      const data = response.data.data;
      const result = data.result.status === 1;
      onCallback(result, result ? "Validation successful!" : data.error);
      return { isSuccess: result, message: result ? "Validation successful!" : data.error };
    } catch (error: any) {
      thunkAPI.dispatch(
        showMessage({
          type: "error",
          message: error.response?.data?.message || error.message,
          displayAs: "snackbar",
        })
      );
      return thunkAPI.rejectWithValue(error.message);
    } finally {
      thunkAPI.dispatch(saveLoaderCompleted());
    }
  }
);

export const upsertExpressionCodeAsync = createAsyncThunk<void, { data: IVariableItem, onCallback: (isSuccess: boolean, error?: any) => void }>(
  'expressionTransformation/upsertExpressionCodeAsync',
  async ({ data, onCallback }, thunkAPI) => {
    try {
      thunkAPI.dispatch(saveLoaderProgress());
      await axios_base_api.post("/csio/upsert-csio-formula-internal-variable", data);
      onCallback(true);
      thunkAPI.dispatch(
        showMessage({
          type: "success",
          message: "Code saved successfully!",
          displayAs: "snackbar",
        })
      );
    } catch (error: any) {
      onCallback(false, error);
      thunkAPI.dispatch(
        showMessage({
          type: "error",
          message: error.response?.data?.message || error.message,
          displayAs: "snackbar",
        })
      );
      return thunkAPI.rejectWithValue(error.message);
    } finally {
      thunkAPI.dispatch(saveLoaderCompleted());
    }
  }
);
