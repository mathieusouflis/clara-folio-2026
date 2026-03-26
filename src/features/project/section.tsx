"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Grid, GridItem } from "@/components/layout/grid";
import type { Project } from "@/payload-types";

export const ProjectSection = (props: {
	content: NonNullable<Project["content"]>;
}) => {
	if (!props.content[0]) return null;
	const content = props.content[0];
	const contentImages =
		content.images && typeof content.images === "object"
			? content.images.filter((i) => typeof i !== "number")
			: [];

	const [currentImage, setCurrentImage] = useState(
		contentImages[0] ? contentImages[0] : undefined,
	);

	return (
		<Grid key={content.id} as="section" id={content.id ?? ""}>
			<GridItem
				span={"full"}
				className="px-(--grid-margin) py-32 flex flex-col justify-between md:h-screen md:col-span-6!"
			>
				<Grid columns={6} withGap={false} withMargins={false}>
					<GridItem start={2} span={"full"} className="flex flex-col gap-12">
						<h1 className="opacity-60 text-white font-bold text-5xl">
							{content.title}
						</h1>
						<p className="opacity-80 font-medium text-white text-5">
							{content.contentDescription}
						</p>
					</GridItem>
				</Grid>
			</GridItem>
			<GridItem
				span={"full"}
				className="relative flex flex-col gap-2 justify-start pt-32 items-center pb-20 px-[calc(2*var(--grid-margin))] h-screen w-full md:col-span-6!"
			>
				{currentImage && (
					<Image
						src={currentImage.url ?? ""}
						alt={currentImage.alt}
						width={currentImage.width || 1920}
						height={currentImage.height || 1080}
						className="w-fit h-max max-h-[calc(100%-120px)] object-cover"
					/>
				)}
				<div className="flex flex-row gap-2 min-h-fit h-30 overflow-y-scroll no-scrollbar">
					{contentImages.length > 1 &&
						contentImages.map((image) => (
							<Image
								src={image.url ?? ""}
								alt={image.alt}
								width={image.width || 1920}
								height={image.height || 1080}
								onClick={() => setCurrentImage(image)}
								className="h-30 w-fit object-cover"
							/>
						))}
				</div>
			</GridItem>
		</Grid>
	);
};
