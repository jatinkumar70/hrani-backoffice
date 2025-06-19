import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label/label'
import { IProperty } from '@/redux/child-reducers/property'
import { propertyType, status } from '@/constants/constants'
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/Select/Radix-Select'
import { Select } from '@radix-ui/react-select'

interface Props {
	values: IProperty
	setFieldValue: (label: string, value: any) => {}
	handleChange: any
	touched: any
	errors: any
	isManager: boolean
	isUpdate: boolean
}

export function PropertyFormStepOne({
	values,
	handleChange,
	setFieldValue,
	touched,
	errors,
	isManager,
	isUpdate,
}: Props) {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="space-y-2">
					<Label htmlFor="property_details_name">Property Name</Label>
					<Input
						id="property_details_name"
						name="property_details_name"
						value={values.property_details_name}
						disabled
						onChange={handleChange}
						className="w-full"
					/>
				</div>

				{/* <div className="space-y-2">
					<Label htmlFor="manager">Manager</Label>
					<Input
						id="manager"
						name="manager"
						value={values.user_name}
						disabled
						className="w-full"
					/>
				</div> */}

				{/* {isUpdate && (
					<div className="space-y-2">
						<Label htmlFor="property_type">Property Type</Label>
						<Select
							isDisabled={true}
							name="property_type"
							value={values.property_type || ""}
						// onValueChange={(value: any) => {
						// 	setFieldValue("property_type", value);
						// }}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select property type" />
							</SelectTrigger>
							<SelectContent>
								{propertyType.map((type) => (
									<SelectItem key={type.value} value={type.value}>
										{type.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)} */}
				<div className="space-y-2">
					<Label htmlFor="about_property">Bedrooms</Label>
					<Input
						id="bedrooms"
						name="bedrooms"
						value={Number(values.bedrooms) || 0}
						onChange={(e) => {
							const value = e.target.value === "" ? 0 : Number(e.target.value);
							handleChange({
								target: {
									name: "bedrooms",
									value: value
								}
							});
						}}
						className="border-gray-300"
					// placeholder="Enter a detailed description of the property..."
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="about_property">Bathroom Full</Label>
					<Input
						id="bathroom_full"
						name="bathroom_full"
						value={values.bathroom_full || ""}
						onChange={handleChange}
						className="border-gray-300"
					// placeholder="Enter a detailed description of the property..."
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="about_property">Bathroom Half</Label>
					<Input
						id="bathroom_half"
						name="bathroom_half"
						value={values.bathroom_half || ""}
						onChange={handleChange}
						className="border-gray-300"
					// placeholder="Enter a detailed description of the property..."
					/>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						id="booking_request"
						name="booking_request"
						checked={Boolean(values.booking_request)}
						onChange={(e) => setFieldValue("booking_request", e.target.checked ? 1 : 0)}
						className="h-6 w-6"
					/>
					<Label htmlFor="booking_request">On request Booking</Label>
				</div>

			</div>

		</div>
	);
}
