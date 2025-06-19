import React from "react";
import { useFormik } from "formik";
import { IBookingSource, defaultBookingSource } from "@/redux/child-reducers/formula/formula.types";
import { ConfirmDialog } from '@/components/shared';
import { BookingSourceAutoSearchMultiSelect } from "../auto-search/booking-source-auto-search";
import { Switcher } from "@/components/ui";

// Add this type to omit booking_source_uuid from the payload
export type BookingSourcePayload = Omit<IBookingSource, 'booking_source_uuid'>;

interface IBookingSourceDialogProps {
  open: boolean;
  data?: IBookingSource | null;
  onClose: () => void;
  onSave: (data: BookingSourcePayload) => void;
}

export const BookingSourceDialog: React.FC<IBookingSourceDialogProps> = ({
  open,
  data,
  onClose,
  onSave,
}) => {
  const formik = useFormik({
    initialValues: data || defaultBookingSource,
    enableReinitialize: true,
    validate: (values) => {
      const errors: any = {};
      if (!values.source_name?.trim()) {
        errors.source_name = "Source name is required";
      }
      if (values.source_reference_in_pms?.length < 1) {
        errors.source_reference_in_pms = "Source reference is required";
      }
      return errors;
    },
    onSubmit: (values) => {
      // Exclude booking_source_uuid from the payload
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { booking_source_uuid, ...rest } = values;
      onSave(rest);
    },
  });

  return (
    <ConfirmDialog
      isOpen={open}
      type="info"
      title={data?.booking_source_uuid ? "Edit Booking Source" : "Add Booking Source"}
      onClose={() => {
        formik.resetForm();
        onClose();
      }}
      onRequestClose={() => {
        formik.resetForm();
        onClose();
      }}
      onCancel={() => {
        formik.resetForm();
        onClose();
      }}
      onConfirm={formik.submitForm}
      confirmText={formik.isSubmitting ? "Saving..." : "Save"}
      cancelText="Cancel"
      confirmButtonProps={{ disabled: formik.isSubmitting }}
      cancelButtonProps={{}}
    >
      <form
        onSubmit={formik.handleSubmit}
        className="space-y-4 pt-2 w-full"
        style={{ width: "100%" }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
      >
        {/* Source Name */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source Name *
          </label>
          <input
            type="text"
            name="source_name"
            value={formik.values.source_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formik.touched.source_name && formik.errors.source_name
              ? "border-red-500"
              : "border-gray-300"
              }`}
            placeholder="Enter source name"
            autoFocus
          />
          {formik.touched.source_name && formik.errors.source_name && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.source_name}</p>
          )}
        </div>

        {/* Source Reference */}
        <div className="w-full">
          <BookingSourceAutoSearchMultiSelect
            value={formik.values.source_reference_in_pms}
            label="Source Reference *"
            placeholder="Select Source"
            onSelect={(newSources) => {
              formik.setFieldValue("source_reference_in_pms", newSources)
            }}
          />
          {/* <input
            type="text"
            name="source_reference_in_pms"
            value={formik.values.source_reference_in_pms}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formik.touched.source_reference_in_pms && formik.errors.source_reference_in_pms
              ? "border-red-500"
              : "border-gray-300"
              }`}
            placeholder="Enter source reference"
          /> */}
          {formik.touched.source_reference_in_pms && formik.errors.source_reference_in_pms && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.source_reference_in_pms}</p>
          )}
        </div>

        {/* Remarks */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Remarks
          </label>
          <textarea
            name="remarks"
            value={formik.values.remarks}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter remarks (optional)"
          />
        </div>

        {/* Status */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <div className="flex flex-row gap-2 items-center justify-start">
            <label className="block text-sm font-medium text-gray-800 mb-1">
              In Active
            </label>
            <Switcher
              checked={Boolean(formik.values.status === "ACTIVE")}
              onChange={(checked, evt) => formik.setFieldValue("status", checked ? "ACTIVE" : "INACTIVE")} />
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Active
            </label>
          </div>

          {/* <select
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select> */}
        </div>
      </form>
    </ConfirmDialog>
  );
}; 