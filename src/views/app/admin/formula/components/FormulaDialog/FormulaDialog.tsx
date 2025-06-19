import React from "react";
import { useFormik } from "formik";
import { useDispatchWrapper } from "@/hooks/useDispatch";
import { defaultFormula } from "@/redux/child-reducers/formula/formula.types";
import { upsertExpressionFunctionsAsync } from "@/redux/child-reducers/expressionTransformation/expressionTransformationActions";


interface IFormulaDialogProps {
  open: boolean;
  onClose: () => void;
  onComplete: (data?: any) => void;
}

export const FormulaDialog: React.FC<IFormulaDialogProps> = (props) => {
  const { open, onClose, onComplete } = props;

  const dispatch = useDispatchWrapper();

  const { values, handleChange, errors, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: defaultFormula,
      validate: (values) => {
        const errors: any = {};
        if (!values.name) {
          errors.name = "Required";
        }
        return errors;
      },
      onSubmit: (values) => {
        try {
          dispatch(
            upsertExpressionFunctionsAsync(values, (isSuccess: boolean, data: any) => {
              if (isSuccess) {
                onComplete(data);
                onClose();
              }
            }),
          );
        } catch (error) {
          console.log(error);
          onClose();
        }
      },
    });

  const handleOnSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFieldValue("status", event.target.value);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Create Formula</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Formula Name
            </label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={values.status}
              onChange={handleOnSelect}
              className={`w-full px-3 py-2 border rounded-md ${errors.status ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Select Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="PROSPECT">Prospect</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-500">{errors.status}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
