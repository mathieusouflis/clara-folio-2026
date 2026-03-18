import { revalidatePath } from "next/cache";
import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
	slug: "categories",
	admin: {
		useAsTitle: "categoryName",
		group: "Projects",
	},
	access: {
		read: () => true,
	},

	hooks: {
		beforeChange: [
			({ data }) => {
				if (data.relatedProjects) {
					data.projectCount = Array.isArray(data.relatedProjects)
						? data.relatedProjects.length
						: 0;
				}
				return data;
			},
		],
		afterChange: [
			async ({ doc, req, operation, previousDoc, context }) => {
				const categoryId = doc.id;
				const newProjectIds = (doc.relatedProjects || []).map((p: any) =>
					typeof p === "object" ? p.id : p,
				);
				const oldProjectIds =
					operation === "update" && previousDoc
						? (previousDoc.relatedProjects || []).map((p: any) =>
								typeof p === "object" ? p.id : p,
							)
						: [];

				const projectsToRemove = oldProjectIds.filter(
					(id: string) => !newProjectIds.includes(id),
				);

				const projectsToAdd = newProjectIds.filter(
					(id: string) => !oldProjectIds.includes(id),
				);

				for (const projectId of projectsToRemove) {
					try {
						const project = await req.payload.findByID({
							collection: "projects",
							id: projectId,
							req,
						});

						if (project) {
							const updatedCategories = (project.relatedCategories || [])
								.map((c: any) => (typeof c === "object" ? c.id : c))
								.filter((id: string) => id !== categoryId);

							await req.payload.update({
								collection: "projects",
								id: projectId,
								data: {
									relatedCategories: updatedCategories,
								},
								req,
							});
						}
					} catch (error) {
					  revalidatePath("/categories");
						console.error(
							`Error removing category from project ${projectId}:`,
							error,
						);
					}
				}

				for (const projectId of projectsToAdd) {
					try {
						const project = await req.payload.findByID({
							collection: "projects",
							id: projectId,
							req,
						});

						if (project) {
							const categoryIds = (project.relatedCategories || []).map(
								(c: any) => (typeof c === "object" ? c.id : c),
							);

							if (!categoryIds.includes(categoryId)) {
								await req.payload.update({
									collection: "projects",
									id: projectId,
									data: {
										relatedCategories: [...categoryIds, categoryId],
									},
									context: { skipBidirectionalSync: true },
									req,
								});
							}
						}
					} catch (error) {
					  revalidatePath("/categories");
						console.error(
							`Error adding category to project ${projectId}:`,
							error,
						);
					}
				}

				// Sort relatedProjects by releaseDate
				if (doc.relatedProjects && Array.isArray(doc.relatedProjects)) {
					const projectsWithDetails = await Promise.all(
						doc.relatedProjects.map(async (projectId: any) => {
							const project = await req.payload.findByID({
								collection: "projects",
								id: typeof projectId === "object" ? projectId.id : projectId,
								req,
							});
							return project ? { ...project, id: projectId } : null;
						}),
					);

					const sortedProjects = projectsWithDetails
						.filter((project) => project !== null)
						.sort((a: any, b: any) => {
							const dateA = a.releaseDate
								? new Date(a.releaseDate).getTime()
								: Infinity;
							const dateB = b.releaseDate
								? new Date(b.releaseDate).getTime()
								: Infinity;
							return dateA - dateB;
						})
						.map((project) => project.id);

					doc.relatedProjects = sortedProjects;
				}
				revalidatePath("/categories");
			},
		],
	},

	fields: [
		{
			name: "priority",
			type: "number",
			defaultValue: 0,
		},
		{
			name: "categoryName",
			type: "text",
			required: true,
		},
		{
			name: "relatedProjects",
			type: "relationship",
			relationTo: "projects",
			hasMany: true,
		},
		{
			name: "showcasedProjects",
			type: "relationship",
			relationTo: "projects",
			hasMany: true,
			filterOptions: ({ data }) => {
				return {
					id: {
						in: data?.relatedProjects || [],
					},
				};
			},
		},
		{
			name: "projectCount",
			type: "number",
			defaultValue: 0,
			admin: {
				readOnly: true,
			},
		},
	],
};
