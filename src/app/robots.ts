import type { MetadataRoute } from "next";

import { STORE } from "@/config/store";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/admin" }],
    sitemap: `${STORE.url}/sitemap.xml`,
  };
}
