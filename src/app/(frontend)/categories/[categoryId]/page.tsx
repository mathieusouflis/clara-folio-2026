import { getPayload } from "payload";
import { NotFoundPage } from "@/components/layout/not-found";
import { ProjectListPage } from "@/features/project-list";
import config from "@/payload.config";
import type { Category } from "@/payload-types";

export const metadata = {
	title: "Clara Baptista Portfolio - Category",
};

export default async function Page({
	params,
}: {
	params: Promise<{ categoryId: string }>;
}) {
	const { categoryId } = await params;

	const payloadConfig = await config;
	const payload = await getPayload({ config: payloadConfig });

	let category: Category;

	try {
		category = await payload.findByID({
			collection: "categories",
			id: parseInt(categoryId),
			populate: {
				projects: {
					image: true,
					name: true,
					releaseDate: true,
				},
			},
		});
	} catch (error) {
		return <NotFoundPage />;
	}

	metadata.title = `Clara Baptista Portfolio - ${category.categoryName}`;

	return <ProjectListPage category={category} />;
}
