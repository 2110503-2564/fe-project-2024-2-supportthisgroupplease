export default async function getBooking(id:string, token: string | undefined) {
    
    const response = await fetch(`https://hotel-booking-backend-ten.vercel.app/api/v1/bookings/${id}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Send user's token
        }
    })
    if (!response.ok) {
        return new Error("Failed to fetch booking")
    }

    return await response.json()
}