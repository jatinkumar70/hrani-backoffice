import React, { ChangeEvent } from "react";
import { IExpressionTransformationProps } from "./ExpressionTransformation.types";




import {
  IExpressTransformFunParams,
  IExpressTransformObject,
  IExternalVariable,
  IVariableItem,
} from "../../redux/child-reducers/expressionTransformation/expressionTransformation.types";
import {
  fetchInternalFunctionsAsync,
  fetchExpressionFunctionsAsync,
  upsertExpressionFunctionsAsync,
  fetchExternalVariablesAsync
} from "../../redux/child-reducers/expressionTransformation/expressionTransformationActions";

import { javascript } from "@codemirror/lang-javascript";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { useFormik } from "formik";
import { produce } from "immer";
import { showMessage } from "../../redux/messages/messagesActions";
import { CreateCodeRightPanel } from "./CreateCodeRightPanel";
import { ExpressionValidateRightPanel } from "./ExpressionValidateRightPanel";


import { useDispatchWrapper } from "@/hooks/useDispatch";
import { ILoadState } from "@/redux/store.enums";
import { defaultFormula, IFormula } from "../../redux/child-reducers/formula/formula.types";
import { useReduxStore } from "@/redux";
import { ExternalVariablesTree } from "./components/ExternalVariablesTree";


