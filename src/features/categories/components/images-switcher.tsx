"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export function ImageSwitcher({
	images,
	hidden,
}: {
	images: string[];
	hidden?: boolean;
}) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const handleNextImage = () => {
		setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
	};

	useEffect(() => {
		const timeout = setTimeout(() => {
			handleNextImage();
		}, 2000);

		return () => clearTimeout(timeout);
	}, [currentImageIndex, images.length]);

	if (!images.length) return null;

	return (
		<div
			className="flex flex-col items-center fixed my-[calc(var(--grid-margin-mobile)*2)] mx-(--grid-margin-mobile) right-0 top-0 z-0"
			style={{
				opacity: hidden ? 0 : 1,
				transition: "opacity 0.2s",
			}}
		>
			<Image
				src={images[currentImageIndex]}
				alt={"Category Image (not an alt)"}
				width={1940}
				height={1080}
				className="aspect-18/24 w-auto h-[calc(100vh-2*var(--grid-margin-mobile)*2)] object-cover"
			/>
		</div>
	);
}
