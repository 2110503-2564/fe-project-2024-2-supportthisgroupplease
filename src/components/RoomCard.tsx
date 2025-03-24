"use client"
import Image from 'next/image';
import InteractiveCard from './InteractiveCard';
import { Rating } from '@mui/material';

export default function Card ( { roomItem } : { roomItem:RoomItem } ) {

    let imgSrc=""
    if (roomItem.type=='superior') imgSrc="https://drive.google.com/uc?id=1Brpms2FiUrxjYI3LlVWi2f4I84zhJH4U"
    else if (roomItem.type=='deluxe') imgSrc="https://drive.google.com/uc?id=1yEzvJXtgIJ7LPcGFKOxEsP0Lbysi1kdN"
    else if (roomItem.type=='suite') imgSrc="https://drive.google.com/uc?id=1UPqmS-xkoAdiZG2oPlZrTyOrtGy6sOGe"
    else imgSrc="https://drive.google.com/uc?id=1lZvDpg5gaXv-RPhk3MdPKga9YqDeT92d"
    
    return (
        <InteractiveCard contentName={ roomItem.number.toString() }>
            { <div className='w-full h-[70%] relative rounded-t-lg'>
                <Image src={imgSrc}
                alt='Card'
                fill={true}
                className='object-cover rounded-t-lg'
                />
            </div> }
            <div className='w-full h-[35%] text-center mt-2'>
                <h3>Room No.{roomItem.number}</h3>
                
                <h3>{roomItem.type} room</h3>
                <h3>{roomItem.price} baht</h3>
            </div>
        </InteractiveCard>
    );
}