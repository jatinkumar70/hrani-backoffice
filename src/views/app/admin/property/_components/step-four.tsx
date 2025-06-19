import { ILocationDetails } from "@/components/models/Location.model";
import { Label } from "@/components/ui/Label/label";
import { IProperty } from "@/redux/child-reducers/property";

import { useEffect, useState, useRef } from "react";
import { api } from "@/utils/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select/Radix-Select";
import { Input } from "@/components/ui";
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import Switcher from '@/components/ui/Switcher';

interface Area {
	locations_unique_id: number;
	locations_uuid: string;
	location_name: string;
	city: string;
	status: string;
	created_by_uuid: string | null;
	created_by_name: string | null;
	modified_by_uuid: string | null;
	modified_by_name: string | null;
	create_ts: string;
	insert_ts: string;
}

interface Props {
	values: IProperty;
	handleChange: any;
	setValues: (val: IProperty) => void;
}

export function PropertyFormStepFour({
	values,
	handleChange,
	setValues,
}: Props) {
	const [areaOptions, setAreaOptions] = useState<Area[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredOptions, setFilteredOptions] = useState<Area[]>([]);
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
	const [newAreaName, setNewAreaName] = useState("");
	const [isAreaActive, setIsAreaActive] = useState(true);

	// Validate required props
	if (!values || typeof handleChange !== 'function' || typeof setValues !== 'function') {
		console.error('PropertyFormStepFour: Missing required props');
		return null;
	}

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownVisible(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		const fetchAreaOptions = async () => {
			setIsLoading(true);
			try {
				const response = await api.get("/property/get-property-area");
				if (response?.data?.data) {
					setAreaOptions(response.data.data);
					setFilteredOptions(response.data.data);
				} else {
					setAreaOptions([]);
					setFilteredOptions([]);
				}
			} catch (error) {
				console.error("Error fetching area options:", error);
				setAreaOptions([]);
				setFilteredOptions([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAreaOptions();
	}, []);

	useEffect(() => {
		if (!searchQuery || searchQuery.trim() === "") {
			// Filter areas based on city match
			const filtered = areaOptions.filter(option =>
				option?.city?.toLowerCase() === (values.property_city?.toLowerCase() || '')
			);
			setFilteredOptions(filtered);
		} else {
			const filtered = areaOptions.filter(option =>
				option?.location_name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
				option?.city?.toLowerCase() === (values.property_city?.toLowerCase() || '')
			);
			setFilteredOptions(filtered);
		}
	}, [searchQuery, areaOptions, values.property_city]);

	const handleAreaChange = (area: Area) => {
		if (!area?.location_name) return;

		handleChange({
			target: {
				name: 'area',
				value: area.location_name
			}
		});
		setSearchQuery(area.location_name);
		setIsDropdownVisible(false);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target?.value || '';
		setSearchQuery(value);
		handleChange({
			target: {
				name: 'area',
				value: value
			}
		});
		setIsDropdownVisible(true);
	};

	const handleInputFocus = () => {
		setIsDropdownVisible(true);
	};

	const handleLocation = (data: ILocationDetails) => {
		setValues({
			...values,
			property_place_id: data.place_id,
			property_rating: data.rating ? data.rating?.toString() : "",
			latitude: data.latitude?.toString(),
			longitude: data.longitude?.toString(),
			property_address_line_1: data.address_line1,
			property_address_line_2: data.address_line2,
			property_city: data.city,
			property_state: data.state,
			property_pincode: data.pin_code,
			property_country: data.country,
		});
	};

	const handleAreaCreation = async () => {
		if (!newAreaName?.trim() || !values.property_city) {
			return;
		}

		try {
			const response = await api.post("/property/upsert-property-area", {
				locations_uuid: null,
				location_name: newAreaName.trim(),
				city: values.property_city,
				status: isAreaActive ? "ACTIVE" : "INACTIVE"
			});

			if (response?.data) {
				// Refresh area options from API
				const areaResponse = await api.get("/property/get-property-area");
				if (areaResponse?.data?.data) {
					setAreaOptions(areaResponse.data.data);
					setFilteredOptions(areaResponse.data.data);
				}

				// Set the selected area
				handleAreaChange(response.data);
			}
		} catch (error) {
			console.error("Error creating new area:", error);
		} finally {
			setIsConfirmDialogOpen(false);
			setNewAreaName("");
			setIsAreaActive(true);
		}
	};

	const handleAddNewArea = (areaName: string) => {
		if (!areaName?.trim()) return;
		setNewAreaName(areaName);
		setIsConfirmDialogOpen(true);
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div>
				<Label htmlFor="longitude" className="mb-2 block">Longitude</Label>
				<Input
					id="longitude"
					name="longitude"
					disabled
					className="w-full"
					value={values.longitude}
					onChange={handleChange}
				/>
			</div>

			<div>
				<Label htmlFor="latitude" className="mb-2 block">Latitude</Label>
				<Input
					id="latitude"
					name="latitude"
					className="w-full"
					value={values.latitude}
					onChange={handleChange}
					disabled
				/>
			</div>

			<div>
				<Label htmlFor="property_rating" className="mb-2 block">Rating</Label>
				<Input
					id="property_rating"
					name="property_rating"
					className="w-full"
					value={values.property_rating}
					onChange={handleChange}
					disabled
				/>
			</div>

			<div>
				<Label htmlFor="property_address_line_1" className="mb-2 block">Property Address Line 1</Label>
				<Input
					id="property_address_line_1"
					type="text"
					name="property_address_line_1"
					className="w-full"
					value={values.property_address_line_1}
					onChange={handleChange}
					disabled
				/>
			</div>

			<div>
				<Label htmlFor="property_address_line_2" className="mb-2 block">Address Line 2</Label>
				<Input
					id="property_address_line_2"
					type="text"
					name="property_address_line_2"
					className="w-full"
					value={values.property_address_line_2}
					onChange={handleChange}
					disabled
				/>
			</div>

			<div>
				<Label htmlFor="property_city" className="mb-2 block">City</Label>
				<Input
					id="property_city"
					type="text"
					name="property_city"
					className="w-full"
					value={values.property_city}
					onChange={handleChange}
					disabled
				/>
			</div>

			<div>
				<Label htmlFor="area" className="mb-2 text-gray-800 block">Area</Label>
				<div className="relative" ref={dropdownRef}>
					<Input
						type="text"
						value={values.area || searchQuery}
						onChange={handleSearchChange}
						onFocus={handleInputFocus}
						placeholder="Type to search or add area"
						className="w-full"
					/>
					{isDropdownVisible && (
						<div className="absolute w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-[300px] overflow-y-auto z-10">
							{filteredOptions.map((option) => (
								<div
									key={option.locations_uuid}
									className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
									onClick={() => handleAreaChange(option)}
								>
									{option.location_name}
								</div>
							))}
							{searchQuery && filteredOptions.length === 0 && (
								<div
									className="px-3 py-2 text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
									onClick={() => handleAddNewArea(searchQuery)}
								>
									Add "{searchQuery}"
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			<div>
				<Label htmlFor="property_state" className="mb-2 block">State</Label>
				<Input
					id="property_state"
					type="text"
					name="property_state"
					className="w-full"
					value={values.property_state}
					onChange={handleChange}
					disabled
				/>
			</div>

			<div>
				<Label htmlFor="property_pincode" className="mb-2 block">Pincode</Label>
				<Input
					id="property_pincode"
					type="text"
					name="property_pincode"
					className="w-full"
					value={values.property_pincode}
					onChange={handleChange}
					disabled
				/>
			</div>

			<div>
				<Label htmlFor="property_country" className="mb-2 block">Country</Label>
				<Input
					id="property_country"
					type="text"
					name="property_country"
					className="w-full"
					value={values.property_country}
					onChange={handleChange}
					disabled
				/>
			</div>

			<ConfirmDialog
				isOpen={isConfirmDialogOpen}
				type="info"
				title="Add New Area"
				onClose={() => {
					setIsConfirmDialogOpen(false);
					setNewAreaName("");
					setIsAreaActive(true);
				}}
				onRequestClose={() => {
					setIsConfirmDialogOpen(false);
					setNewAreaName("");
					setIsAreaActive(true);
				}}
				onCancel={() => {
					setIsConfirmDialogOpen(false);
					setNewAreaName("");
					setIsAreaActive(true);
				}}
				onConfirm={handleAreaCreation}
				confirmText="Create Area"
				cancelText="Cancel"
				confirmButtonProps={{
					variant: 'solid',
					className: 'bg-primary-500 hover:bg-primary-600 text-black'
				}}
				cancelButtonProps={{
					variant: 'plain'
				}}
			>
				<div className="space-y-4 mt-4">
					<div className="space-y-2">
						<Label>Area Name:</Label>
						<Input
							type="text"
							value={newAreaName}
							onChange={(e) => setNewAreaName(e.target.value)}
							placeholder="Enter area name"
							className="w-full"
						/>
					</div>
					<div className="space-y-2">
						<Label>City:</Label>
						<Input
							type="text"
							value={values.property_city}
							disabled
							className="w-full"
						/>
					</div>
					{/* <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
						<div className="flex flex-col">
							<span className="text-gray-700 dark:text-gray-200 font-medium mb-1">
								Status
							</span>
							<span className="text-sm text-gray-500 dark:text-gray-400">
								Set whether this area should be active or inactive
							</span>
						</div>
						<div className="flex items-center space-x-2">
							<Switcher
								checked={isAreaActive}
								onChange={(checked: boolean) => setIsAreaActive(checked)}
								switcherClass={isAreaActive ? "bg-emerald-500" : "bg-gray-400"}
							/>
							<Label className="text-gray-700 dark:text-gray-200">
								{isAreaActive ? 'Active' : 'Inactive'}
							</Label>
						</div>
					</div> */}
					{!newAreaName.trim() && (
						<div className="text-amber-500 text-sm">
							Please enter an area name to continue
						</div>
					)}
				</div>
			</ConfirmDialog>
		</div>
	);
}
