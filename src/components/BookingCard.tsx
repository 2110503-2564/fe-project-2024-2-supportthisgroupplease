"use client";

import { useState } from "react";
import dayjs from "dayjs";
import updateBooking from "@/libs/Booking/updateBooking";
import DateReserve from "./DateReserve";
import deleteBooking from "@/libs/Booking/deleteBooking";
import { useSession } from "next-auth/react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

export default function BookingCard({
  bookingData,
  setBookings,
}: {
  bookingData: BookingItem;
  setBookings: React.Dispatch<React.SetStateAction<BookingItem[]>>;
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { data: session } = useSession();

  const [checkIn, setCheckIn] = useState<Date | null>(
    new Date(bookingData.checkInDate)
  );
  const [checkOut, setCheckOut] = useState<Date | null>(
    new Date(bookingData.checkOutDate)
  );

  const [tempCheckIn, setTempCheckIn] = useState<Date | null>(checkIn);
  const [tempCheckOut, setTempCheckOut] = useState<Date | null>(checkOut);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    setTempCheckIn(dates[0]);
    setTempCheckOut(dates[1]);
  };

  const handleUpdate = async () => {
    try {
      await updateBooking(
        bookingData._id,
        {
          checkInDate: tempCheckIn?.toISOString(),
          checkOutDate: tempCheckOut?.toISOString(),
        },
        session?.user.token
      );
      setCheckIn(tempCheckIn);
      setCheckOut(tempCheckOut);
      setIsEdit(false);
      setSnackbarMessage("Booking updated successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage(
        error instanceof Error ? error.message : "Failed to update booking."
      );
      setSnackbarOpen(true);
    }
  };


  const handleDeleteConfirm = async () => {
    try {
      await deleteBooking(bookingData._id, session?.user.token);
      setBookings((prev) =>
        prev.filter((booking) => booking._id !== bookingData._id)
      );
      setSnackbarMessage("Booking deleted successfully!");
      setSnackbarOpen(true);
      setOpen(false);
    } catch (error) {
      setSnackbarMessage(
        error instanceof Error ? error.message : "Failed to delete booking."
      );
      setSnackbarOpen(true);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="rounded-2xl bg-white flex flex-col justify-between shadow-md h-full"
    >
      <div className="col-span-12 md:col-span-6 space-y-6 bg-white p-6 rounded-lg shadow-lg relative text-black">
        <p>
          <span className="font-semibold">Hotel: </span>{" "}
          {bookingData.hotel?.name || "Unknown"}
        </p>
        <p>
          <span className="font-semibold">Check-In Date: </span>{" "}
          {dayjs(checkIn).format("MMMM D, YYYY")}
        </p>
        <p>
          <span className="font-semibold">Check-Out Date: </span>{" "}
          {dayjs(checkOut).format("MMMM D, YYYY")}
        </p>

        <div className="absolute top-10 right-6 flex space-x-3 items-center justify-center">
          <Button variant="contained" color="success" onClick={() => setIsEdit(true)}>
            Edit
          </Button>
          <Button variant="contained" color="error" onClick={() => setOpen(true)}>
            Delete
          </Button>
        </div>
      </div>


      {/* Delete Confirmation Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Are you sure you want to delete this booking?</DialogTitle>
        <DialogContent>
          <DialogContentText>This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Animated Edit Modal */}
      <AnimatePresence>
        {isEdit && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-4">Edit Booking</h2>
                <div className="flex flex-col space-y-4">
                  <DateReserve onDateChange={handleDateChange} />
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                  <Button
                    variant="contained"
                    color="inherit"
                    onClick={() => setIsEdit(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleUpdate}>
                    Update
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </motion.div>
  );
}
