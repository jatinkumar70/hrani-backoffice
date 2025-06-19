import { ILoadState } from "@/redux/store.enums";
import { IExternalVariable } from "../expressionTransformation/expressionTransformation.types";


export interface IFormulaState {
  data: IFormula[];
  totalRecords: number;
  loading: ILoadState;
  error: string | null;
  // New booking sources state
  bookingSources: {
    data: IBookingSource[];
    totalRecords: number;
    loading: ILoadState;
    error: string | null;
  };
  // New OTA options state  
  otaOptions: {
    data: IOTAOption[];
    loading: ILoadState;
    error: string | null;
  };
  // New formula calculator logs state
  calculatorLogs: {
    data: IFormulaCalculatorLog[];
    totalRecords: number;
    loading: ILoadState;
    error: string | null;
  };
}

export interface IFormula {
  formula_calculator_unique_id: number;
  formula_calculator_uuid: string | null;
  is_internal: number;
  source_reference_in_pms: string[];
  report_column_name: string;
  column_name_in_db: string;
  table_name: string;
  eval_string: string;
  libraries: string[];
  remarks: string | null;
  status: string;
  created_by_uuid: string | null;
  modified_by_uuid: string | null;
  create_ts?: string;
  insert_ts?: string;
  external_variable_reference: IExternalVariable | null
}

// New interface for booking sources
export interface IBookingSource {
  booking_source_uuid: string | null;
  source_name: string;
  source_reference_in_pms: string[];
  remarks: string;
  status: string;

}

// New interface for OTA options (from get-formula-external-variable endpoint)
export interface IOTAOption {
  referer: string;
  // Add other properties if needed from the booking object
}

// New interface for formula calculator logs
export interface IFormulaCalculatorLog {
  formula_calculator_unique_id: number;
  formula_calculator_uuid: string;
  is_internal: number;
  source_reference_in_pms: string[];
  report_column_name: string;
  column_name_in_db: string;
  table_name: string;
  eval_string: string;
  libraries: string[];
  remarks: string;
  status: string;
  created_by_uuid: string;
  modified_by_uuid: string;
  create_ts?: string;
  insert_ts?: string;
}

export const initialFormulaState: IFormulaState = {
  data: [],
  loading: ILoadState.idle,
  totalRecords: 0,
  error: null,
  bookingSources: {
    data: [],
    totalRecords: 0,
    loading: ILoadState.idle,
    error: null,
  },
  otaOptions: {
    data: [],
    loading: ILoadState.idle,
    error: null,
  },
  calculatorLogs: {
    data: [],
    totalRecords: 0,
    loading: ILoadState.idle,
    error: null,
  },
};

export const defaultFormula: IFormula = {
  formula_calculator_unique_id: 0,
  formula_calculator_uuid: null,
  is_internal: 1,
  source_reference_in_pms: [],
  report_column_name: "",
  column_name_in_db: "",
  table_name: "",
  eval_string: "",
  libraries: [],
  remarks: null,
  status: "ACTIVE",
  created_by_uuid: null,
  modified_by_uuid: null,
  external_variable_reference: null,
};

// New default booking source
export const defaultBookingSource: IBookingSource = {
  booking_source_uuid: null,
  source_name: "",
  source_reference_in_pms: [],
  remarks: "",
  status: "ACTIVE",
};
