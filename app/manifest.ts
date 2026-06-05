import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "InboxQ / Command Alpha",
    short_name: "InboxQ",
    description: "Personal AI morning homepage and productivity command center.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7f6f2",
    theme_color: "#1c1f23",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/inboxq-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/icons/inboxq-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
