import { HeroSection } from "@/components/home/HeroSection";
import { RecipeSection } from "@/components/home/RecipeSection";
import { ExploreByState } from "@/components/home/ExploreByState";
import { TopContributors } from "@/components/home/TopContributors";
import { CommunityCta } from "@/components/home/CommunityCta";
import {
  getFeaturedRecipes,
  getTrendingRecipes,
  getCommunityFavorites,
  getGrandmasRecipes,
  getRecentRecipes,
  getFestivalRecipes,
  getStatesWithRecipeCount,
  getTopContributors,
} from "@/lib/recipes";

export default async function HomePage() {
  const [
    featured,
    trending,
    festival,
    communityFavorites,
    grandmasRecipes,
    recent,
    states,
    contributors,
  ] = await Promise.all([
    getFeaturedRecipes(),
    getTrendingRecipes(),
    getFestivalRecipes(),
    getCommunityFavorites(),
    getGrandmasRecipes(),
    getRecentRecipes(),
    getStatesWithRecipeCount(),
    getTopContributors(),
  ]);

  return (
    <>
      <HeroSection />

      <RecipeSection
        title="Featured Recipes"
        subtitle="Handpicked classics from across India"
        recipes={featured}
        viewAllHref="/recipes?filter=featured"
      />

      <ExploreByState states={states} />

      <RecipeSection
        title="Festival Specials"
        subtitle="Celebrate with traditional festive dishes"
        recipes={festival}
        viewAllHref="/festivals"
      />

      <RecipeSection
        title="Trending Recipes"
        subtitle="What the community is cooking right now"
        recipes={trending}
        viewAllHref="/recipes?filter=trending"
      />

      <RecipeSection
        title="Community Favorites"
        subtitle="Loved by home cooks across RasoiVerse"
        recipes={communityFavorites}
        viewAllHref="/recipes?filter=community"
      />

      <RecipeSection
        title="Grandma's Recipes"
        subtitle="Timeless treasures passed down through generations"
        recipes={grandmasRecipes}
        viewAllHref="/recipes?filter=grandmas"
      />

      <RecipeSection
        title="Recently Added"
        subtitle="Fresh additions to the library"
        recipes={recent}
        viewAllHref="/recipes?sort=recent"
      />

      <TopContributors contributors={contributors} />

      <CommunityCta />
    </>
  );
}
