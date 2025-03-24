export default async function userRegister(userData: object) {

    const response = await fetch("https://hotel-booking-backend-ten.vercel.app/api/v1/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData),
    })

    const data = await response.json();
    console.log(data)

    if (!response.ok) {
        throw new Error("Failed to register")
    }

    return data   
}