import { ILoadState } from "../../store.enums";
import { IFormula } from "../formula/formula.types";

export interface IExpressionTransformationState {
  selectedTableName: string;
  mappings: {
    data: IExpresssionTranform[];
    loading: ILoadState;
  };
  funsVars: {
    data: IExpressionTransfromFunsVars;
    loading: ILoadState;
    error: string | null;
  };
  external_variables_list: {
    data: IExternalVariable[];
    loading: ILoadState;
    totalRecords: number;
    error: string | null;
  };
  externalFunctions: {
    data: IExpressionTransfromFunsVars;
    loading: ILoadState;
    count: number;
    error: string | null;
  };
}

export interface IExternalVariable {
  raw_pms_booking_uuid: string
  booking: IExternalVariableBooking
  invoiceItems: IExternalVariableInvoiceItem[]
  infoItems: IExternalVariableInfoItem[]
}

export interface IExternalVariableBooking {
  id: number
  fax: string
  tax: number
  city: string
  email: string
  phone: string
  price: number
  state: string
  title: string
  mobile: string
  roomId: number
  status: string
  unitId: number
  address: string
  arrival: string
  channel: string
  company: string
  country: string
  deposit: number
  offerId: number
  referer: string
  roomQty: number
  country2: string
  lastName: string
  masterId: string
  numAdult: number
  numChild: number
  postcode: string
  departure: string
  firstName: string
  subStatus: string
  commission: number
  propertyId: number
  arrivalTime: string
  bookingTime: string
  bookingGroup: string
  modifiedTime: string
}

export interface IExternalVariableInvoiceItem {
  id: number
  qty: number
  type: string
  amount: number
  status: string
  subType: number
  vatRate: number
  bookingId: number
  createdBy: number
  lineTotal: number
  createTime: string
  invoiceeId: string
  description: string
}

export interface IExternalVariableInfoItem {
  [key: string]: unknown
}

export interface IVariableItem {
  csio_edi_groupcode_definition_id?: number | null;
  csio_edi_groupcode_definition_code: string | null;
  group_code: string;
  start_index: number;
  element_length: number;
  has_multiple_values: number;
  status: string;
  created_by_id?: number | null;
  created_by_name?: string | null;
  modified_by_id?: number | null;
  modified_by_name?: string | null;
  create_ts?: string;
  insert_ts?: string;
}

export type IExpressionTransfromFunsVars = Record<string, IExpressTransformObject>;
export type IExpressTransformObject = Record<string, {
  params: IExpressTransformFunParams[];
  return: string;
}>;

export interface IExpressTransformFunParams {
  name: string;
  type: any;
  required: boolean;
}

export interface IExpresssionTranform {
  csio_formula_calculator_id?: string;
  csio_formula_calculator_code: string | null;
  table_name: string | null;
  column_name: string | null;
  eval_string: string;
  libraries: string[];
  status: string;
  modified_by_id?: string | null;
  modified_by_name?: string | null;
  create_ts?: string | null;
  insert_ts?: string | null;
}

export interface IFormulaState {
  list: {
    data: IFormula[];
  };
}

export interface IExpressionValidatePayload {
  eval_string: string;
  libraries: string[];
  externalVariable: {
    [key: string]: string;
  };
}

export const initialExprressionTransformPayload: IExpresssionTranform = {
  csio_formula_calculator_code: null,
  table_name: null,
  column_name: null,
  eval_string: "",
  libraries: [],
  status: "ACTIVE",
};

export const initialExpressionTransformation: IExpressionTransformationState = {
  selectedTableName: "",
  mappings: {
    data: [],
    loading: ILoadState.idle,
  },
  funsVars: {
    data: {},
    loading: ILoadState.idle,
    error: null,
  },
  external_variables_list: {
    data: [],
    loading: ILoadState.idle,
    totalRecords: 0,
    error: null,
  },
  externalFunctions: {
    data: {},
    loading: ILoadState.idle,
    count: 0,
    error: null,
  },
};
