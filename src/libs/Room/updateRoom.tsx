export default async function updateRoom(id: string, roomData: object) {
    
    const response = await fetch(`https://hotel-booking-backend-ten.vercel.app/api/v1/rooms/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
    });

    if (!response.ok) {
        return new Error("Failed to update room");
    }

    return await response.json();
}
