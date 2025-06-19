import { IProperty } from "@/redux/child-reducers/property";


interface Props {
	values: IProperty;
	setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
	handleSubmit: () => void;
}

export function PropertyFormStepTen({ values, setFieldValue, handleSubmit }: Props) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
			{Object.entries(values.bookingQuestions).map(([key, question]) => (
				<div key={key} className="w-full">
					<label className="block text-sm font-medium text-gray-700 mb-1">
						{key}
					</label>
					<input
						type="number"
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
						disabled
						name={`bookingQuestions.${key}.order`}
						value={(question as any).order ?? ""}
						readOnly={(question as any).usage === "internal"}
					/>
				</div>
			))}

		</div>
	);
}
