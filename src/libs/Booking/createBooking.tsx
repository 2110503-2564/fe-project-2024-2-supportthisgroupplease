export default async function createBooking(roomId: string, bookingData: object, token: string) {
    const response = await fetch(`https://hotel-booking-backend-ten.vercel.app/api/v1/rooms/${roomId}/bookings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Ensure the user is authenticated
        },
        body: JSON.stringify(bookingData),
    });
    
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to create booking");
    }

    return data;
}
