export default async function getHotels() {
    
    const response = await fetch("https://hotel-booking-backend-ten.vercel.app/api/v1/hotels")
    if (!response.ok) {
        return new Error("Failed to fetch hotels")
    }

    return await response.json()
}