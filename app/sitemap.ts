import { MetadataRoute } from "next";

export default async function sitemap():
Promise<MetadataRoute.Sitemap> {

  return [
    {
      url:
        "https://web.pentas.tv",
      lastModified:
        new Date(),
    },
  ];
}