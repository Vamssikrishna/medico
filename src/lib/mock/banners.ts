import type { BannerItem } from "@/lib/types";

export function getPersonalizedBanners(prefs?: { flu?: boolean; diabetes?: boolean }) {
  const base: BannerItem[] = [
    {
      id: "b1",
      title: "Fever season kit",
      subtitle: "Paracetamol combos + electrolytes nearby",
      tone: "season",
      cta: "Explore",
      href: "/search?q=fever",
    },
    {
      id: "b2",
      title: "₹50 off ₹499",
      subtitle: "Blinkit-speed delivery on OTC essentials",
      tone: "offer",
      cta: "Shop now",
      href: "/search?q=cold",
    },
    {
      id: "b3",
      title: "Emergency lane open",
      subtitle: "Priority routing for critical medicines",
      tone: "alert",
      cta: "Order fast",
      href: "/checkout?priority=1",
    },
  ];
  if (prefs?.diabetes) {
    base.unshift({
      id: "b-dm",
      title: "Diabetes care bundle",
      subtitle: "Strips, metformin support, low-GI snacks",
      tone: "season",
      cta: "View",
      href: "/search?q=diabetes",
    });
  }
  return base;
}
