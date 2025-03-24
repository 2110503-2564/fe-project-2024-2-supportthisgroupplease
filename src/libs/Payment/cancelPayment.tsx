export async function cancelPayment(paymentId: string, token: string | undefined) {
    const response = await fetch(`https://hotel-booking-backend-ten.vercel.app/api/v1/payments/${paymentId}/cancel`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to cancel payment");

    return data;
}