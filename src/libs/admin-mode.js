// Shared config for the admin panel "Events" vs "Taal Ecommerce" mode.

export const SECTION_DEFAULT_PATH = {
  ecommerce: "/admin/order-management",
  events: "/admin/event-management",
};

// Maps route prefixes to their section so the active mode can be inferred.
export const PATH_SECTIONS = [
  { prefix: "/admin/event-management", section: "events" },
  { prefix: "/admin/ticket-bookings", section: "events" },
  { prefix: "/admin/generate-tickets", section: "events" },
  { prefix: "/admin/gatekeeper", section: "events" },
  { prefix: "/admin/dispute-management", section: "events" },
  { prefix: "/admin/categories", section: "ecommerce" },
  { prefix: "/admin/product-mangement", section: "ecommerce" },
  { prefix: "/admin/order-management", section: "ecommerce" },
];

export const sectionOfPath = (pathname) => {
  if (!pathname) return null;
  const match = PATH_SECTIONS.find(
    (p) => pathname === p.prefix || pathname.startsWith(p.prefix + "/")
  );
  return match?.section || null;
};
