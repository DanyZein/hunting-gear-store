import type { Metadata } from "next";
import { Barlow, Barlow_Condensed, JetBrains_Mono } from "next/font/google";

import "@/app/globals.css";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/store/CartDrawer";
import { FilterProvider } from "@/components/store/FilterProvider";
import { MobileMenu } from "@/components/store/MobileMenu";
import { StoreProvider } from "@/components/store/StoreProvider";
import { Toast } from "@/components/store/Toast";
import { getSettings, getTaxonomy } from "@/lib/content";
import { THEME_SCRIPT } from "@/lib/theme";

/**
 * Type system: a condensed grotesque for display, its own non-condensed sibling
 * for running text, and a mono for anything measured. Three faces from one
 * family tree keeps the catalog feeling like a spec sheet rather than a
 * lifestyle brand.
 */
const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const body = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const name = `${settings.brand.name} ${settings.brand.sub}`;

  return {
    title: { default: name, template: `%s — ${name}` },
    description: settings.description,
    openGraph: { title: name, description: settings.description, type: "website" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, taxonomy] = await Promise.all([getSettings(), getTaxonomy()]);

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        {/* Applies a saved theme choice before first paint. First child of
            <body> so it runs during parse, ahead of any visible content. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />

        {/* The providers are client components but `children` is passed through
            as a slot, so the page itself still renders on the server. */}
        <StoreProvider>
          <FilterProvider grounds={taxonomy.grounds} groups={taxonomy.groups}>
            <AnnouncementBar settings={settings} />
            <Header settings={settings} />
            <main>{children}</main>
            <Footer settings={settings} />
            <CartDrawer settings={settings} />
            <MobileMenu settings={settings} />
            <Toast />
          </FilterProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
