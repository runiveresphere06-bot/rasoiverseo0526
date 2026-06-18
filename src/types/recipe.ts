export type Ingredient = {
  item: string;
  amount: string;
};

export type Instruction = {
  step: number;
  text: string;
};

export type RecipeSearchParams = {
  q?: string;
  state?: string;
  category?: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  festival?: string;
  filter?: "featured" | "trending" | "community" | "grandmas";
  sort?: "recent" | "popular" | "rating";
  page?: number;
  limit?: number;
};

export type SubmissionInput = {
  rawContent: string;
  title?: string;
  story?: string;
  imageUrl?: string;
};

export type PublishRecipeInput = {
  title: string;
  slug: string;
  description?: string;
  story?: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  stateId?: string;
  categoryIds: string[];
  festivalId?: string;
  imageUrl?: string;
  featured?: boolean;
  trending?: boolean;
  communityFavorite?: boolean;
  grandmasPick?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};
