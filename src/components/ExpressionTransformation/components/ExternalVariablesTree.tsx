import VariableSvg from '@/assets/svg/VariableSvg';
import { IExternalVariable } from '@/redux/child-reducers/expressionTransformation/expressionTransformation.types';
import _, { isArray, isEmpty, isNull, isObject } from 'lodash';
import React, { useState } from 'react'

export const ExternalVariablesTree: React.FC<{
    index: number
    externalVariable: IExternalVariable;
    selected: IExternalVariable | null
    setSelected: (obj: IExternalVariable | null) => void
    onVariableClick: (text: string) => void
}> = ({ externalVariable, selected, index, setSelected, onVariableClick }) => {

    return (
        <div key={index}>
            <button
                type="button"
                onClick={() => setSelected(selected && selected.raw_pms_booking_uuid === externalVariable.raw_pms_booking_uuid ? null : externalVariable)}
                className={`w-full flex items-center p-2 hover:bg-gray-100 rounded-md ${selected && selected.raw_pms_booking_uuid === externalVariable.raw_pms_booking_uuid && "bg-green-100"}`}
            >
                {selected && selected.raw_pms_booking_uuid === externalVariable.raw_pms_booking_uuid ? (
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                )}
                <span className="ml-2 font-medium">{`Variable ${index + 1}`}</span>
            </button>

            {selected && selected.raw_pms_booking_uuid === externalVariable.raw_pms_booking_uuid && Object.keys(selected).filter(key => key !== "raw_pms_booking_uuid").map((key, idx) => (
                <ExternalVariablesSubTree
                    parentkey={key}
                    index={idx}
                    data={selected}
                    onVariableClick={onVariableClick}

                />
            ))}
        </div>
    );
};


export const ExternalVariablesSubTree: React.FC<{
    index: number
    parentkey: string
    data: IExternalVariable;
    onVariableClick: (text: string) => void
}> = ({ parentkey, data: variableData, index, onVariableClick }) => {
    const [openDialog, setOpenDialog] = React.useState<{ key: keyof IExternalVariable, idx: number } | null>(null);

    const handleToggle = (data: { key: keyof IExternalVariable, idx: number } | null) => {
        if (isNull(data)) return setOpenDialog(null)
        setOpenDialog(prev => prev && _.isEqual(prev, data) ? null : data);
    };

    return (
        <>
            <div>
                <button
                    type="button"
                    onClick={() => handleToggle({ key: parentkey as "booking", idx: index })}
                    className="w-full flex items-center p-4 hover:bg-gray-100 rounded-md"
                >
                    {openDialog ? (
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    )}
                    <span className="ml-2 font-medium">{parentkey}</span>
                </button>
            </div>
            {openDialog && (
                <>

                    {isArray(variableData[openDialog.key]) ? <ExternalVariablesArrayTree
                        preAppendKey={openDialog.key}
                        items={variableData[openDialog.key] as any}
                        onVariableClick={onVariableClick} />
                        : isObject(variableData[openDialog.key]) ?
                            <ExternalVariablesObjectTree
                                preAppendKey={openDialog.key}
                                booking={variableData[openDialog.key] as any}
                                onVariableClick={onVariableClick} />
                            : <></>}
                </>
            )}
        </>
    );
};



export const ExternalVariablesObjectTree: React.FC<{
    padding?: number,
    preAppendKey: string
    booking: { [key: string]: unknown };
    onVariableClick: (text: string) => void
}> = ({ booking, onVariableClick, preAppendKey, padding = 0 }) => {

    return (
        <>
            {Object.keys(booking).filter((key) => isEmpty(booking[key as keyof typeof booking])).map((objKey, o_index) => {
                return (
                    <button
                        key={o_index}
                        onClick={() => onVariableClick(`${preAppendKey}.${objKey}`)}
                        className={`w-full flex items-center p-2 px-${padding + 8} hover:bg-gray-100 rounded-md`}
                        type="button"
                    >
                        {/* Summation (∑) icon */}
                        <VariableSvg height={10} width={10} />
                        <span className="ml-2">{objKey}</span>
                    </button>
                );
            })}
        </>
    );
};


export const ExternalVariablesArrayTree: React.FC<{
    preAppendKey: string
    items: IExternalVariable["infoItems"] | IExternalVariable["invoiceItems"];
    onVariableClick: (text: string) => void
}> = ({ items, onVariableClick, preAppendKey }) => {
    const [selectedIndex, setSelectedIndex] = useState<String | null>(null)


    const handleToggle = (idx: number) => {
        setSelectedIndex(prev => prev && prev === idx.toString() ? null : idx.toString());
    };

    return (
        <>
            {items.map((arrayItem, a_index) => {
                return (
                    <>
                        <button
                            type="button"
                            onClick={() => handleToggle(a_index)}
                            className="w-full flex items-center p-2 px-6 hover:bg-gray-100 rounded-md"
                        >
                            {selectedIndex === a_index.toString() ? (
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                            <span className="ml-2 font-medium">{`Item ${a_index + 1}`}</span>
                        </button>
                        {selectedIndex === a_index.toString() && (
                            <ExternalVariablesObjectTree
                             padding={2}
                                booking={arrayItem as any}
                                onVariableClick={onVariableClick} preAppendKey={`${preAppendKey}[${selectedIndex}]`} />
                        )}
                    </>
                )
            })}

        </>
    );
};