export default async function getRoom(id:string) {

    const response = await fetch(`https://hotel-booking-backend-ten.vercel.app/api/v1/rooms/${id}`)
    if (!response.ok) {
        return new Error("Failed to fetch room")
    }

    return await response.json()
}