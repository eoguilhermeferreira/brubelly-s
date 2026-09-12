import { HeaderShell } from "@/components/store/header-shell";
import { getCategories } from "@/lib/queries";

export async function Header() {
  const categories = await getCategories();

  return <HeaderShell categories={categories} />;
}
