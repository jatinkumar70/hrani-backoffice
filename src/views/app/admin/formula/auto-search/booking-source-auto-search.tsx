import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import axios_base_api from "@/api/axios-base-api";
import { server_base_endpoints } from "@/api";
import { Select } from "@/components/ui";

export interface IBookingChannel {
    booking_channel_unique_id: number
    booking_channel_uuid: string
    channel_name: string
    channel_key: string
    remarks: any
    status: string
    created_by_uuid: string
    modified_by_uuid: string
}

export interface IBookingSourceAutoSearchMultiSelect {
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    value: string[];
    onSelect?: (data: string[]) => void;
    error?: boolean;
}

export const BookingSourceAutoSearchMultiSelect: React.FC<IBookingSourceAutoSearchMultiSelect> = ({
    value,
    label,
    disabled,
    error,
    placeholder,
    onSelect
}) => {
    const [bookingSourcesList, setookingSourcesList] = useState<{ value: string, label: string }[]>([]);
    const [inputValue, setInputValue] = useState("");

    const fetchUsersAsync = useCallback(
        debounce(async (search: string) => {
            try {
                const res = await axios_base_api.get(server_base_endpoints.formulas.get_booking_channel, {
                    params: {
                        ...(search?.length > 0 && { columns: "channel_name", value: search }),
                        pageNo: 1,
                        itemPerPage: 20
                    }
                });
                const data: IBookingChannel[] = res.data.data
                const verifiedChannels = data.map((channel) => ({ value: channel.channel_name, label: channel.channel_name }))
                setookingSourcesList(verifiedChannels);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        }, 400),
        []
    );

    useEffect(() => {
        fetchUsersAsync("");
    }, []);

    useEffect(() => {
        if (inputValue.length > 3) {
            fetchUsersAsync(inputValue);
        }
    }, [inputValue, fetchUsersAsync]);

    const handleToggle = (source: string) => {
        const exists = value.find((u) => u === source);
        const newSelected = exists
            ? value.filter((u) => u !== source)
            : [...value, source];
        onSelect?.(newSelected);
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            )}
            <Select<{ value: string, label: string }, true>
                isMulti
                isClearable
                isSearchable
                placeholder={placeholder ?? "Search or Select"}
                getOptionLabel={(o) => o.label}
                getOptionValue={(o) => o.value}
                value={value.map((channel) => ({ label: channel, value: channel }))}
                inputValue={inputValue}
                onInputChange={(newValue, actionMeta) => {
                    setInputValue(newValue)
                }}
                options={bookingSourcesList}
                onChange={(neValues) => onSelect && onSelect(neValues.map((channel) => channel.value))}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    )
}
