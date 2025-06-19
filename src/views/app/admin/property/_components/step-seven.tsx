// import { Grid, TextField, Typography } from "@mui/material";
// import {
// 	ICheckboxSelection,
// 	MultipleCheckboxSection,
// } from "components/common/multiple-checkbox-section";
// import CustomFormLabel from "components/form-componet/CustomFormLabel";
// import { ControlledCustomSelect } from "components/form-componet/CustomSelect";
// import {
// 	allowedRules,
// 	notAllowedRules,
// 	property_amenities,
// 	propertyPolicies,
// } from "constants/constants";
// import { IProperty } from "models/Property.model";
// import { useCallback } from "react";

// interface Props {
// 	setFieldValue: any;
// 	values: IProperty;
// 	handleChange: any;
// }

// export function PropertyFormStepSeven({
// 	setFieldValue,
// 	handleChange,
// 	values,
// }: Props) {
// 	const handlePolicyCheckboxChange = useCallback(
// 		(value: ICheckboxSelection[]) => {
// 			setFieldValue("property_policies", value);
// 		},
// 		[setFieldValue]
// 	);
// 	const handleRulesAllowed = useCallback(
// 		(value: ICheckboxSelection[]) => {
// 			setFieldValue("rule_allowed", value);
// 		},
// 		[setFieldValue]
// 	);
// 	const HandleRulesNotAllowed = useCallback(
// 		(value: ICheckboxSelection[]) => {
// 			setFieldValue("rule_not_allowed", value);
// 		},
// 		[setFieldValue]
// 	);

// 	return (
// 		<Grid
// 			container
// 			spacing={2}
// 		>
// 			<Grid
// 				item
// 				xs={12}
// 			>
// 				<Grid
// 					container
// 					spacing={2}
// 				>
// 					<Grid
// 						item
// 						xs={12}
// 						md={4}
// 					>
// 						<CustomFormLabel>Booking Type</CustomFormLabel>
// 						<ControlledCustomSelect
// 							name="property_policies.bookingType"
// 							fullWidth
// 							value={values.property_policies.bookingType}
// 							onChange={handleChange}
// 							displayEmpty
// 							options={[
// 								{ label: "Auto Confirmed", value: "autoConfirmed" },
// 								{ label: "Manual", value: "manual" },
// 							]}
// 							readOnly
// 						/>
// 					</Grid>

// 					<Grid
// 						item
// 						xs={12}
// 						md={4}
// 					>
// 						<CustomFormLabel>Price Rounding</CustomFormLabel>
// 						<ControlledCustomSelect
// 							name="property_policies.priceRounding"
// 							fullWidth
// 							value={values.property_policies.priceRounding}
// 							onChange={handleChange}
// 							displayEmpty
// 							options={[
// 								{ label: "None", value: "none" },
// 								{ label: "Nearest", value: "nearest" },
// 							]}
// 							readOnly
// 						/>
// 					</Grid>

// 					<Grid
// 						item
// 						xs={12}
// 						md={4}
// 					>
// 						<CustomFormLabel>Daily Price Type</CustomFormLabel>
// 						<ControlledCustomSelect
// 							name="property_policies.dailyPriceType"
// 							fullWidth
// 							value={values.property_policies.dailyPriceType}
// 							onChange={handleChange}
// 							displayEmpty
// 							options={[
// 								{ label: "Default", value: "default" },
// 								{ label: "Custom", value: "custom" },
// 							]}
// 							readOnly
// 						/>
// 					</Grid>

// 					<Grid
// 						item
// 						xs={12}
// 						md={4}
// 					>
// 						<CustomFormLabel>Booking Near Type</CustomFormLabel>
// 						<ControlledCustomSelect
// 							name="property_policies.bookingNearType"
// 							fullWidth
// 							value={values.property_policies.bookingNearType}
// 							onChange={handleChange}
// 							displayEmpty
// 							options={[
// 								{ label: "Auto Confirmed", value: "autoConfirmed" },
// 								{ label: "Manual", value: "manual" },
// 							]}
// 							readOnly
// 						/>
// 					</Grid>

