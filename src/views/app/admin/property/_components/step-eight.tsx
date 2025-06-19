// import { Checkbox, FormControlLabel, Grid } from "@mui/material";
// import { LocationAutoSearch } from "components/auto-searches/location-auto-search";
// import CustomFormLabel from "components/form-componet/CustomFormLabel";
// import CustomTextField from "components/form-componet/CustomTextField";
// import { ILocationDetails } from "models/Location.model";
// import { IProperty } from "models/Property.model";
// import { useState } from "react";

// interface Props {
// 	values: IProperty;
// 	handleChange: any;
// 	setValues: (val: IProperty) => void;
// }

// export function PropertyFormStepEight({
// 	values,
// 	handleChange,

// 	setValues,
// }: Props) {
// 	const [isPetFriendly, setIsPetFriendly] = useState<boolean>(false);

// 	const handlePetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// 		// setIsPetFriendly(event.target.checked ? true : false);
// 		setValues({
// 			...values,
// 			is_pet_friendly: event.target.checked ? true : false,
// 		});
// 	};
// 	const handleLocation = (data: ILocationDetails) => {
// 		// console.log("handleLocation ===> ", data)
// 		setValues({
// 			...values,
// 			property_place_id: data.place_id,
// 			property_rating: data.rating ? data.rating?.toString() : "",
// 			latitude: data.latitude?.toString(),
// 			longitude: data.longitude?.toString(),
// 			property_address_line_1: data.address_line1,
// 			property_address_line_2: data.address_line2,
// 			property_city: data.city,
// 			property_state: data.state,
// 			property_pincode: data.pin_code,
// 			property_country: data.country,
// 		});
// 	};

// 	// console.log("PropertyFormStepFour values ===> ", values)
// 	return (
// 		<>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={12}
// 			>
// 				<CustomFormLabel>Room Name</CustomFormLabel>
// 				<CustomTextField
// 					color="info"
// 					name="room_name"
// 					fullWidth
// 					value={values.room_name}
// 					onChange={handleChange}
// 					disabled
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={12}
// 			>
// 				<CustomFormLabel>slug</CustomFormLabel>
// 				<CustomTextField
// 					color="info"
// 					name="slug"
// 					fullWidth
// 					value={values.slug}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Occupancy</CustomFormLabel>
// 				<CustomTextField
// 					color="info"
// 					name="max_occupancy"
// 					fullWidth
// 					value={values.max_occupancy}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Bedrooms</CustomFormLabel>
// 				<CustomTextField
// 					type="text"
// 					color="info"
// 					name="bedrooms"
// 					fullWidth
// 					value={values.bedrooms}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Available Beds</CustomFormLabel>
// 				<CustomTextField
// 					type="text"
// 					color="info"
// 					name="available_beds"
// 					fullWidth
// 					value={values.available_beds}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Queen Beds</CustomFormLabel>
// 				<CustomTextField
// 					type="text"
// 					color="info"
// 					name="queen_beds"
// 					fullWidth
// 					value={values.queen_beds}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>King Beds</CustomFormLabel>
// 				<CustomTextField
// 					type="text"
// 					color="info"
// 					name="king_beds"
// 					fullWidth
// 					value={values.king_beds}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>

// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Single Beds</CustomFormLabel>
// 				<CustomTextField
// 					type="text"
// 					color="info"
// 					name="single_beds"
// 					fullWidth
// 					value={values.single_beds}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>

// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Double Beds</CustomFormLabel>
// 				<CustomTextField
// 					type="text"
// 					color="info"
// 					name="double_beds"
// 					fullWidth
// 					value={values.double_beds}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>

// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Full Bathrooms</CustomFormLabel>
// 				<CustomTextField
// 					type="number"
// 					color="info"
// 					name="bathroom_full"
// 					fullWidth
// 					value={values.bathroom_full}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Half Bathrooms</CustomFormLabel>
// 				<CustomTextField
// 					type="number"
// 					color="info"
// 					name="bathroom_half"
// 					fullWidth
// 					value={values.bathroom_half}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Property Subtype</CustomFormLabel>
// 				<CustomTextField
// 					type="text"
// 					color="info"
// 					name="property_subtype"
// 					fullWidth
// 					value={values.property_subtype}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Phone</CustomFormLabel>
// 				<CustomTextField
// 					type="text"
// 					color="info"
// 					name="phone"
// 					fullWidth
// 					value={values.phone}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Mobile</CustomFormLabel>
// 				<CustomTextField
// 					type="text"
// 					color="info"
// 					name="mobile"
// 					fullWidth
// 					value={values.mobile}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Fax</CustomFormLabel>
// 				<CustomTextField
// 					type="text"
// 					color="info"
// 					name="fax"
// 					fullWidth
// 					value={values.fax}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Email</CustomFormLabel>
// 				<CustomTextField
// 					type="email"
// 					color="info"
// 					name="email"
// 					fullWidth
// 					value={values.email}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Web</CustomFormLabel>
// 				<CustomTextField
// 					type="text"
// 					color="info"
// 					name="web"
// 					fullWidth
// 					value={values.web}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>

// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Contact First Name</CustomFormLabel>
// 				<CustomTextField
// 					type="text"
// 					color="info"
// 					name="contactFirstName"
// 					fullWidth
// 					value={values.contactFirstName}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Contact Last Name</CustomFormLabel>
// 				<CustomTextField
// 					type="text"
// 					color="info"
// 					name="contactLastName"
// 					fullWidth
// 					value={values.contactLastName}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Check-In End</CustomFormLabel>
// 				<CustomTextField
// 					type="text"
// 					color="info"
// 					name="checkInEnd"
// 					fullWidth
// 					value={values.checkInEnd}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Check-In Time</CustomFormLabel>
// 				<CustomTextField
// 					type="text"
// 					color="info"
// 					name="checkin_time"
// 					fullWidth
// 					value={values.checkin_time}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Check-Out Time</CustomFormLabel>
// 				<CustomTextField
// 					type="text"
// 					color="info"
// 					name="checkout_time"
// 					fullWidth
// 					value={values.checkout_time}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Offer Type</CustomFormLabel>
// 				<CustomTextField
// 					type="text"
// 					color="info"
// 					name="offerType"
// 					fullWidth
// 					value={values.offerType}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Control Priority</CustomFormLabel>
// 				<CustomTextField
// 					type="text"
// 					color="info"
// 					name="controlPriority"
// 					fullWidth
// 					value={values.controlPriority}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Sell Priority</CustomFormLabel>
// 				<CustomTextField
// 					type="text"
// 					color="info"
// 					name="sellPriority"
// 					fullWidth
// 					value={values.sellPriority}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Booking Page Multiplier</CustomFormLabel>
// 				<CustomTextField
// 					type="number"
// 					color="info"
// 					name="bookingPageMultiplier"
// 					fullWidth
// 					value={values.bookingPageMultiplier}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Permit</CustomFormLabel>
// 				<CustomTextField
// 					type="text"
// 					color="info"
// 					name="permit"
// 					fullWidth
// 					value={values.permit}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={4}
// 			>
// 				<CustomFormLabel>Room Charge Display</CustomFormLabel>
// 				<CustomTextField
// 					type="text"
// 					color="info"
// 					name="roomChargeDisplay"
// 					fullWidth
// 					value={values.roomChargeDisplay}
// 					onChange={handleChange}
// 					InputProps={{
// 						readOnly: true,
// 					}}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				sm={12}
// 				sx={{ mt: 2 }}
// 			>
// 				<FormControlLabel
// 					control={
// 						<Checkbox
// 							checked={values.is_pet_friendly}
// 							readOnly
// 						/>
// 					}
// 					label="Pet Friendly"
// 				/>
// 			</Grid>
// 		</>
// 	);
// }
