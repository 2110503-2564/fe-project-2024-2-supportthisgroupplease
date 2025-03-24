export async function createPayment(bookingId: string, paymentData: object, token: string | undefined) {
    const response = await fetch(`https://hotel-booking-backend-ten.vercel.app/api/v1/bookings/${bookingId}/payments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to create payment");

    return data;
}