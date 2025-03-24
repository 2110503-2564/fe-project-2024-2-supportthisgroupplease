"use client";

import Image from "next/image";
import { useState } from "react";
import InteractiveCard from "./InteractiveCard";
import { Rating, CircularProgress } from "@mui/material";

interface CardProps {
  hotelName: string;
  address: string;
  imgSrc: string;
  rating?: number; // ⭐ New prop
}

export default function Card({
  hotelName,
  address,
  imgSrc,
  rating,
}: CardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <InteractiveCard>
      <div className="rounded-2xl bg-white p-5 flex flex-col justify-between shadow-md h-full">
        {/* Name */}
        <div className="text-lg font-bold text-black flex justify-center items-center pb-3">
          {hotelName}
        </div>

        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl mb-4">
          {loading && !error && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <CircularProgress />
            </div>
          )}
          {!error ? (
            <Image
              src={imgSrc}
              alt={`${hotelName} image`}
              fill
              className={`object-cover transition-opacity duration-300 ${
                loading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setError(true);
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              Failed to load image

            </div>
          )}
        </div>

        {/* Address */}
        <div className="text-xs text-gray-500 font-medium">{address}</div>

        {/* Rating */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-700">(58 reviews)</span>
          <Rating
            value={rating}
            readOnly
            precision={0.5}
            size="small"
            sx={{ fontSize: "1rem" }}
          />
        </div>
      </div>
    </InteractiveCard>
  );
}
