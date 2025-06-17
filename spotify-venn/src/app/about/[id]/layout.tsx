import { Metadata } from "next";

//Testing dynamic metadata
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: "Spotify Venn About Page",
    description: params.id,
    keywords: ["Spotify", "About", "Spotify Plugin", params.id]
  };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}