export async function updatePayment(paymentId: string, updatedData: object, token: string | undefined) {
    const response = await fetch(`https://hotel-booking-backend-ten.vercel.app/api/v1/payments/${paymentId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to update payment");

    return data;
}