// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
// 	ICheckboxSelection,
// 	MultipleCheckboxSection,
// } from "@/components/common/multiple-checkbox-section";
// import { food_type } from "@/constants/constants";
// import { IProperty } from "@/models/Property.model";
// import React, { useCallback, useState, useEffect } from "react";

// interface Props {
// 	setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
// 	values: IProperty;
// }

// export function PropertyFormStepSix({ setFieldValue, values }: Props) {
// 	const [foodInfo, setFoodInfo] = useState<ICheckboxSelection[]>([]);
// 	const [averagePrice, setAveragePrice] = useState<{
// 		name: string;
// 		value: number;
// 	}>({
// 		name: "Average price",
// 		value: 0,
// 	});

// 	const handleCheckboxChange = useCallback((value: ICheckboxSelection[]) => {
// 		setFoodInfo([...value]);
// 	}, []);

// 	/*************  ✨ Codeium Command ⭐  *************/
// 	/**
// 	 * Handles changes in the food and dining form
// 	 * @param {string} key - The key of the changed field
// 	 * @param {any} value - The new value of the changed field
// 	 */
// 	/******  2768ca57-589c-4e1c-be0d-dd130602d644  *******/
// 	const handleChangeFoodDining = (key: string, value: any) => {
// 		if (key === "average_price") {
// 			setAveragePrice({ name: "Average price", value: parseFloat(value) });
// 		}
// 	};

// 	useEffect(() => {
// 		const combinedValue = [...foodInfo, averagePrice];
// 		setFieldValue("food_and_dinning", combinedValue);
// 	}, [foodInfo, averagePrice, setFieldValue]);

// 	return (
// 		<div className="grid grid-cols-1 gap-6">
// 			<div className="col-span-1">
// 				<MultipleCheckboxSection
// 					sections={food_type}
// 					onSelectionChange={handleCheckboxChange}
// 					value={values.food_and_dinning}
// 				/>
// 			</div>
// 			<div className="col-span-1">
// 				<div className="space-y-3">
// 					<h3 className="text-base font-bold">
// 						Average price
// 					</h3>
// 					<Input
// 						name="average_price"
// 						className="w-full"
// 						value={
// 							values.food_and_dinning?.length > 1
// 								? values.food_and_dinning[1]?.value
// 								: 0
// 						}
// 						onChange={(e) =>
// 							handleChangeFoodDining("average_price", e.target.value)
// 						}
// 					/>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
