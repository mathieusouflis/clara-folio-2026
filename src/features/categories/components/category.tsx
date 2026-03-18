"use client";

import Link from "next/link";
import type { Category as PayloadCategory } from "@/payload-types";

export function Category({
	category,
	projectsNumber,
	categoryNumber,
	onHoverChange,
}: {
	category: PayloadCategory;
	projectsNumber: number;
	categoryNumber: number;
	onHoverChange: (hovering: boolean) => void;
}) {
	return (
		<div
			className="flex flex-row gap-11 opacity-60 text-white hover:opacity-100 duration-200 relative z-10"
			onMouseEnter={() => onHoverChange(true)}
			onMouseLeave={() => onHoverChange(false)}
		>
			<div className="flex flex-row gap-4">
				<span className="text-4xl font-thin">
					<i>{categoryNumber < 10 ? `0${categoryNumber}` : categoryNumber}</i>
				</span>
				<span>
					<Link href={`/categories/${category.id}`} className="text-8xl">
						{category.categoryName}
					</Link>
					<span>({projectsNumber})</span>
				</span>
			</div>
		</div>
	);
}
