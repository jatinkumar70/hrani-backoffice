import React from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/shared/DataTable";
import type { ColumnDef, OnSortParam } from '@/components/shared/DataTable';
import { useSelector } from "react-redux";

import {
  IBookingSource,
  defaultBookingSource,
  IOTAOption
} from "@/redux/child-reducers/formula/formula.types";
import {
  fetchOTAOptionsAsync,
  fetchBookingSourcesAsync,
  upsertBookingSourceAsync,
  deleteBookingSourceAsync
} from "@/redux/child-reducers/formula/formulaActions";

import { ILoadState, IStoreState, useAppDispatch } from "@/redux";
import { PageContainer } from "@/components/container/PageContainer";
import { BookingSourceDialog, BookingSourcePayload } from "./components/BookingSourceDialog";
import { Eye } from "lucide-react";
import { Button, Tooltip } from "@/components/ui";
import { TbPencil } from "react-icons/tb";

const FormulaMapping: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [selectedOTA, setSelectedOTA] = React.useState<string>("");
  const [bookingSourceDialog, setBookingSourceDialog] = React.useState<{
    open: boolean;
    data?: IBookingSource | null;
  }>({ open: false, data: null });

  const {
    data: bookingSources,
    totalRecords,
    loading: bookingSourcesLoading
  } = useSelector((storeState: IStoreState) => storeState.formula.bookingSources);

  const [tablePagination, setTablePagination] = React.useState({
    pageNumber: 1,
    rowsInPerPage: 25,
  });

  const fetchBookingSources = () => {
    dispatch(
      fetchBookingSourcesAsync({
        page: tablePagination.pageNumber,
        rowsPerPage: tablePagination.rowsInPerPage
      })
    );
  };

  React.useEffect(() => {
    fetchBookingSources();
  }, [tablePagination]);

  const handleOTAChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOTA(event.target.value);
  };

  const handleAddBookingSource = () => {
    setBookingSourceDialog({ open: true, data: null });
  };

  const handleEditBookingSource = (source: IBookingSource) => {
    setBookingSourceDialog({ open: true, data: source });
  };

  const handleDeleteBookingSource = (source: IBookingSource) => {
    if (window.confirm(`Are you sure you want to delete "${source.source_name}"?`)) {
      if (source.booking_source_uuid) {
        dispatch(deleteBookingSourceAsync({
          uuid: source.booking_source_uuid,
          onCallback: (success) => {
            if (success) {
              fetchBookingSources();
            }
          }
        }));
      } else {
        console.error('No booking_source_uuid found for booking source:', source);
      }
    }
  };

  const handleVisitBookingSource = (source: IBookingSource) => {
    const sourceReference = source.source_reference_in_pms || source.source_name;
    if (sourceReference) {
      // navigate(`/app/admin/formula-calculator-logs`);
      navigate(`/app/admin/formula-calculator-logs?booking_source=${source.booking_source_uuid}`);
    } else {
      console.error('No source reference found for booking source:', source);
    }
  };

  const handleBookingSourceDialogClose = () => {
    setBookingSourceDialog({ open: false, data: null });
  };

  const handleBookingSourceSave = (data: BookingSourcePayload) => {
    let payload: any = {
      source_name: data.source_name,
      source_reference_in_pms: data.source_reference_in_pms,
      remarks: data.remarks,
      status: data.status,
    };
    // Only add booking_source_uuid if editing (i.e., it exists on dialog data)
    if (bookingSourceDialog.data && bookingSourceDialog.data.booking_source_uuid) {
      payload.booking_source_uuid = bookingSourceDialog.data.booking_source_uuid;
    }
    dispatch(upsertBookingSourceAsync({
      data: payload,
      onCallback: (success) => {
        if (success) {
          setBookingSourceDialog({ open: false, data: null });
          fetchBookingSources();
        }
      }
    }));
  };

  const handleSort = (sort: OnSortParam) => {
    console.log('Sort:', sort);
  };

  const columns: ColumnDef<IBookingSource>[] = [
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex justify-start gap-2">
          <Tooltip title="Edit Source" wrapperClass="flex">
            <Button
              variant="default"
              size="sm"
              onClick={() => handleEditBookingSource(row.original)}
            >
              <TbPencil className="h-4 w-4 font-bold heading-text" />
            </Button>
          </Tooltip>
          <Tooltip title="View Formulas" wrapperClass="flex">
            <Button
              variant="default"
              size="sm"
              onClick={() => handleVisitBookingSource(row.original)}
            >
              <Eye className="h-4 w-4 font-bold heading-text" />
            </Button>
          </Tooltip>
        </div>
      ),
    },
    {
      accessorKey: 'source_name',
      header: 'Source Name',
    },
    {
      accessorKey: 'source_reference_in_pms',
      header: 'Source Reference',
    },
    // {
    //   accessorKey: 'visit',
    //   header: 'Visit',
    //   cell: ({ row }) => (
    //     <button
    //       onClick={() => handleVisitBookingSource(row.original)}
    //       className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
    //     >
    //       <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    //       </svg>
    //       View
    //     </button>
    //   ),
    // },
  ];

  return (
    <>

      <PageContainer title="Booking Sources" description="Manage OTA booking sources and formulas">
        {/* Header with OTA Selection and Add Button */}
        <div className="flex justify-between items-center py-4 mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-semibold text-gray-800">Booking Sources</h2>
          </div>
          <button
            onClick={handleAddBookingSource}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Booking Source
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 min-h-[300px]">


          {/* Data Table */}
          <div className="grid grid-cols-1 gap-4">
            <div className="w-full">
              <DataTable
                columns={columns}
                data={bookingSources || []}
                loading={bookingSourcesLoading === ILoadState.pending}
                onSort={handleSort}
                pagingData={{
                  total: totalRecords,
                  pageIndex: tablePagination.pageNumber,
                  pageSize: tablePagination.rowsInPerPage,
                }}
                onPaginationChange={(pageIndex: number) => {
                  setTablePagination({ ...tablePagination, pageNumber: pageIndex });
                }}
                onSelectChange={(pageSize: number) => {
                  setTablePagination({
                    ...tablePagination,
                    rowsInPerPage: pageSize,
                    pageNumber: 1,
                  });
                }}
              />
            </div>
          </div>
        </div>
      </PageContainer>

      {/* Booking Source Dialog */}
      <BookingSourceDialog
        open={bookingSourceDialog.open}
        data={bookingSourceDialog.data}
        onClose={handleBookingSourceDialogClose}
        onSave={handleBookingSourceSave}
      />
    </>
  );
};

export default FormulaMapping;
