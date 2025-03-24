"use client";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";

export default function DateReserve({
  onDateChange,
  role,
}: {
  onDateChange: (dates: [Date | null, Date | null]) => void;
  role: string;
}) {
  const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null);
  const tomorrow = dayjs().add(1, "day");

  const handleCheckInChange = (date: Dayjs | null) => {
    setCheckInDate(date);
    if (date) {
      const newCheckOut = date.add(1, "day");
      setCheckOutDate(newCheckOut);
      onDateChange([date.toDate(), newCheckOut.toDate()]);
    } else {
      setCheckOutDate(null);
      onDateChange([null, null]);
    }
  };

  const handleCheckOutChange = (date: Dayjs | null) => {
    setCheckOutDate(date);
    onDateChange([checkInDate ? checkInDate.toDate() : null, date ? date.toDate() : null]);
  };

  return (
    <div className="flex flex-row items-center w-full justify-center space-x-4 bg-[#f1f5f9] p-4 rounded-xl">
      {/* Check-in Date */}
      <div className="flex flex-col w-1/2">
        <label className="text-sm text-black mb-1">Check-In Date:</label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={checkInDate}
            onChange={handleCheckInChange}
            minDate={tomorrow}
            slotProps={{
              textField: {
                variant: "outlined",
                fullWidth: true,
                InputProps: {
                  className: "h-[55px] font-roboto bg-white rounded-xl px-4",
                },
                sx: {
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                },
              },
            }}
          />
        </LocalizationProvider>
      </div>

      {/* Check-out Date */}
      <div className="flex flex-col w-1/2">
        <label className="text-sm text-black mb-1">Check-Out Date:</label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={checkOutDate}
            onChange={handleCheckOutChange}
            minDate={checkInDate ? checkInDate.add(1, "day") : tomorrow}
            maxDate={checkInDate ? checkInDate.add(3, "day") : undefined}
            slotProps={{
              textField: {
                variant: "outlined",
                fullWidth: true,
                InputProps: {
                  className: "h-[55px] font-roboto bg-white rounded-xl px-4",
                },
                sx: {
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                },
              },
            }}

          />
        </LocalizationProvider>
      </div>
    </div>
  );
}
