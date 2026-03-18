"use client";

import { useState } from "react";
import { Grid, GridItem } from "@/components/layout/grid";
import { Category } from "./components/category";
import { ImageSwitcher } from "./components/images-switcher";

export function CategoriesPageClient({
	categoriesData,
}: {
	categoriesData: any[];
}) {
	const [hoveredCategoryIndex, setHoveredCategoryIndex] = useState<
		number | null
	>(null);

	return (
		<div className="min-h-screen flex flex-col justify-center relative">
			<div className="fixed inset-0 z-0 pointer-events-none">
				{categoriesData.map((data, idx) => (
					<ImageSwitcher
						key={`image-${data.category.id}`}
						images={data.images}
						hidden={hoveredCategoryIndex !== idx}
					/>
				))}
			</div>

			<Grid className="px-0 relative z-10">
				{categoriesData.map((data, idx) => (
					<GridItem key={data.category.id} span={"full"} start={2}>
						<Category
							category={data.category}
							categoryNumber={idx + 1}
							projectsNumber={data.projectCount}
							onHoverChange={(hovering) =>
								setHoveredCategoryIndex(hovering ? idx : null)
							}
						/>
					</GridItem>
				))}
			</Grid>
		</div>
	);
}
