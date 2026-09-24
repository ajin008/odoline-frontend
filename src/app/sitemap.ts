import { MetadataRoute } from "next";
import { siteContent } from "@/src/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const domain = siteContent.siteConfig.domain || "https://odoline.app";

  const routes: MetadataRoute.Sitemap = [
    {
      url: domain,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  if (siteContent.legal.privacy.reviewed) {
    routes.push({
      url: `${domain}/privacy`,
      lastModified: new Date(siteContent.legal.privacy.lastUpdated),
      changeFrequency: "monthly",
      priority: 0.3,
    });
  }

  if (siteContent.legal.terms.reviewed) {
    routes.push({
      url: `${domain}/terms`,
      lastModified: new Date(siteContent.legal.terms.lastUpdated),
      changeFrequency: "monthly",
      priority: 0.3,
    });
  }

  return routes;
}
