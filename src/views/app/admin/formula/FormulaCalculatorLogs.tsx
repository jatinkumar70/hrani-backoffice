import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageContainer } from "@/components/container/PageContainer";
import { ExpressionTransformation } from "@/components/ExpressionTransformation/ExpressionTransformation";
import {
  IFormulaCalculatorLog,
  IFormula,
  defaultFormula,
  IBookingSource
} from "@/redux/child-reducers/formula/formula.types";
import {
  fetchFormulaCalculatorLogsAsync,
  fetchBookingSourcesAsync
} from "@/redux/child-reducers/formula/formulaActions";
import { ILoadState, IStoreState, useAppDispatch, useReduxStore } from "@/redux";
import { truncate } from '@/utils/truncate';
import { Button, Input } from "@/components/ui";
import { TbPencil, TbTrash, TbPlus, TbX, TbDeviceFloppy } from "react-icons/tb";
import { Eye } from "lucide-react";
import clsx from "clsx";
import { upsertExpressionFunctionsAsync } from "@/redux/child-reducers/expressionTransformation/expressionTransformationActions";
import { produce } from "immer";

export const FormulaCalculatorLogs: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sourceReference = searchParams.get('booking_source') || '';

  const dispatch = useAppDispatch();
  const [selectedOTA, setSelectedOTA] = React.useState<string>(sourceReference);
  const [openFormulaEditor, setOpenFormulaEditor] = React.useState<IFormula | null>(null);
  const [selectedRowToEdit, setSelectedRowToEdit] = React.useState<string | null>(null);
  const [originalRows, setOriginalRows] = React.useState<IFormula[]>([]);

  const { data: calculatorLogs, totalRecords, loading, } = useReduxStore("formula").calculatorLogs;

  const { data: bookingSources, loading: bookingSourcesLoading } = useReduxStore("formula").bookingSources;;

  const [sourceFormulaRows, setSourceFormulaRows] = React.useState<IFormula[]>([]);

  // Convert calculator logs to formula format
  const convertLogsToFormulas = (logs: IFormulaCalculatorLog[]): IFormula[] => {
    return logs.map(log => ({
      ...defaultFormula,
      formula_calculator_unique_id: log.formula_calculator_unique_id,
      formula_calculator_uuid: log.formula_calculator_uuid,
      is_internal: log.is_internal,
      source_reference_in_pms: log.source_reference_in_pms,
      report_column_name: log.report_column_name,
      column_name_in_db: log.column_name_in_db,
      table_name: log.table_name,
      eval_string: log.eval_string || "",
      libraries: log.libraries || [],
      remarks: log.remarks,
      status: log.status,
      created_by_uuid: log.created_by_uuid,
      modified_by_uuid: log.modified_by_uuid
    }));
  };

  React.useEffect(() => {
    if (calculatorLogs?.length) {
      setSourceFormulaRows(convertLogsToFormulas(calculatorLogs));
    } else {
      const bookingSource = bookingSources.find((row) => row.booking_source_uuid === selectedOTA)
      setSourceFormulaRows([{
        ...defaultFormula,
        source_reference_in_pms: bookingSource ? bookingSource.source_reference_in_pms : [],
        table_name: "latest_booking"
      }]);
    }
  }, [calculatorLogs, selectedOTA]);

  React.useEffect(() => {
    dispatch(fetchBookingSourcesAsync({
      page: 1,
      rowsPerPage: 100
    }));
  }, [dispatch]);

  React.useEffect(() => {
    if (selectedOTA) {
      dispatch(
        fetchFormulaCalculatorLogsAsync(selectedOTA)
      );
    }
  }, [selectedOTA, dispatch]);

  const handleOTAChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSourceReference = event.target.value;
    setSelectedOTA(newSourceReference);
    navigate(`/app/admin/formula-calculator-logs?booking_source=${event.target.value}`);
  };

  const handleEditModeEnable = (index: number) => {
    setSelectedRowToEdit(String(index));

    // if (!editModes[index]) {
    //   setOriginalRows((prevRows) => {
    //     const updatedOriginalRows = [...prevRows];
    //     updatedOriginalRows[index] = rows[index];
    //     return updatedOriginalRows;
    //   });
    // }
  };

  const handleCancelEditMode = (index: number) => {
    // setRows((prevRows) => {
    //   const updatedRows = [...prevRows];
    //   updatedRows[index] = originalRows[index];
    //   return updatedRows;
    // });
    setSelectedRowToEdit(null);
  };

  const handleSaveFormulaClick = (index: number) => {
    console.log("handleSaveClick ==>", sourceFormulaRows, sourceFormulaRows[index])
    dispatch(
      upsertExpressionFunctionsAsync({
        data: sourceFormulaRows[index],
        onCallback: (isSuccess: boolean, data?: IFormula) => {
          if (isSuccess && data) {
            setSourceFormulaRows((prevRows) => {
              const updatedRows = [...prevRows];
              updatedRows[index] = data;
              return updatedRows;
            });
            setSelectedRowToEdit(null);
          }
        }
      })
    );
  }

  const handleFieldChange = (index: number, key: string, value: string) => {
    const newValues = produce(sourceFormulaRows, (draftState) => {
      draftState[index][key as "report_column_name"] = value
    });
    setSourceFormulaRows(newValues);
  };

  const handleAddClick = () => {
    const bookingSource = bookingSources.find((row) => row.booking_source_uuid === selectedOTA)
    setSourceFormulaRows([
      ...sourceFormulaRows,
      {
        ...defaultFormula,
        source_reference_in_pms: bookingSource ? bookingSource.source_reference_in_pms : [],
        table_name: "latest_booking"
      }
    ]);
  };

  const handleDeleteClick = (index: number) => {
    setSourceFormulaRows(sourceFormulaRows.filter((_, i) => i !== index));
  };

  const handleFormulaClick = (row: IFormula) => {
    setOpenFormulaEditor({
      ...row,
      table_name: row.table_name || "latest_booking"
    });
  };

  const handleFormulaClose = () => {
    setOpenFormulaEditor(null);
  };

  const handleFormulaComplete = () => {
    setOpenFormulaEditor(null);
    // Disable all edit modes
    setSelectedRowToEdit(null);
    // Reload the data
    if (selectedOTA) {
      dispatch(
        fetchFormulaCalculatorLogsAsync(selectedOTA)
      );
    }
  };



  return (
    <PageContainer title="Formula Calculator Logs" description="Manage formulas for specific OTA">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header with OTA Selection */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-800">Calculator Logs</h2>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">OTA:</label>
              <select
                value={selectedOTA}
                onChange={handleOTAChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={bookingSourcesLoading === ILoadState.pending}
              >
                <option value="">Select OTA</option>
                {bookingSources?.map((source: IBookingSource) => (
                  <option key={source.booking_source_uuid} value={source.booking_source_uuid ?? ""}>
                    {source.source_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="default"
              onClick={() => navigate('/app/admin/formula-mapping')}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to Sources
            </Button>
          </div>
        </div>

        {/* Table */}
        {selectedOTA ? (
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Column Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column Name in DB</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formula</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sourceFormulaRows.map((row, r_index) => (
                    <tr key={r_index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {!Boolean(row.is_internal) && 
                            <>
                              <button
                                onClick={() => handleDeleteClick(r_index)}
                                className={clsx(
                                  Boolean(row?.is_internal)
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-red-600 hover:text-blue-900"
                                )}
                                disabled={Boolean(row?.is_internal)}
                              >
                                <TbTrash className="h-5 w-5" />
                              </button>
                              <button
                                onClick={handleAddClick}
                                className={clsx(
                                  Boolean(row?.is_internal)
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-blue-600 hover:text-blue-900"
                                )}
                                disabled={Boolean(row?.is_internal) && ((sourceFormulaRows.length - 1) !== r_index)}
                              >
                                <TbPlus className="h-5 w-5" />
                              </button></>
                          }
                          {selectedRowToEdit === String(r_index) ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSaveFormulaClick(r_index)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <TbDeviceFloppy className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleCancelEditMode(r_index)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <TbX className="h-5 w-5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditModeEnable(r_index)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <TbPencil className="h-5 w-5" />
                            </button>
                          )
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Input className="w-full border-gray-200"
                          value={row.report_column_name || ""}
                          disabled={!selectedRowToEdit && Boolean(row.formula_calculator_unique_id)}
                          onChange={(e) => handleFieldChange(r_index, "report_column_name", e.target.value)}

                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Input
                          value={row.column_name_in_db || ""}
                          disabled={!selectedRowToEdit || (Boolean(row?.is_internal) && Boolean(row.formula_calculator_unique_id))}
                          onChange={(e) => handleFieldChange(r_index, "column_name_in_db", e.target.value)}
                          className="w-full"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleFormulaClick(row)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {truncate(row.eval_string || "Create formula", 80)}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No OTA Selected</h3>
              <p className="text-gray-500">Please select an OTA from the dropdown to view calculator logs.</p>
            </div>
          </div>
        )}
      </div>

      {/* Formula Editor Modal */}
      {openFormulaEditor && (
        <ExpressionTransformation
          open={true}
          data={openFormulaEditor}
          onClose={handleFormulaClose}
          onComplete={handleFormulaComplete}
          source_reference_in_pms={selectedOTA}
        />
      )}
    </PageContainer>
  );
};

export default FormulaCalculatorLogs; 