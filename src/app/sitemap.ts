import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { BRAND } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = BRAND.url;

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/recipes`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/states`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/community`, changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/submit-recipe`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/festivals`, changeFrequency: "weekly", priority: 0.7 },
  ];

  try {
    const [recipes, states] = await Promise.all([
      prisma.recipe.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.state.findMany({ select: { slug: true } }),
    ]);

    const recipePages: MetadataRoute.Sitemap = recipes.map((r) => ({
      url: `${baseUrl}/recipes/${r.slug}`,
      lastModified: r.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const statePages: MetadataRoute.Sitemap = states.map((s) => ({
      url: `${baseUrl}/states/${s.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticPages, ...recipePages, ...statePages];
  } catch {
    return staticPages;
  }
}
