import {
  PrismaClient,
  Role,
  RecipeStatus,
  Difficulty,
} from "@prisma/client";
import {
  INDIAN_STATES,
  CATEGORIES,
  FESTIVALS,
  ADMIN_EMAILS,
} from "../src/lib/constants";

const prisma = new PrismaClient();

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
  "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80",
  "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80",
  "https://images.unsplash.com/photo-1606491956689-2ea866854f01?w=800&q=80",
];

const SEED_RECIPES = [
  {
    title: "Butter Chicken",
    slug: "butter-chicken",
    description:
      "Creamy, tomato-rich North Indian classic with tender tandoori-style chicken.",
    stateSlug: "punjab",
    categorySlugs: ["non-vegetarian", "dinner"],
    festivalSlug: null,
    prepTime: 30,
    cookTime: 45,
    servings: 4,
    difficulty: Difficulty.MEDIUM,
    featured: true,
    trending: true,
    communityFavorite: true,
    grandmasPick: false,
    ingredients: [
      { item: "Chicken thighs", amount: "500g" },
      { item: "Tomato puree", amount: "1 cup" },
      { item: "Heavy cream", amount: "1/2 cup" },
      { item: "Butter", amount: "3 tbsp" },
      { item: "Garam masala", amount: "1 tsp" },
    ],
    instructions: [
      { step: 1, text: "Marinate chicken with yogurt and spices for 30 minutes." },
      { step: 2, text: "Sear chicken until golden, then set aside." },
      { step: 3, text: "Simmer tomato puree with butter and spices." },
      { step: 4, text: "Add cream and chicken. Cook until silky and rich." },
    ],
  },
  {
    title: "Masala Dosa",
    slug: "masala-dosa",
    description:
      "Crispy fermented rice crepe filled with spiced potato masala — a South Indian icon.",
    stateSlug: "karnataka",
    categorySlugs: ["vegetarian", "breakfast"],
    festivalSlug: null,
    prepTime: 480,
    cookTime: 30,
    servings: 4,
    difficulty: Difficulty.HARD,
    featured: true,
    trending: false,
    communityFavorite: true,
    grandmasPick: true,
    ingredients: [
      { item: "Rice and urad dal batter", amount: "2 cups" },
      { item: "Potatoes", amount: "4 medium" },
      { item: "Mustard seeds", amount: "1 tsp" },
      { item: "Curry leaves", amount: "10 leaves" },
    ],
    instructions: [
      { step: 1, text: "Prepare fermented dosa batter and rest overnight." },
      { step: 2, text: "Cook spiced potato filling with mustard and curry leaves." },
      { step: 3, text: "Spread batter thin on a hot griddle until crisp." },
      { step: 4, text: "Fill with masala and serve with chutney and sambar." },
    ],
  },
  {
    title: "Pav Bhaji",
    slug: "pav-bhaji",
    description:
      "Mumbai street-food favorite — buttery mashed vegetable curry with soft bread rolls.",
    stateSlug: "maharashtra",
    categorySlugs: ["vegetarian", "street-food", "snacks"],
    festivalSlug: null,
    prepTime: 20,
    cookTime: 35,
    servings: 4,
    difficulty: Difficulty.EASY,
    featured: false,
    trending: true,
    communityFavorite: false,
    grandmasPick: false,
    ingredients: [
      { item: "Mixed vegetables", amount: "4 cups" },
      { item: "Pav bhaji masala", amount: "2 tbsp" },
      { item: "Butter", amount: "4 tbsp" },
      { item: "Pav buns", amount: "8" },
    ],
    instructions: [
      { step: 1, text: "Pressure cook vegetables until very soft." },
      { step: 2, text: "Mash and cook with masala and butter on a flat griddle." },
      { step: 3, text: "Toast pav with butter until golden." },
      { step: 4, text: "Serve bhaji hot with onions and lemon." },
    ],
  },
  {
    title: "Gujarati Undhiyu",
    slug: "gujarati-undhiyu",
    description:
      "Winter harvest stew of seasonal vegetables, slow-cooked with fragrant spices.",
    stateSlug: "gujarat",
    categorySlugs: ["vegetarian", "lunch", "festival-food"],
    festivalSlug: "uttarayan",
    prepTime: 45,
    cookTime: 60,
    servings: 6,
    difficulty: Difficulty.MEDIUM,
    featured: true,
    trending: false,
    communityFavorite: false,
    grandmasPick: true,
    ingredients: [
      { item: "Purple yam", amount: "200g" },
      { item: "Green beans", amount: "150g" },
      { item: "Brinjal", amount: "2 small" },
      { item: "Coconut and peanut masala", amount: "1/2 cup" },
    ],
    instructions: [
      { step: 1, text: "Prepare stuffed vegetables with masala paste." },
      { step: 2, text: "Layer vegetables in a heavy pot." },
      { step: 3, text: "Cook on low heat with minimal water." },
      { step: 4, text: "Finish with fresh coriander and serve with puri." },
    ],
  },
  {
    title: "Rasgulla",
    slug: "rasgulla",
    description:
      "Soft Bengali cottage cheese balls soaked in light sugar syrup.",
    stateSlug: "west-bengal",
    categorySlugs: ["vegetarian", "desserts", "festival-food"],
    festivalSlug: "diwali",
    prepTime: 40,
    cookTime: 30,
    servings: 8,
    difficulty: Difficulty.MEDIUM,
    featured: false,
    trending: false,
    communityFavorite: true,
    grandmasPick: true,
    ingredients: [
      { item: "Full-fat milk", amount: "1 liter" },
      { item: "Lemon juice", amount: "2 tbsp" },
      { item: "Sugar", amount: "2 cups" },
      { item: "Cardamom", amount: "1/2 tsp" },
    ],
    instructions: [
      { step: 1, text: "Curdle milk and drain chenna thoroughly." },
      { step: 2, text: "Knead chenna until smooth and shape balls." },
      { step: 3, text: "Boil sugar syrup and gently add balls." },
      { step: 4, text: "Cook covered until spongy. Cool and serve." },
    ],
  },
  {
    title: "Hyderabadi Biryani",
    slug: "hyderabadi-biryani",
    description:
      "Aromatic layered rice and meat dish, sealed and slow-cooked dum style.",
    stateSlug: "telangana",
    categorySlugs: ["non-vegetarian", "lunch", "dinner"],
    festivalSlug: "eid",
    prepTime: 60,
    cookTime: 90,
    servings: 6,
    difficulty: Difficulty.HARD,
    featured: true,
    trending: true,
    communityFavorite: true,
    grandmasPick: false,
    ingredients: [
      { item: "Basmati rice", amount: "3 cups" },
      { item: "Mutton or chicken", amount: "750g" },
      { item: "Fried onions", amount: "1 cup" },
      { item: "Saffron milk", amount: "3 tbsp" },
    ],
    instructions: [
      { step: 1, text: "Marinate meat with yogurt and biryani spices." },
      { step: 2, text: "Parboil rice with whole spices." },
      { step: 3, text: "Layer meat and rice with herbs and saffron." },
      { step: 4, text: "Dum cook on low heat until fragrant." },
    ],
  },
];

