import { useState } from "react";
import dayjs from "dayjs";
import updateBooking from "@/libs/Booking/updateBooking";
import DateReserve from "./DateReserve";
import deleteBooking from "@/libs/Booking/deleteBooking";
import { useSession } from "next-auth/react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert } from "@mui/material";

export default function BookingCard({ bookingData, setBookings }: { bookingData: BookingItem, setBookings: React.Dispatch<React.SetStateAction<BookingItem[]>> }) {
    const [isEdit, setIsEdit] = useState(false);
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);  // State for Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
    const { data: session } = useSession();

    // Keep original booking dates (for displaying on the card)
    const [checkIn, setCheckIn] = useState<Date | null>(new Date(bookingData.checkInDate));
    const [checkOut, setCheckOut] = useState<Date | null>(new Date(bookingData.checkOutDate));

    // Temporary states for the date picker in the edit popup
    const [tempCheckIn, setTempCheckIn] = useState<Date | null>(checkIn);
    const [tempCheckOut, setTempCheckOut] = useState<Date | null>(checkOut);

    const handleUpdate = async () => {
        try {
            await updateBooking(bookingData._id, {
                checkInDate: tempCheckIn?.toISOString(),
                checkOutDate: tempCheckOut?.toISOString(),
            }, session?.user.token);
    
            // Update only after success
            setCheckIn(tempCheckIn);
            setCheckOut(tempCheckOut);
            setIsEdit(false);
            
            // Trigger snackbar with success message
            setSnackbarMessage("Booking updated successfully!");
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage(error instanceof Error ? error.message : "Failed to update booking.");
            setSnackbarOpen(true);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteBooking(bookingData._id, session?.user.token);
            
            // Remove the deleted booking from the list
            setBookings((prev) => prev.filter((booking) => booking._id !== bookingData._id));

            setSnackbarMessage("Booking deleted successfully!");
            setSnackbarOpen(true);
            setOpen(false);  // Close the delete dialog
        } catch (error) {
            setSnackbarMessage(error instanceof Error ? error.message : "Failed to delete booking.");
            setSnackbarOpen(true);
        }
    };

    return (
        <div>
            {/* Booking Card */}
            <div className="flex flex-col bg-white p-6 rounded-xl shadow-lg my-5 relative z-10">
                <p><span className="font-semibold">Hotel: </span> {bookingData.hotel?.name || "Unknown"}</p>
                <p><span className="font-semibold">Check-In Date: </span> {dayjs(checkIn).format("MMMM D, YYYY")}</p>
                <p><span className="font-semibold">Check-Out Date: </span> {dayjs(checkOut).format("MMMM D, YYYY")}</p>

                <div className="absolute top-6 right-6 flex space-x-3">
                    <Button variant="contained" color="success" onClick={() => setIsEdit(true)}>Edit</Button>
                    <Button variant="contained" color="error" onClick={() => setOpen(true)}>Delete</Button>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Are you sure you want to delete this booking?</DialogTitle>
                <DialogContent>
                    <DialogContentText>This action cannot be undone.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Popup */}
            {isEdit && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-lg font-semibold mb-4">Edit Booking</h2>

                            <div className="flex flex-col space-y-4">
                                <p className="text-sm text-gray-600 mb-1">Check-In Date:</p>
                                <DateReserve onDateChange={setTempCheckIn} />
                                <p className="text-sm text-gray-600 mb-1">Check-Out Date:</p>
                                <DateReserve onDateChange={setTempCheckOut} />
                            </div>

                            <div className="flex justify-end space-x-3 mt-4">
                                <Button variant="contained" color="inherit" onClick={() => setIsEdit(false)}>Cancel</Button>
                                <Button variant="contained" color="primary" onClick={handleUpdate}>Update</Button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Snackbar for success or error message */}
            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={3000} 
                onClose={() => setSnackbarOpen(false)} 
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}
