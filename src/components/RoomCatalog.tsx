import RoomCard from "./RoomCard";
import Link from "next/link";

export default function RoomCatalog( {rooms} : {rooms?:RoomItem[]} ) {

    return (
        <>
            <div className="flex flex-wrap center justify-center gap-8">
                    {
                        rooms?.map((roomItem:RoomItem)=>(
                            <Link href={`/room/${roomItem._id}`} className="w-1/6 min-w-[250px]" key={roomItem._id}>
                                <RoomCard key={roomItem._id} roomNumber={roomItem.number.toString()}/>
                            </Link>
                        ))
                    }
            </div>
        </>
    );
}