// import {
// 	Button,
// 	Card,
// 	Stack,
// 	Table,
// 	TableBody,
// 	TableContainer,
// } from "@mui/material";
// import { TableHeader, TablePagination } from "components/data-table";
// import { FlexBox } from "components/flex-box";
// import { ListLoadingWrapper } from "components/form-componet/form-list-view-loader";
// import Scrollbar from "components/scrollbar";
// import useMuiTable from "hooks/useMuiTable";
// import { defaultRoomType, IRoomType } from "models/Room-type.model";
// import RoomTypeModal from "pages-sections/vendor-dashboard/room-type/_components/room-type-modal";
// import RoomTypeTableRow from "pages-sections/vendor-dashboard/room-type/_components/table-row";
// import { StyledNoDataMessage } from "pages-sections/vendor-dashboard/room-type/styles";
// import React from "react";
// import { getAllRoomTypeList } from "utils/__api__/room-type";

// interface Props {
// 	propertyUuid: string;
// 	propertyName: string;
// }

// // TABLE HEADING DATA LIST
// const tableHeading = [
// 	{ id: "property_details_name", label: "Property Name", align: "left" },
// 	{ id: "room_types_name", label: "Room Type", align: "left" },
// 	{ id: "total_room", label: "Total Room", align: "left" },
// 	{ id: "status", label: "Status", align: "left" },
// 	{ id: "action", label: "Action", align: "right" },
// ];

// export function PropertyFormStepNine({ propertyUuid, propertyName }: Props) {
// 	const [list, setList] = React.useState<IRoomType[]>([]);
// 	const [loading, setLoading] = React.useState<boolean>(false);
// 	const [openRoomType, setOpenRoomType] = React.useState<IRoomType | null>(
// 		null
// 	);

// 	React.useEffect(() => {
// 		const fetchData = async () => {
// 			setLoading(true);
// 			try {
// 				const data = await getAllRoomTypeList(propertyUuid);
// 				setList(data);
// 			} catch (e) {
// 				console.error(e);
// 			} finally {
// 				setLoading(false);
// 			}
// 		};
// 		if (!propertyUuid) return;
// 		fetchData();
// 	}, [propertyUuid, openRoomType]);

// 	const {
// 		order,
// 		orderBy,
// 		selected,

// 		rowsPerPage,
// 		filteredList,
// 		handleChangePage,
// 		handleRequestSort,
// 	} = useMuiTable({ listData: list });

// 	const handleOpenRoomType = (data: IRoomType | null) => {
// 		setOpenRoomType(data);
// 	};

// 	return (
// 		<Card sx={{ width: "100%" }}>
// 			<ListLoadingWrapper
// 				loading={loading}
// 				columns={tableHeading.length}
// 			>
// 				<FlexBox
// 					justifyContent="end"
// 					flex={1}
// 					padding={2}
// 				>
// 					{/* <Button
// 						onClick={() =>
// 							handleOpenRoomType({
// 								...defaultRoomType,
// 								property_details_name: propertyName,
// 								property_details_uuid: propertyUuid,
// 							})
// 						}
// 						variant="contained"
// 						color="info"
// 					>
// 						Add New
// 					</Button> */}
// 				</FlexBox>
// 				<Scrollbar autoHide={false}>
// 					{list.length === 0 ? (
// 						<StyledNoDataMessage>
// 							No data found for this property
// 						</StyledNoDataMessage>
// 					) : (
// 						<>
// 							<TableContainer sx={{ width: "100%" }}>
// 								<Table>
// 									<TableHeader
// 										order={order}
// 										hideSelectBtn
// 										orderBy={orderBy}
// 										heading={tableHeading}
// 										rowCount={list.length}
// 										numSelected={selected.length}
// 										onRequestSort={handleRequestSort}
// 									/>

// 									<TableBody>
// 										{list.map((data, index) => (
// 											<RoomTypeTableRow
// 												key={index}
// 												item={data}
// 												property_uuid={propertyUuid}
// 												handleOpenRoomType={handleOpenRoomType}
// 											/>
// 										))}
// 									</TableBody>
// 								</Table>
// 							</TableContainer>
// 							<Stack
// 								alignItems="center"
// 								my={4}
// 							>
// 								<TablePagination
// 									onChange={handleChangePage}
// 									count={Math.ceil(list.length / rowsPerPage)}
// 								/>
// 							</Stack>
// 						</>
// 					)}
// 				</Scrollbar>

// 				{openRoomType && (
// 					<RoomTypeModal
// 						open={!!openRoomType}
// 						onClose={() => setOpenRoomType(null)}
// 						data={openRoomType}
// 					/>
// 				)}
// 			</ListLoadingWrapper>
// 		</Card>
// 	);
// }
