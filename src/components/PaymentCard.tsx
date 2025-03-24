import { useState } from "react";
import dayjs from "dayjs";
import { updatePayment } from "@/libs/Payment/updatePayment";
import { cancelPayment } from "@/libs/Payment/cancelPayment";
import { useSession } from "next-auth/react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert } from "@mui/material";

export default function PaymentCard({ paymentData } : {paymentData: PaymentItem}) {
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const { data: session } = useSession();

    const [amount, setAmount] = useState(Number(paymentData.amount));
    const [status, setStatus] = useState(paymentData.status);
    const [method, setMethod] = useState(paymentData.method);

    const handlePay = async () => {
        try {
            await updatePayment(paymentData._id, { status: "pending" }, session?.user.token);
            setStatus("pending"); // Update local state
            setSnackbarMessage("Payment is now pending.");
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage(error instanceof Error ? error.message : "Failed to update payment.");
            setSnackbarOpen(true);
        }
    };

    const handleCancelConfirm = async () => {
        try {
            await cancelPayment(paymentData._id, session?.user.token);
            setStatus("canceled"); // Update the local state but keep the payment visible
            setSnackbarMessage("Payment has been canceled.");
            setSnackbarOpen(true);
            setOpen(false);
        } catch (error) {
            setSnackbarMessage(error instanceof Error ? error.message : "Failed to cancel payment.");
            setSnackbarOpen(true);
        }
    };

    return (
        <div>
            <div className="flex flex-col bg-white p-6 rounded-xl shadow-lg my-5 relative z-10">
                <p><span className="font-semibold">Amount: </span> {amount}</p>
                <p><span className="font-semibold">Method: </span> {method}</p>
                <p><span className="font-semibold">Status: </span> 
                    <span className={`px-2 py-1 rounded-md ${status === "canceled" ? "bg-red-200 text-red-700" : "bg-gray-200 text-gray-700"}`}>
                        {status}
                    </span>
                </p>
                <p><span className="font-semibold">Payment Date: </span> {dayjs(paymentData.paymentDate).format("MMMM D, YYYY")}</p>
                
                <div className="absolute top-6 right-6 flex space-x-3">
                    <Button 
                        variant="contained" 
                        color="success" 
                        onClick={handlePay} 
                        disabled={status === "pending" || status === "completed" || status === "canceled"} // Disable if canceled
                    >
                        {status === "pending" || status === "completed" ? "Paid" : "Pay"}
                    </Button>
                    <Button 
                        variant="contained" 
                        color="warning" 
                        onClick={() => setOpen(true)}
                        disabled={status === "canceled"} // Disable cancel button if already canceled
                    >
                        Cancel
                    </Button>
                </div>
            </div>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Are you sure you want to cancel this payment?</DialogTitle>
                <DialogContent>
                    <DialogContentText>Canceling a payment cannot be undone.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">Back</Button>
                    <Button onClick={handleCancelConfirm} color="error" autoFocus>Confirm Cancel</Button>
                </DialogActions>
            </Dialog>

            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={3000} 
                onClose={() => setSnackbarOpen(false)} 
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={status === "canceled" ? "error" : "success"}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}