// 					<Grid
// 						item
// 						xs={12}
// 						md={4}
// 					>
// 						<CustomFormLabel>Booking Cut Off Hour</CustomFormLabel>
// 						<TextField
// 							type="number"
// 							fullWidth
// 							variant="outlined"
// 							size="small"
// 							name="property_policies.bookingCutOffHour"
// 							value={values.property_policies.bookingCutOffHour}
// 							onChange={(e) =>
// 								setFieldValue(
// 									"property_policies.bookingCutOffHour",
// 									Number(e.target.value)
// 								)
// 							}
// 							InputProps={{
// 								readOnly: true,
// 							}}
// 						/>
// 					</Grid>

// 					<Grid
// 						item
// 						xs={12}
// 						md={4}
// 					>
// 						<CustomFormLabel>VAT Rate Percentage</CustomFormLabel>
// 						<TextField
// 							type="number"
// 							fullWidth
// 							variant="outlined"
// 							size="small"
// 							name="property_policies.vatRatePercentage"
// 							value={values.property_policies.vatRatePercentage}
// 							onChange={(e) =>
// 								setFieldValue(
// 									"property_policies.vatRatePercentage",
// 									Number(e.target.value)
// 								)
// 							}
// 							InputProps={{
// 								readOnly: true,
// 							}}
// 						/>
// 					</Grid>

// 					<Grid
// 						item
// 						xs={12}
// 						md={4}
// 					>
// 						<CustomFormLabel>Daily Price Strategy</CustomFormLabel>
// 						<ControlledCustomSelect
// 							name="property_policies.dailyPriceStrategy"
// 							fullWidth
// 							value={values.property_policies.dailyPriceStrategy}
// 							onChange={handleChange}
// 							displayEmpty
// 							options={[
// 								{ label: "Allow Lower", value: "allowLower" },
// 								{ label: "Fixed", value: "fixed" },
// 							]}
// 							readOnly
// 						/>
// 					</Grid>

// 					<Grid
// 						item
// 						xs={12}
// 						md={4}
// 					>
// 						<CustomFormLabel>Booking Near Type Days</CustomFormLabel>
// 						<TextField
// 							type="number"
// 							fullWidth
// 							variant="outlined"
// 							size="small"
// 							name="property_policies.bookingNearTypeDays"
// 							value={values.property_policies.bookingNearTypeDays ?? ""}
// 							onChange={(e) =>
// 								setFieldValue(
// 									"property_policies.bookingNearTypeDays",
// 									e.target.value ? Number(e.target.value) : null
// 								)
// 							}
// 							InputProps={{
// 								readOnly: true,
// 							}}
// 						/>
// 					</Grid>

// 					<Grid
// 						item
// 						xs={12}
// 						md={4}
// 					>
// 						<CustomFormLabel>Allow Guest Cancellation</CustomFormLabel>
// 						<ControlledCustomSelect
// 							name="property_policies.allowGuestCancellation.type"
// 							fullWidth
// 							value={values.property_policies.allowGuestCancellation.type}
// 							onChange={handleChange}
// 							displayEmpty
// 							options={[
// 								{ label: "Never", value: "never" },
// 								{ label: "Flexible", value: "flexible" },
// 								{ label: "Strict", value: "strict" },
// 							]}
// 							readOnly
// 						/>
// 					</Grid>
// 				</Grid>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				md={6}
// 			>
// 				<Typography
// 					variant="body1"
// 					fontWeight={700}
// 					fontSize={16}
// 					sx={{ mb: 2 }}
// 				>
// 					Not Allowed Rules
// 				</Typography>
// 				<MultipleCheckboxSection
// 					sections={notAllowedRules}
// 					onSelectionChange={HandleRulesNotAllowed}
// 					value={values.rule_not_allowed}
// 				/>
// 			</Grid>
// 			<Grid
// 				item
// 				xs={12}
// 				md={6}
// 			>
// 				<Typography
// 					variant="body1"
// 					fontWeight={700}
// 					fontSize={16}
// 					sx={{ mb: 2 }}
// 				>
// 					Allowed Rules
// 				</Typography>
// 				<MultipleCheckboxSection
// 					sections={allowedRules}
// 					onSelectionChange={handleRulesAllowed}
// 					value={values.rule_allowed}
// 				/>
// 			</Grid>
// 		</Grid>
// 	);
// }
