export default async function getRooms() {

    const response = await fetch("https://hotel-back-end.vercel.app/api/v1/rooms")
    if (!response.ok) {
        return new Error("Failed to fetch rooms")
    }

    return await response.json()
}