async function main() {
  console.log("Seeding RasoiVerse database...");

  for (const [index, state] of INDIAN_STATES.entries()) {
    await prisma.state.upsert({
      where: { slug: state.slug },
      update: {},
      create: {
        name: state.name,
        slug: state.slug,
        sortOrder: index,
        description: `Authentic recipes from ${state.name}`,
      },
    });
  }

  for (const [index, category] of CATEGORIES.entries()) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        name: category.name,
        slug: category.slug,
        sortOrder: index,
      },
    });
  }

  for (const [index, festival] of FESTIVALS.entries()) {
    await prisma.festival.upsert({
      where: { slug: festival.slug },
      update: {},
      create: {
        name: festival.name,
        slug: festival.slug,
        month: festival.month,
        sortOrder: index,
        description: `Festival specials for ${festival.name}`,
      },
    });
  }

  const systemUser = await prisma.user.upsert({
    where: { email: "team@rasoiverse.com" },
    update: {},
    create: {
      email: "team@rasoiverse.com",
      name: "RasoiVerse Team",
      emailVerified: new Date(),
      role: Role.ADMIN,
    },
  });

  for (const adminEmail of ADMIN_EMAILS) {
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: Role.ADMIN },
      create: {
        email: adminEmail,
        name: adminEmail.split("@")[0],
        emailVerified: new Date(),
        role: Role.ADMIN,
      },
    });
  }

  const states = await prisma.state.findMany();
  const categories = await prisma.category.findMany();
  const festivals = await prisma.festival.findMany();

  const stateMap = Object.fromEntries(states.map((s) => [s.slug, s.id]));
  const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));
  const festivalMap = Object.fromEntries(festivals.map((f) => [f.slug, f.id]));

  for (const [index, recipe] of SEED_RECIPES.entries()) {
    const festivalSlug =
      recipe.festivalSlug === "uttarayan" ? "navratri" : recipe.festivalSlug;

    await prisma.recipe.upsert({
      where: { slug: recipe.slug },
      update: {},
      create: {
        title: recipe.title,
        slug: recipe.slug,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        status: RecipeStatus.PUBLISHED,
        featured: recipe.featured,
        trending: recipe.trending,
        communityFavorite: recipe.communityFavorite,
        grandmasPick: recipe.grandmasPick,
        imageUrl: PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length],
        seoTitle: `${recipe.title} | RasoiVerse`,
        seoDescription: recipe.description,
        publishedAt: new Date(),
        stateId: stateMap[recipe.stateSlug],
        festivalId: festivalSlug ? festivalMap[festivalSlug] : null,
        authorId: systemUser.id,
        categories: {
          create: recipe.categorySlugs.map((slug) => ({
            categoryId: categoryMap[slug],
          })),
        },
      },
    });
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
