import RoomCatalog from "@/components/RoomCatalog";
import { Suspense } from "react";
import { LinearProgress } from "@mui/material";

function Room( {rooms}: {rooms:RoomItem[]} ) {

    return (
        <div>
            { /* Header */ }
            <div className="text-center font-serif text-4xl mt-4">Room</div>

            { /* HotelCard */ }
            <Suspense fallback={ <p className="text-center">Loading...<LinearProgress/></p> }>
                <RoomCatalog rooms={rooms}/>
            </Suspense>
        </div>
    );
}

export default Room;