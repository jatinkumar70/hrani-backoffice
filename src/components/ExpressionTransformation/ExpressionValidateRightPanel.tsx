import React from "react";

import { useFormik } from "formik";
import { IExpressionValidateRightPanelProps } from "./ExpressionvalidateRightPanel.types";

import { useSelector } from "react-redux";
import { IStoreState } from "@/redux/store.types";
import {
  upsertExpressionFunctionsAsync,
  validateSingleFormulaAsync,
} from "../../redux/child-reducers/expressionTransformation/expressionTransformationActions";
import { produce } from "immer";
import { IExpressionValidatePayload, IExternalVariable } from "../../redux/child-reducers/expressionTransformation/expressionTransformation.types";
import { IFormula } from "../../redux/child-reducers/formula/formula.types";
import { useDispatchWrapper } from "@/hooks/useDispatch";
import { useReduxStore } from "@/redux";

export const ExpressionValidateRightPanel: React.FC<IExpressionValidateRightPanelProps> = (props) => {
  const { open, data, onComplete, onClose } = props;
  const {
    funsVars: { data: internalFunctionsList, loading, error },
    external_variables_list: { data: variablesList, loading: variablesLoading, error: variablesError, totalRecords, }
  } = useReduxStore("expressionTransformation");

  const [message, setMessage] = React.useState<{
    type: string;
    content: string;
  } | null>(null);
  const dispatch = useDispatchWrapper();

  const [values, setValues] = React.useState<IExpressionValidatePayload>({
    eval_string: "",
    libraries: [],
    externalVariable: {},
  });

  const handleSaveAndValidate = () => {
    setMessage(null);
    dispatch(
      upsertExpressionFunctionsAsync({
        data: { ...data },
        onCallback: (isSuccess, data) => {
          if (isSuccess) {
            onComplete();
          }
        }
      }),
    );
  };

  const handleValidate = () => {
    dispatch(
      validateSingleFormulaAsync({
        payload: {
          ...values,
          externalVariable: data.external_variable_reference as any,
          libraries: Object.keys(internalFunctionsList),
          eval_string: values.eval_string.replace(/:[a-zA-Z0-9_]+/g, ""),
        },
        onCallback: (isSuccess, message) => {
          if (isSuccess) {
            setMessage({ type: "info", content: message });
          } else {
            setMessage({ type: "error", content: message });
          }
        },
      }),
    );
  };

  const handleVarChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValues = produce(values, (draftValues) => {
      draftValues.externalVariable[key] = e.target.value;
    });
    setValues(newValues);
  };

  React.useEffect(() => {
    const words = data.eval_string.split(/[^a-zA-Z0-9_]+/);
    // const result = words.filter((word: any) =>
    //   variablesList.some(
    //     (variable) => variable.csio_edi_groupcode_definition_code === word,
    //   ),
    // );
    const newValues = produce(values, (draftvalues: IFormula) => {
      draftvalues.eval_string = data.eval_string;
      draftvalues.eval_string = data.eval_string as string;
    });
    setValues(newValues);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-50">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Validate</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-2xl font-semibold mb-4">Fill the parameters</h3>

          {message && (
            <div className={`p-4 mb-4 rounded-md ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
              <div className="flex justify-between items-center">
                <span>{message.content}</span>
                <button
                  onClick={() => setMessage(null)}
                  className="text-current hover:opacity-75"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {Object.keys(values.externalVariable).length === 0 && (
            <div className="min-h-[500px] flex flex-col justify-center items-center">
              <div className="flex justify-center mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-center font-semibold max-w-[80%]">
                There is no parameter found for input from your code. Please click 'Save' to proceed further.
              </p>
            </div>
          )}

          <div className="grid gap-4">
            {Object.keys(values.externalVariable).map((variableKey, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {variableKey}
                </label>
                <input
                  type="text"
                  value={values.externalVariable[variableKey]}
                  onChange={handleVarChange(variableKey)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Close
            </button>
            <button
              onClick={handleValidate}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Validate
            </button>
            <button
              onClick={handleSaveAndValidate}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Validate & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
