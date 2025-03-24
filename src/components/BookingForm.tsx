"use client";

import { useState } from "react";
import createBooking from "@/libs/Booking/createBooking";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import DateReserve from "./DateReserve";
import { Alert, Button } from "@mui/material";
import { useSession } from "next-auth/react";
import { FaHotel, FaBed, FaMoneyBillWave } from "react-icons/fa";

export default function BookingForm({ hotels }: { hotels: HotelItem[] }) {
    const [selectedHotel, setSelectedHotel] = useState<string>("");
    const [rooms, setRooms] = useState<RoomItem[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<RoomItem | null>(null);
    const [checkInDate, setCheckInDate] = useState<Date | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [alertType, setAlertType] = useState<"success" | "error" | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { data: session } = useSession();

    const handleHotelChange = (hotelName: string | undefined) => {
        if (!hotelName) {
            setSelectedHotel("");
            setRooms([]);
        } else {
            setSelectedHotel(hotelName);
            const hotel = hotels.find((h) => h.name === hotelName);
            setRooms(hotel ? hotel.rooms : []);
        }
    };

    const handleBooking = async () => {
        try {
            if (!selectedRoom) throw new Error("Please select your room");
            if (!session) throw new Error("Please sign-in before making a booking");

            const bookingData = {
                checkInDate,
                checkOutDate,
                paymentMethod,
            };

            await createBooking(selectedRoom._id, bookingData, session.user.token);

            setAlertType("success");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        } catch (error: any) {
            setAlertType("error");
            setErrorMessage(error.message || "Something went wrong");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    };

    return (
        <section className="w-[1065px] h-[500px] mx-auto grid grid-cols-12 gap-[15px] mt-10 bg-white bg-opacity-20 rounded-2xl">
            <div className="col-span-10 md:col-span-10 md:col-start-2">
                <div className="p-8 rounded-xl shadow-md flex flex-col items-left space-y-6">
                    {/* Hotel Selection */}
                    <Autocomplete
                        disablePortal
                        options={hotels}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => {
                            setSelectedRoom(null);
                            handleHotelChange(newValue?.name);
                        }}
                        fullWidth
                        renderInput={(params: any) => (
                            <TextField
                                {...params}
                                placeholder="Select Your Hotel"
                                variant="outlined"
                                className="font-roboto text-black bg-white rounded-xl w-full"
                                InputProps={{
                                    ...params.InputProps,
                                    className: "h-[60px] flex items-center px-4 rounded-xl",
                                    classes: { notchedOutline: "border-none" },
                                    startAdornment: <FaHotel className="mr-2 text-gray-500" />,
                                }}
                            />
                        )}
                        isOptionEqualToValue={(option, value) => option._id === value?._id}
                    />

                    {/* Room Selection */}
                    <Autocomplete
                        disablePortal
                        options={rooms}
                        getOptionLabel={(option) => `Room ${option.number} - ${option.type} - $${option.price}`}
                        value={selectedRoom}
                        onChange={(event, newValue) => setSelectedRoom(newValue)}
                        fullWidth
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Select Your Room"
                                variant="outlined"
                                className="font-roboto text-black bg-white rounded-xl w-full"
                                InputProps={{
                                    ...params.InputProps,
                                    className: "h-[60px] flex items-center px-4 rounded-xl",
                                    classes: { notchedOutline: "border-none" },
                                    startAdornment: <FaBed className="mr-2 text-gray-500" />,
                                }}
                            />
                        )}
                        isOptionEqualToValue={(option, value) => option._id === value?._id}
                        disabled={rooms.length === 0}
                    />

                    {/* Date Picker */}
                    <div className="w-full">
                        <DateReserve
                            onDateChange={(dates) => {
                                setCheckInDate(dates[0]);
                                setCheckOutDate(dates[1]);
                            }}
                        />
                    </div>

                    {/* Payment Method & Book Button */}
                    <div className="flex flex-row space-x-4 items-center justify-center w-full">
                        <div className="relative w-full">
                            <FaMoneyBillWave className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="appearance-none w-full pl-10 pr-4 py-3 rounded-xl border-none bg-white text-black font-roboto text-sm focus:outline-none"
                            >
                                <option value="" disabled>Select Payment Method</option>
                                <option value="credit card">Credit Card</option>
                                <option value="debit card">Debit Card</option>
                                <option value="bank transfer">Bank Transfer</option>
                            </select>
                        </div>

                        <Button
                            onClick={handleBooking}
                            variant="contained"
                            color="primary"
                            className="w-[50%] bg-[#F2814D] hover:bg-[#e27035] text-white px-10 py-3 rounded-lg font-bold"
                        >
                            BOOK NOW
                        </Button>
                    </div>

                    {/* Alerts */}
                    {showAlert && alertType === "success" && (
                        <Alert severity="success" className="w-full">
                            Your booking was successful!
                        </Alert>
                    )}
                    {showAlert && alertType === "error" && (
                        <Alert severity="error" className="w-full">
                            {errorMessage}
                        </Alert>
                    )}
                </div>
            </div>
        </section>
    );
}