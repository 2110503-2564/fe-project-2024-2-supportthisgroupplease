export default async function deleteRoom(id: string) {
    
    const response = await fetch(`https://hotel-booking-backend-ten.vercel.app/api/v1/rooms/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        return new Error("Failed to delete room");
    }

    return await response.json(); 
}
