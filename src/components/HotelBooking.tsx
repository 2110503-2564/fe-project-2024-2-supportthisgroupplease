"use client";
import { useState } from "react";
import createBooking from "@/libs/Booking/createBooking";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';
import DateReserve from "./DateReserve";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Alert, Button } from "@mui/material"
import { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";

export default function HotelBooking({ hotels, role }: { hotels: HotelItem[], role: string }) {
    const [selectedHotel, setSelectedHotel] = useState<string>("");
    const [rooms, setRooms] = useState<RoomItem[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<RoomItem | null>(null);
    const [checkInDate, setCheckInDate] = useState<Date | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [alertType, setAlertType] = useState<'success' | 'error' | null>(null); 
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [checkIn, setCheckIn] = useState<Dayjs | null>(null);
    const [checkOut, setCheckOut] = useState<Dayjs | null>(null);

    const { data: session, status } = useSession();

    const handleHotelChange = (hotelName: string|undefined) => {
        if (hotelName === undefined) {
            setSelectedHotel(""); // Reset hotel selection
            setRooms([]); // Clear rooms as no hotel is selected
        } else {
            setSelectedHotel(hotelName);
            // Find the hotel object and set its rooms
            const hotel = hotels.find(h => h.name === hotelName);
            setRooms(hotel ? hotel.rooms : []);
        }
    };

    const handleBooking = async () => {
        try {

            if (!selectedRoom) {
                throw new Error('Please select your room')
            }

            if (!session) {
                throw new Error('Please sign-in before make a booking')
            }

            const bookingData = {
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                paymentMethod: paymentMethod,
            };
        
            const result = await createBooking(selectedRoom._id, bookingData, session?.user.token);
    
            // Handle the successful booking response
            setAlertType('success');
            setShowAlert(true);
        
            // Hide the alert after 3 seconds
            setTimeout(() => setShowAlert(false), 3000);
    
        } catch (error:any) {
            console.log(error)

            setAlertType('error');
            setErrorMessage(error.message || 'Something went wrong'); // Set error message to state
            setShowAlert(true);

            // Hide the alert after 3 seconds
            setTimeout(() => setShowAlert(false), 3000);
        }
    };

    return (
        <div>
            {/* Booking Section */}
            <div className="flex flex-col items-center space-y-5 bg-gray-50 p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700">Select Your Stay</h2>

            {/* Hotel Selection */}
            <div className="space-y-1 py-5">
                <Autocomplete
                disablePortal
                options={hotels}
                getOptionLabel={(option) => option.name}
                sx={{ width: 300 }}
                onChange={(event, newValue) => {
                    setSelectedRoom(null);
                    handleHotelChange(newValue?.name);
                }}
                renderInput={(params:any) => <TextField {...params} label="Hotel" />}
                isOptionEqualToValue={(option, value) => option._id === value?._id}
                />
            </div>

            {/* Room Selection */}
            <div className="space-y-1 py-5">
            <Autocomplete
                    disablePortal
                    options={rooms}
                    getOptionLabel={(option) => `Room ${option.number} - ${option.type} - ${option.price} baht`}
                    sx={{ width: 300 }}
                    value={selectedRoom}
                    onChange={(event, newValue) => setSelectedRoom(newValue)}
                    renderInput={(params) => <TextField {...params} label="Room" />}
                    isOptionEqualToValue={(option, value) => option._id === value?._id}
                    disabled={rooms.length === 0}
                />
            </div>

            {/* Check-in & Check-out Dates */}
            <div className="w-full flex flex-col items-center">
            <p className="text-sm text-gray-600 mb-1">Select Dates:</p>
            <DateReserve onDateChange={(dates) => {
                setCheckInDate(dates[0]);
                setCheckOutDate(dates[1]);
                }} 
                role={role}/>
            </div>


            {/* Payment Method */}
            <div className="py-4">
                <FormControl sx={{ width: 250 }}>
                <InputLabel>Payment Method</InputLabel>
                    <Select
                        value={paymentMethod}
                        label="Payment Method"
                        onChange={ (e) => setPaymentMethod(e.target.value) }
                        >
                        <MenuItem value="credit card">Credit Card</MenuItem>
                        <MenuItem value="debit card">Debit Card</MenuItem>
                        <MenuItem value="bank transfer">Bank Transfer</MenuItem>
                    </Select>
                </FormControl>
            </div>

            {/* Booking Button */}
            <div className="w-full">
            <Button
                onClick={handleBooking}
                variant="contained"
                color="primary"
                className="w-full bg-cyan-700 hover:bg-indigo-600 text-white py-2 rounded-lg"
            >
                Book Room
            </Button>

            {/* Conditional Rendering for Success or Error Alert */}
            {showAlert && alertType === 'success' && (
                <Alert
                severity="success"
                className="w-full max-w-[300px] mt-4 justify-center mx-auto"
                >
                Your booking was successful!
                </Alert>
            )}

            {showAlert && alertType === 'error' && (
                <Alert
                severity="error"
                className="w-full max-w-[300px] mt-4 justify-center mx-auto"
                >
                {errorMessage}
                </Alert>
            )}
            </div>
            </div>
        </div>
    );
}
