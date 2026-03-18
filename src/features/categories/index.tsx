import { getPayload } from "payload";
import config from "@/payload.config";
import { CategoriesPageClient } from "./index-page";

export async function CategoriesPage() {
	const payloadConfig = await config;
	const payload = await getPayload({ config: payloadConfig });
	const categories = await payload.find({
		collection: "categories",
		limit: 0,
		sort: "-priority",
		populate: {
			projects: {
				image: true,
			},
		},
	});

	const categoriesData = categories.docs.map((category, idx) => {
		const projectImages =
			category.showcasedProjects?.map((project) => {
				if (
					typeof project !== "number" &&
					project.image &&
					typeof project.image !== "number"
				) {
					return project.image.url;
				}
				return null;
			}) ?? [];

		const finalImages = projectImages.filter(
			(image) => image !== null && image !== undefined,
		);

		return {
			category,
			images: finalImages,
			projectCount: category.projectCount ?? 0,
			index: idx,
		};
	});

	return <CategoriesPageClient categoriesData={categoriesData} />;
}
