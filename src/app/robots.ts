import { MetadataRoute } from "next";
import { siteContent } from "@/src/content/site";

export default function robots(): MetadataRoute.Robots {
  const domain = siteContent.siteConfig.domain || "https://odoline.app";

  const disallowList: string[] = [];
  if (!siteContent.legal.privacy.reviewed) {
    disallowList.push("/privacy");
  }
  if (!siteContent.legal.terms.reviewed) {
    disallowList.push("/terms");
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: disallowList,
    },
    sitemap: `${domain}/sitemap.xml`,
  };
}
