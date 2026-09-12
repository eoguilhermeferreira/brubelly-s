import Link from "next/link";

import { getCategoryIcon } from "@/lib/category-icons";
import type { Category } from "@/types/database.types";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-6 sm:overflow-visible">
      {categories.map((category) => {
        const Icon = getCategoryIcon(category.slug);
        return (
          <Link
            key={category.id}
            href={`/categoria/${category.slug}`}
            className="group tag-shape relative flex w-28 shrink-0 flex-col items-center gap-2 bg-white px-4 py-5 text-center shadow-[0_1px_0_rgba(22,40,29,0.05)] transition-transform hover:-translate-y-0.5 hover:rotate-[-1.5deg] focus-visible:outline-2 focus-visible:outline-mint-600 sm:w-auto"
          >
            <span className="tag-hole" aria-hidden />
            <span className="flex size-11 items-center justify-center rounded-full bg-mint-200 text-pine-900 transition-colors group-hover:bg-rose-100">
              <Icon className="size-5" strokeWidth={1.75} />
            </span>
            <span className="font-display text-sm font-semibold text-pine-900">{category.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
