import Image from "next/image";
import Link from "next/link";
import type { PaginatedDocs } from "payload";
import { useState } from "react";
import { Grid, GridItem } from "@/components/layout/grid";
import type { Project } from "@/payload-types";
import { ProjectSection } from "./section";

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export async function ProjectPage({
	projects,
	categoryId,
}: {
	projects: PaginatedDocs<Project>;
	categoryId: number;
}) {
	if (!projects.docs || projects.docs.length === 0) {
		return null;
	}
	const project = projects.docs[0];
	return (
		<>
			<Grid as="section" withMargins={false} withGap={false}>
				<GridItem
					span={"full"}
					className="p-[calc(2*var(--grid-margin))] flex flex-col justify-between bg-white h-screen md:col-span-6!"
				>
					<div className="flex flex-col justify-between h-full w-full">
						<h1 className="opacity-80 text-blue-700 font-bold text-8xl">
							{project.name}
						</h1>
						<div className="flex items-center justify-center p-[calc(2*var(--grid-margin))] md:hidden">
							{project.image && typeof project.image === "object" && (
								<Image
									src={project.image.url ?? ""}
									alt={project.image.alt}
									width={project.image.width || 1920}
									height={project.image.height || 1080}
									className="w-4/5 object-cover"
								/>
							)}
						</div>
						<div>
							{project.content?.map((content, idx) => (
								<Link
                  href={`#${content.id}`}
									key={idx}
									className="flex flex-row justify-between border-b-2 p-3 border-blue-700 text-blue-700 font-bold"
								>
									<span>{content.title.toLocaleLowerCase()}</span>
									<span>{idx + 1 > 10 ? idx + 1 : `0${idx + 1}`}</span>
								</Link>
							))}
						</div>
					</div>
				</GridItem>
				<GridItem
					span={6}
					className="items-center justify-center p-[calc(2*var(--grid-margin))] hidden md:flex"
				>
					{project.image && typeof project.image === "object" && (
            <Image
              key={project.image.id}
							src={project.image.url ?? ""}
							alt={project.image.alt}
							width={project.image.width || 1920}
							height={project.image.height || 1080}
							className="w-4/5  object-cover"
						/>
					)}
				</GridItem>
			</Grid>
			{project.content?.map((content) => (
				<ProjectSection key={content.id} content={[content]} />
			))}
		</>
	);
}
