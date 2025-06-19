import React, { useCallback, useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "../ui/Label/label";

export interface ICheckboxSelection {
    name: string;
    value: string[];
}

interface MultipleCheckboxProps {
    sections: ICheckboxSelection[];
    onSelectionChange: (selected: ICheckboxSelection[]) => void;
    value: ICheckboxSelection[];
    divideBySections?: number;
}

const divideItemsIntoColumns = (items: string[], numColumns: number) => {
    const columns: string[][] = Array.from({ length: numColumns }, () => []);
    items.forEach((item: string, index: number) => {
        columns[index % numColumns].push(item);
    });
    return columns;
};

export const MultipleCheckboxSection = React.memo(
    ({
        sections,
        onSelectionChange,
        value,
        divideBySections = 1,
    }: MultipleCheckboxProps) => {
        const [selectedValues, setSelectedValues] = useState<ICheckboxSelection[]>(
            sections.map((section) => ({
                name: section.name,
                value: Array.isArray(value)
                    ? value.find((v) => v?.name === section?.name)?.value || []
                    : [],
            }))
        );

        const handleCheckboxChange = useCallback(
            (sectionName: string, item: string, checked: boolean) => {
                setSelectedValues((prevSelectedValues) => {
                    return prevSelectedValues.map((section) => {
                        if (section.name === sectionName) {
                            const newValue = checked
                                ? [...section.value, item]
                                : section.value.filter((value) => value !== item);

                            return { ...section, value: newValue };
                        }
                        return section;
                    });
                });
            },
            []
        );

        useEffect(() => {
            const filteredSelectedValues = selectedValues.filter(
                (section) => section.value.length > 0
            );
            onSelectionChange(filteredSelectedValues);
        }, [selectedValues, onSelectionChange]);

        return (
            <div className="grid gap-4">
                {sections.map((section, sectionIndex) => {
                    const dividedItems = divideItemsIntoColumns(
                        section.value,
                        divideBySections
                    );
                    return (
                        <div key={sectionIndex} className="space-y-2">
                            <Label className="text-sm font-semibold">
                                {section.name}
                            </Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {dividedItems.map((columnItems, columnIndex) => (
                                    <div key={columnIndex} className="space-y-2">
                                        {columnItems.map((item, itemIndex) => (
                                            <div key={itemIndex} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`${section.name}-${item}`}
                                                    checked={
                                                        selectedValues
                                                            .find((sec) => sec.name === section.name)
                                                            ?.value.includes(item) || false
                                                    }
                                                    onChange={(checked, e) =>
                                                        handleCheckboxChange(
                                                            section.name,
                                                            item,
                                                            checked
                                                        )
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`${section.name}-${item}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {item}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
);
