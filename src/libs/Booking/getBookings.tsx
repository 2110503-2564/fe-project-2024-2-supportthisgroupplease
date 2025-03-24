export default async function getBookings(token: string | undefined) {
    const response = await fetch("https://hotel-booking-backend-ten.vercel.app/api/v1/bookings", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Send user's token
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch bookings");
    }

    return await response.json();
}
