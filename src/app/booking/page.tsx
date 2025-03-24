import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getUserProfile from "@/libs/Auth/getUserProfile";
import getHotels from "@/libs/Hotel/getHotels";
import BookingHero from "@/components/BookingHero";
import BookingForm from "@/components/BookingForm";

export default async function Booking() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.token) return null;

  const profile = await getUserProfile(session.user.token);
  const hotelJson: HotelJson = await getHotels();

  return (
    <main className="bg-[#000235] h-[1200px] text-white min-h-screen">
      {/* Hero Section */}
      <BookingHero />
      {/* Booking Form in its own centered grid */}
      {/* <section className="w-[1065px] mx-auto grid grid-cols-12 gap-[15px] pt-10 pb-36">
        <div className="col-span-12 md:col-span-12 md:col-start-1"> */}
          <BookingForm hotels={hotelJson.data} />
        {/* </div>
      </section> */}

    </main>
  );
}
