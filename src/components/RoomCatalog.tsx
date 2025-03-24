import RoomCard from "./RoomCard";
import Link from "next/link";

export default function RoomCatalog({ rooms }: { rooms: RoomItem[] }) {
    const sortedRooms = Array.isArray(rooms) 
    ? [...rooms].sort((a, b) => a.number - b.number) // Numeric sorting
    : [];

    return (
        <div className="flex flex-wrap items-center justify-center gap-8">
            {sortedRooms.length > 0 ? (
                sortedRooms.map((roomItem: RoomItem) => (
                    <Link
                        href={`/room/${roomItem._id}`}
                        className="w-1/6 min-w-[250px]"
                        key={roomItem._id}
                    >
                        <RoomCard roomItem={roomItem} />
                    </Link>
                ))
            ) : (
                <p className="text-gray-500">No rooms available.</p> // Fallback message
            )}
        </div>
    );
}
