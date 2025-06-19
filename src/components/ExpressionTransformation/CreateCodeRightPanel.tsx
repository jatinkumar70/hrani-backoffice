import React from "react";
import { ICreateCodeRightPanelProps } from "./CreateCodeRightPanel.types";
import { useFormik } from "formik";

import { upsertExpressionCodeAsync } from "../../redux/child-reducers/expressionTransformation/expressionTransformationActions";
import { IVariableItem } from "../../redux/child-reducers/expressionTransformation/expressionTransformation.types";
import { useDispatchWrapper } from "@/hooks/useDispatch";

export const CreateCodeRightPanel: React.FC<ICreateCodeRightPanelProps> = (props) => {
  const { open, data, onComplete, onClose } = props;
  const [showError, setShowError] = React.useState<any>(null);
  const dispatch = useDispatchWrapper();

  const { values, errors, handleChange, handleSubmit, setFieldValue } = useFormik<IVariableItem>({
    initialValues: data,
    validate: (values) => {
      const errors: any = {};
      if (!values.group_code) {
        errors.group_code = "Group code is requried!";
      } else if (values.start_index === null) {
        errors.start_index = "Start index is requried!";
      } else if (values.element_length === null) {
        errors.element_length = "Element length is requried!";
      }
      return errors;
    },
    onSubmit: (values) => {
      setShowError(null);
      dispatch(
        upsertExpressionCodeAsync({
          data: values,
          onCallback: (isSuccess, error) => {
            if (error) {
              setShowError(error.response.data.message);
              return;
          }
            onComplete();
          },
        }),
      );
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-50">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Create Code</h2>
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4">
          {showError && (
            <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md">
              <div className="flex justify-between items-center">
                <span>{showError}</span>
                <button
                  onClick={() => setShowError(null)}
                  className="text-current hover:opacity-75"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group Code
              </label>
              <input
                type="text"
                name="group_code"
                value={values.group_code}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.group_code ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.group_code && (
                <p className="mt-1 text-sm text-red-600">{errors.group_code}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Index
              </label>
              <input
                type="number"
                name="start_index"
                value={values.start_index}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.start_index ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.start_index && (
                <p className="mt-1 text-sm text-red-600">{errors.start_index}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Element Length
              </label>
              <input
                type="number"
                name="element_length"
                value={values.element_length}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.element_length ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.element_length && (
                <p className="mt-1 text-sm text-red-600">{errors.element_length}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Has Multiple Values
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.has_multiple_values === 1}
                  onChange={(e) => setFieldValue("has_multiple_values", e.target.checked ? 1 : 0)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={values.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </form>

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
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