export const ExpressionTransformation: React.FC<IExpressionTransformationProps> = (props) => {
  const { open, data: mappingData, onClose, onComplete } = props;

  const dispatch = useDispatchWrapper();
  const {
    funsVars: { data: internalFunctionsList, loading, error },
    externalFunctions: { data: externalFunctionsList, loading: externalFunctionsLoading, error: externalFunctionsError },
    external_variables_list: { data: variablesList, loading: variablesLoading, error: variablesError, totalRecords, }
  } = useReduxStore("expressionTransformation");

  const [openValidate, setOpenValidate] = React.useState(false);

  const {
    values,
    setFieldValue,
    handleSubmit,
    setValues,
    handleChange,
    errors,
  } = useFormik({
    initialValues: defaultFormula,
    validate: (values) => {
      const errors: any = {};
      if (!values.source_reference_in_pms) {
        errors.source_reference_in_pms = "*This is Required";
      }
      return errors;
    },
    onSubmit: (values) => {
      try {
        dispatch(
          upsertExpressionFunctionsAsync({
            data: {
              ...values,
              source_reference_in_pms: values.source_reference_in_pms,
              eval_string: values.eval_string,
              libraries: values.libraries,
              status: values.status,
              created_by_uuid: values.created_by_uuid,
              modified_by_uuid: values.modified_by_uuid,
              table_name: values.table_name ?? "latest_booking"
            },
            onCallback: (isSuccess: boolean, data?: IFormula) => {
              if (isSuccess) {
                onClose();
              }
            }
          })
        );
      } catch (error) {
        console.log(error);
        onClose();
      }
    },
  });


  const editorRef = React.useRef<ReactCodeMirrorRef | null>(null);
  const cursorPosRef = React.useRef<any>(0);
  const [tablePagination, setTablePagination] = React.useState({
    pageNumber: 1,
    rowsInPerPage: 20,
  });
  const [searchValue, setSearchValue] = React.useState("");
  const [openCreateCode, setOpenCreateCode] = React.useState<IVariableItem | null>(null);
  const [openFolder, setOpenFolder] = React.useState<string | null>(null);

  // etch internal and external functions 
  React.useEffect(() => {
    dispatch(fetchExpressionFunctionsAsync());
    dispatch(fetchInternalFunctionsAsync());
  }, []);

  React.useEffect(() => {
    if (mappingData) {
      setValues(mappingData);
      dispatch(fetchExternalVariablesAsync(mappingData.source_reference_in_pms[1]));
    }
  }, [mappingData, setValues]);

  const handleOpenFolder = (key: string) => () => {
    const previousValue = openFolder;
    if (previousValue === key) {
      setOpenFolder(null);
    } else {
      setOpenFolder(key);
    }
  };

  const insertTextAtCursor = (text: string) => {
    if (!editorRef.current) {
      return;
    }
    const editor = editorRef.current.view;
    if (editor) {
      const cursorPosition = editor.state.selection.main.from;
      cursorPosRef.current = cursorPosition;
      const newValues = produce(values, (draftValues) => {
        draftValues.eval_string = draftValues.eval_string.slice(0, cursorPosition) + text + draftValues.eval_string.slice(cursorPosition);
      });
      setValues(newValues);
      // Move the cursor position after the inserted text
      setTimeout(() => {
        // Update cursor position after state update
        editor.dispatch({
          selection: {
            anchor: cursorPosition + text.length, // Move cursor to the end of inserted text
            head: cursorPosition + text.length,
          },
        });
      }, 0);
    }
  };

  const handleLeftButtonsClick = (value: string) => {
    insertTextAtCursor(value);
  };

  const handleClear = () => {
    setFieldValue("eval_string", "");
  };

  // const handleVariableClick = (item: IVariableItem) => () => {
  //   const snippet = item.has_multiple_values
  //     ? `CODE["${item.group_code}"][index:number]`
  //     : `CODE["${item.group_code}"]`;

  //   insertTextAtCursor(snippet);
  // };

  const copyToClipboard = (item: string) => async () => {
    await navigator.clipboard.writeText(item);
    dispatch(
      showMessage({
        type: "success",
        displayAs: "snackbar",
        message: "Text copied successfully!",
      }),
    );
  };

  const handleFuncClick = (
    mainKey: string,
    subKey: string,
    returnType: any,
    params: IExpressTransformFunParams[],
  ) => {
    if (!editorRef.current) {
      return;
    }
    const editor = editorRef.current.view;
    if (editor) {
      let content = "";
      const cursorPosition = editor?.state.selection.main.from;
      cursorPosRef.current = cursorPosition;

      const newValues = produce(values, (draftValues: IFormula) => {
        if (!values.eval_string) {
          draftValues.eval_string = "";
        }
        const formulaArray = draftValues.eval_string.split(",");
        if (!formulaArray.includes(mainKey)) {
          //formulaArray.push(mainKey);
          draftValues.eval_string = formulaArray.join(",");
        }
        if (!values.libraries) {
          draftValues.libraries = [];
        }
        const index = draftValues.libraries.indexOf(mainKey);
        if (index === -1) {
          draftValues.libraries.push(mainKey);
        }
        content = content + " " + subKey + "(";
        for (const parm of params) {
          content = content + parm.name + ":" + parm.type + ",";
        }
        content = content.slice(0, -1) + ")";

        draftValues.eval_string =
          draftValues.eval_string.slice(0, cursorPosition) +
          content +
          draftValues.eval_string.slice(cursorPosition);
      });
      setValues(newValues);
      setTimeout(() => {
        // Update cursor position after state update
        editor.dispatch({
          selection: {
            anchor: cursorPosition + content.length, // Move cursor to the end of inserted content
            head: cursorPosition + content.length,
          },
        });
      }, 0);
    }
  };

  const handleExternalFuncClick = (
    mainKey: string,
    subKey: string,
    returnType: any,
    params: IExpressTransformFunParams[],
  ) => {
    if (!editorRef.current) {
      return;
    }
    const editor = editorRef.current.view;
    if (editor) {
      let content = "";
      const cursorPosition = editor.state.selection.main.from;
      cursorPosRef.current = cursorPosition;
      const newValues = produce(values, (draftValues) => {
        content = `${content}${mainKey}.${subKey}(`;
        for (const parm of params) {
          content = content + parm.name + ":" + parm.type + ",";
        }
        content = content.slice(0, -1) + ")";
        draftValues.eval_string =
          draftValues.eval_string.slice(0, cursorPosition) +
          content +
          draftValues.eval_string.slice(cursorPosition);
      });
      setValues(newValues);
      setTimeout(() => {
        // Update cursor position after state update
        editor.dispatch({
          selection: {
            anchor: cursorPosition + content.length, // Move cursor to the end of inserted content
            head: cursorPosition + content.length,
          },
        });
      }, 0);
    }
  };

  const handlePageChange = (
    event: ChangeEvent<unknown> | null,
    value: number,
  ) => {
    setTablePagination({ ...tablePagination, pageNumber: value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSearchValue(value);
  };

  const handleVariableClick = (text: string) => {
    const snippet = `EXTERNAL_VAR.CODE.${text}`;
    insertTextAtCursor(snippet);
  }

  const handleValidateFormula = () => {
    setOpenValidate(true)
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Expression - {values.source_reference_in_pms} ({mappingData.report_column_name})
            </h2>
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
          <div className="flex-1 overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-12 h-full">
                {/* Left Sidebar */}
                <div className="col-span-3 border-r border-gray-200">
                  <div className="p-2  h-9/10 overflow-y-auto">

                    {/* Functions List */}
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setOpenFolder(openFolder === "Functions" ? null : "Functions")}
                        className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md"
                      >
                        <div className="flex items-center">
                          {openFolder === "Functions" ? (
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                          <span className="ml-2 font-medium">Functions</span>
                        </div>
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      </button>

                      {openFolder === "Functions" && (
                        <div className="mt-2 pl-4">
                          {loading === ILoadState.pending && (
                            <div className="flex flex-col items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                              <p className="mt-2 text-gray-600">Loading, please wait...</p>
                            </div>
                          )}

                          {loading === ILoadState.failed && (
                            <div className="flex flex-col items-center justify-center py-8">
                              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              <p className="mt-2 text-red-600 font-semibold">{error}</p>
                            </div>
                          )}

                          {loading === ILoadState.succeeded &&
                            Object.keys(internalFunctionsList).map((key, index) => {
                              const dataObject = internalFunctionsList[key];
                              return (
                                <TreeListItem
                                  key={index}
                                  mainKey={key}
                                  item={dataObject}
                                  onClick={handleFuncClick}
                                />
                              );
                            })}
                        </div>
                      )}

                      {/* External Functions */}
                      <button
                        type="button"
                        onClick={() => setOpenFolder(openFolder === "External Functions" ? null : "External Functions")}
                        className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md"
                      >
                        <div className="flex items-center">
                          {openFolder === "External Functions" ? (
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                          <span className="ml-2 font-medium">External Functions</span>
                        </div>
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      </button>

                      {openFolder === "External Functions" && (
                        <div className="mt-2 pl-4">
                          {externalFunctionsLoading === ILoadState.pending && (
                            <div className="flex flex-col items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                              <p className="mt-2 text-gray-600">Loading, please wait...</p>
                            </div>
                          )}

                          {externalFunctionsLoading === ILoadState.failed && (
                            <div className="flex flex-col items-center justify-center py-8">
                              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              <p className="mt-2 text-red-600 font-semibold">{externalFunctionsError}</p>
                            </div>
                          )}

                          {externalFunctionsLoading === ILoadState.succeeded &&
                            Object.keys(externalFunctionsList).map((key, index) => {
                              return (
                                <TreeListItem
                                  key={index}
                                  mainKey={key}
                                  item={externalFunctionsList[key]}
                                  onClick={handleExternalFuncClick}
                                />
                              );
                            })}
                        </div>
                      )}

                      {/* Variables */}
                      <button
                        type="button"
                        onClick={() => setOpenFolder(openFolder === "Variables" ? null : "Variables")}
                        className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md"
                      >
                        <div className="flex items-center">
                          {openFolder === "Variables" ? (
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                          <span className="ml-2 font-medium">Variables</span>
                        </div>
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      </button>

                      {openFolder === "Variables" && (
                        <div className="mt-2 pl-4">

                          {variablesLoading === ILoadState.pending && (
                            <div className="flex flex-col items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                              <p className="mt-2 text-gray-600">Loading, please wait...</p>
                            </div>
                          )}

                          {variablesLoading === ILoadState.failed && (
                            <div className="flex flex-col items-center justify-center py-8">
                              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              <p className="mt-2 text-red-600 font-semibold">{variablesError}</p>
                            </div>
                          )}

                          {variablesLoading === ILoadState.succeeded &&
                            variablesList.map((variable, v_index) => (
                              <ExternalVariablesTree
                                key={v_index}
                                index={v_index}
                                externalVariable={variable}
                                selected={values.external_variable_reference}
                                setSelected={(data) => setFieldValue("external_variable_reference", data)}
                                onVariableClick={handleVariableClick}
                              />
                            ))}

                          {totalRecords > 0 && (
                            <div className="flex justify-center mt-4">
                              <nav className="flex items-center space-x-2">
                                {Array.from({ length: Math.ceil(totalRecords / tablePagination.rowsInPerPage) }).map((_, i) => (
                                  <button
                                    key={i}
                                    onClick={() => handlePageChange(null, i + 1)}
                                    className={`px-3 py-1 rounded-md ${tablePagination.pageNumber === i + 1
                                      ? 'bg-blue-500 text-white'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                      }`}
                                  >
                                    {i + 1}
                                  </button>
                                ))}
                              </nav>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="col-span-9 flex flex-col">
                  {/* Code Editor */}
                  <div className="flex-1 border-b border-gray-200">
                    <CodeMirror
                      ref={editorRef}
                      value={values.eval_string}
                      height="400px"
                      theme="dark"
                      extensions={[javascript()]}
                      onChange={(value) => {
                        setFieldValue("eval_string", value);
                      }}
                      className="border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Bottom Section */}
                  <div className="p-4">
                    <div className="grid grid-cols-12 gap-4">
                      {/* Left Side */}
                      <div className="col-span-9">
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                          {/* Logical Operators */}
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            {[
                              { label: "AND", value: "&" },
                              { label: "OR", value: "||" },
                              { label: "NOT", value: "!" },
                            ].map((item) => (
                              <button
                                key={item.label} type="button"
                                onClick={() => handleLeftButtonsClick(item.value)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>

                          {/* Other Operators */}
                          <div className="grid grid-cols-6 gap-2">
                            {[
                              { label: "(", value: "(" },
                              { label: ")", value: ")" },
                              { label: "<", value: "<" },
                              { label: ">", value: ">" },
                              { label: "=", value: "=" },
                              { label: "!=", value: "!=" },
                              { label: "+", value: "+" },
                              { label: "-", value: "-" },
                              { label: "<=", value: "<=" },
                              { label: ">=", value: ">=" },
                              { label: "%", value: "%" },
                              { label: "||", value: "||" },
                              { label: "*", value: "*" },
                              { label: "/", value: "/" },
                              { label: "'", value: "'" },
                              { label: `"`, value: '"' },
                              { label: `,`, value: "," },
                              { label: `:`, value: ":" },
                            ].map((item) => (
                              <button type="button"
                                key={item.label}
                                onClick={() => handleLeftButtonsClick(item.value)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Side */}
                      <div className="col-span-3">
                        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
                          <button
                            onClick={handleClear}
                            type="button"
                            className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            Clear
                          </button>
                          <button
                            onClick={handleValidateFormula}
                            type="button"
                            className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            Validate & Save
                          </button>

                          {/* <button
                            type="button"
                            onClick={handleValidateFormula}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            Save
                          </button> */}

                          <button
                            onClick={onClose}
                            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          >
                            Cancel
                          </button>

                          <button
                            // onClick={() => setOpenCreateCode(INITIAL_CODE)}
                            className="w-full px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 font-medium"
                          >
                            Create Variable
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {openValidate && (
        <ExpressionValidateRightPanel
          open={open}
          data={values}
          onClose={() => setOpenValidate(false)}
          onComplete={() => {
            setOpenValidate(false);
            onComplete();
          }}
        />
      )}

      {openCreateCode && (
        <CreateCodeRightPanel
          open={true}
          data={openCreateCode}
          onComplete={() => { }}
          onClose={() => setOpenCreateCode(null)}
        />
      )}
    </div>
  );
};

const TreeListItem: React.FC<{
  item: IExpressTransformObject;
  mainKey: string;
  onClick: (
    mainKey: string,
    subKey: string,
    returnType: any,
    params: IExpressTransformFunParams[],
  ) => void;
}> = ({ item, mainKey, onClick }) => {
  const [open, setOpen] = React.useState(false);
  const keys = Object.keys(item);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center p-2 hover:bg-gray-100 rounded-md"
      >
        {open ? (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
        <span className="ml-2 font-medium">{mainKey}</span>
      </button>

      {keys.length > 0 && open && (
        <div className="pl-4 mt-1">
          {keys.map((childKey, index) => {
            const params = item[childKey].params;
            return (
              <button
                key={childKey}
                onClick={() => onClick(mainKey, childKey, item[childKey].return, params)}
                className="w-full flex items-center p-2 hover:bg-gray-100 rounded-md"
                type="button"
              >
                {/* Summation (∑) icon */}
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <text x="3" y="18" fontSize="18" fontFamily="serif">∑</text>
                </svg>
                <span className="ml-2">{childKey}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
