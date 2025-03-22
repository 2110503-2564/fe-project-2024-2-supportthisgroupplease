import RoomCatalog from "./RoomCatalog";
import Image from "next/image";

export default async function HotelPage({ hotelDetail }: { hotelDetail: Promise<HotelResponse> }) {
    const hotel = (await hotelDetail).data;
    console.log(hotel.name);

    return (
        <div className="container mx-auto p-6 m-">
            <h1 className="text-2xl font-semibold text-center mb-6">{hotel.name}</h1>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {hotel.picture && (
                    <div className="w-full md:w-1/3">
                        <Image
                            src={hotel.picture}
                            alt="Hotel Image"
                            width={400}
                            height={300}
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                )}
                <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
                    <div className="text-lg space-y-2">
                        <p><span className="font-semibold">Name:</span> {hotel.name}</p>
                        <p><span className="font-semibold">Address:</span> {hotel.address}</p>
                        <p><span className="font-semibold">Tel:</span> {hotel.tel}</p>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <RoomCatalog rooms={hotel.rooms} />
            </div>
        </div>
    );
}
