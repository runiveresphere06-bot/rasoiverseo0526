"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { Ingredient, Instruction } from "@/types/recipe";

interface SubmissionData {
  id: string;
  rawContent: string;
  title: string | null;
  story: string | null;
  imageUrl: string | null;
  user: { name: string | null; email: string };
}

interface Option {
  id: string;
  name: string;
}

interface AdminSubmissionEditorProps {
  submission: SubmissionData;
  states: Option[];
  categories: Option[];
  festivals: Option[];
}

export function AdminSubmissionEditor({
  submission,
  states,
  categories,
  festivals,
}: AdminSubmissionEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(submission.title ?? "");
  const [description, setDescription] = useState("");
  const [story, setStory] = useState(submission.story ?? "");
  const [slug, setSlug] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [stateId, setStateId] = useState("");
  const [festivalId, setFestivalId] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState(submission.imageUrl ?? "");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { item: "", amount: "" },
  ]);
  const [instructions, setInstructions] = useState<Instruction[]>([
    { step: 1, text: "" },
  ]);
  const [featured, setFeatured] = useState(false);
  const [trending, setTrending] = useState(false);

  function toggleCategory(id: string) {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }

  async function handlePublish(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const validIngredients = ingredients.filter((i) => i.item.trim());
    const validInstructions = instructions
      .filter((i) => i.text.trim())
      .map((inst, idx) => ({ step: idx + 1, text: inst.text.trim() }));

    try {
      const response = await fetch(`/api/admin/submissions/${submission.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slug || undefined,
          description: description || undefined,
          story: story || undefined,
          ingredients: validIngredients,
          instructions: validInstructions,
          prepTime: prepTime ? Number(prepTime) : undefined,
          cookTime: cookTime ? Number(cookTime) : undefined,
          servings: servings ? Number(servings) : undefined,
          difficulty,
          stateId: stateId || undefined,
          festivalId: festivalId || undefined,
          categoryIds,
          imageUrl: imageUrl || undefined,
          featured,
          trending,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Failed to publish");
        return;
      }

      router.push(`/admin/recipes`);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    if (!confirm("Reject this submission?")) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/submissions/${submission.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? "Failed to reject");
        return;
      }

      router.push("/admin/submissions");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-2xl border border-primary/8 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-primary">Original Submission</h2>
        <p className="mt-1 text-sm text-primary/50">
          by {submission.user.name ?? submission.user.email}
        </p>
        <div className="mt-4 rounded-xl bg-background p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-primary/80">
            {submission.rawContent}
          </p>
        </div>
        {submission.story && (
          <div className="mt-4">
            <p className="text-xs font-medium uppercase text-primary/40">Story</p>
            <p className="mt-1 text-sm text-primary/70">{submission.story}</p>
          </div>
        )}
      </section>

      <form onSubmit={handlePublish} className="space-y-4 rounded-2xl border border-primary/8 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-primary">Publish as Structured Recipe</h2>

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Recipe title *"
          required
          className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none focus:border-accent"
        />

        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="URL slug (auto-generated if empty)"
          className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none focus:border-accent"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description"
          rows={2}
          className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none focus:border-accent"
        />

        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="Story"
          rows={2}
          className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none focus:border-accent"
        />

        <div className="grid gap-3 sm:grid-cols-4">
          <input
            type="number"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            placeholder="Prep (min)"
            className="rounded-xl border border-primary/10 px-3 py-2 text-sm outline-none"
          />
          <input
            type="number"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            placeholder="Cook (min)"
            className="rounded-xl border border-primary/10 px-3 py-2 text-sm outline-none"
          />
          <input
            type="number"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            placeholder="Servings"
            className="rounded-xl border border-primary/10 px-3 py-2 text-sm outline-none"
          />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
            className="rounded-xl border border-primary/10 px-3 py-2 text-sm outline-none"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        <select
          value={stateId}
          onChange={(e) => setStateId(e.target.value)}
          className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none"
        >
          <option value="">Select state</option>
          {states.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select
          value={festivalId}
          onChange={(e) => setFestivalId(e.target.value)}
          className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none"
        >
          <option value="">Festival (optional)</option>
          {festivals.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleCategory(c.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                categoryIds.includes(c.id)
                  ? "bg-accent text-primary"
                  : "bg-primary/5 text-primary/60 hover:bg-primary/10"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL"
          className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none"
        />

        <div>
          <p className="mb-2 text-sm font-medium text-primary">Ingredients</p>
          {ingredients.map((ing, idx) => (
            <div key={idx} className="mb-2 flex gap-2">
              <input
                value={ing.item}
                onChange={(e) => {
                  const next = [...ingredients];
                  next[idx] = { ...ing, item: e.target.value };
                  setIngredients(next);
                }}
                placeholder="Ingredient"
                className="flex-1 rounded-lg border border-primary/10 px-3 py-2 text-sm"
              />
              <input
                value={ing.amount}
                onChange={(e) => {
                  const next = [...ingredients];
                  next[idx] = { ...ing, amount: e.target.value };
                  setIngredients(next);
                }}
                placeholder="Amount"
                className="w-28 rounded-lg border border-primary/10 px-3 py-2 text-sm"
              />
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIngredients([...ingredients, { item: "", amount: "" }])}
          >
            + Add ingredient
          </Button>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-primary">Instructions</p>
          {instructions.map((inst, idx) => (
            <textarea
              key={idx}
              value={inst.text}
              onChange={(e) => {
                const next = [...instructions];
                next[idx] = { ...inst, text: e.target.value };
                setInstructions(next);
              }}
              placeholder={`Step ${idx + 1}`}
              rows={2}
              className="mb-2 w-full rounded-lg border border-primary/10 px-3 py-2 text-sm"
            />
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              setInstructions([...instructions, { step: instructions.length + 1, text: "" }])
            }
          >
            + Add step
          </Button>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={trending} onChange={(e) => setTrending(e.target.checked)} />
            Trending
          </label>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Publishing..." : "Publish Recipe"}
          </Button>
          <Button type="button" variant="outline" onClick={handleReject} disabled={loading}>
            Reject
          </Button>
        </div>
      </form>
    </div>
  );
}
