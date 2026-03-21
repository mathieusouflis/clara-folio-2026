import Link from "next/link";
import { Grid, GridItem } from "@/components/layout/grid";
import type { Project } from "@/payload-types";
import InfiniteScrollColumn from "./components/infinite-scroll-column";

export function HomePage({ projectsList }: { projectsList: Project[] }) {
	const totalProjects = projectsList.length;

	// Ensure there are at least 24 projects to form 6 groups of 4
	while (projectsList.length < 24) {
		const randomIndex = Math.floor(Math.random() * totalProjects);
		projectsList.push({ ...projectsList[randomIndex] });
	}

	// Create 6 groups of 4 projects each
	const projectsGroups: Project[][] = [];
	for (let i = 0; i < 6; i++) {
		projectsGroups.push(
			projectsList.slice(
				(i * projectsList.length) / 6,
				((i + 1) * projectsList.length) / 6,
			),
		);
	}

	// Define speeds for each column (in seconds for one full loop)
	const speeds = [40, 60, 80, 90, 70, 50];

	return (
		<div className="relative">
			<div className="absolute flex flex-col items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 ">
				<span className="relative">
					<h1 className="font-aston-script text-6xl md:text-8xl lg:text-9xl text-white whitespace-nowrap">
						Portfolio
					</h1>
					<p className="absolute -bottom-5 right-0 text-white text-xl uppercase ">
						Clara Baptista
					</p>
					<Link
						href={"/categories"}
						className="absolute -bottom-52 left-1/2 -translate-x-1/2 text-white px-16 py-4 text-[14px] border border-white hover:bg-white hover:text-black hover:border-white duration-300 font-semibold"
					>
						ENTER
					</Link>
				</span>
			</div>
			<Grid className="h-screen pointer-events-none">
				{projectsGroups.map((group, idx) => (
					<GridItem key={idx} span={2} className="relative">
						<InfiniteScrollColumn
							projects={group}
							gap={1200}
							direction="down"
							speed={speeds[idx]}
							pauseOnHover={false}
						/>
						{projectsGroups.length > idx + 1 && (
							<span className="absolute top-0 -right-[calc(var(--grid-gap)/2)] bg-black w-0.5 h-full translate-x-1/2 opacity-15" />
						)}
					</GridItem>
				))}
			</Grid>
		</div>
	);
}
