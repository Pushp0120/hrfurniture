/**
 * Curated catalogue shown on the collection pages (/collections/:slug) and
 * the landing-page tiles.
 *
 * Only the showroom's best-looking photos make it here — branded mattress
 * posters and WhatsApp catalogue cards with baked-in prices stay off the
 * site (they clash with the "from ₹" pricing and look like spam).
 */

export type CatalogItem = { img: string; title: string };

export type CatalogCategory = {
  slug: string;
  name: string;
  /** Short line used on the landing-page tile. */
  tagline: string;
  /** Longer intro used on the collection page hero. */
  blurb: string;
  from: number;
  /** Photo used on the landing-page tile. */
  tileImg: string;
  alt: string;
  items: CatalogItem[];
};

/** ₹ with Indian digit grouping. */
export function formatPrice(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

const p = (n: number) => `/client-photos/img-${String(n).padStart(2, "0")}.jpg`;

export const CATEGORIES: CatalogCategory[] = [
  {
    slug: "sofas",
    name: "Sofas",
    tagline: "3-seater, L-shaped & designer sets",
    blurb:
      "L-shaped showstoppers, 3+2+1 sets and compact 3-seaters — deep foam, solid frames and premium fabrics in colours that suit every living room.",
    from: 18999,
    tileImg: p(34),
    alt: "Premium sofa set at H R Furniture",
    items: [
      { img: p(29), title: "L-shape sofa with ottoman — light grey" },
      { img: p(30), title: "Tufted L-shape sofa — slate grey" },
      { img: p(31), title: "L-shape sofa with scatter cushions — cream" },
      { img: p(32), title: "Corner L-shape sofa — light grey" },
      { img: p(33), title: "L-shape with matching armchairs — ivory" },
      { img: p(34), title: "L-shape with wing chairs — walnut & beige" },
      { img: p(35), title: "Two-tone corner sofa — white & teal" },
      { img: p(36), title: "L-shape sofa — off white" },
      { img: p(37), title: "L-shape sofa with ottoman — cream" },
      { img: p(38), title: "3+2+1 sofa set — champagne" },
      { img: p(39), title: "L-shape sofa with pouf — stone grey" },
      { img: p(40), title: "Premium 3-seater sofa — navy blue" },
    ],
  },
  {
    slug: "beds",
    name: "Beds",
    tagline: "Storage beds & mattresses",
    blurb:
      "Box-storage and hydraulic beds with tall upholstered headboards — king and queen sizes, paired with comfortable mattresses at honest rates.",
    from: 12499,
    tileImg: p(19),
    alt: "Premium upholstered bed at H R Furniture",
    items: [
      { img: p(18), title: "Box-storage bed with dresser — walnut" },
      { img: p(19), title: "Upholstered bed with patterned bedding — ivory" },
      { img: p(20), title: "Bed with tall tufted headboard — espresso" },
      { img: p(24), title: "Chevron headboard bed — charcoal" },
      { img: p(28), title: "Upholstered bed — teal" },
    ],
  },
  {
    slug: "dining",
    name: "Dining & Tables",
    tagline: "4/6/8-seater sets & center tables",
    blurb:
      "Marble-top 6-seaters, compact 4-seater tables and full dining sets with upholstered chairs — built for daily family dinners and guests alike.",
    from: 9999,
    tileImg: p(1),
    alt: "Marble-top dining table at H R Furniture",
    items: [
      { img: p(1), title: "Marble-top dining set — 6 seater" },
      { img: p(2), title: "Dining set with upholstered chairs — 6 seater" },
      { img: p(4), title: "Compact dining table — 4 seater" },
      { img: p(5), title: "Marble-top dining set — wooden frame" },
    ],
  },
  {
    slug: "chairs",
    name: "Chairs",
    tagline: "Dining, lounge & office chairs",
    blurb:
      "Executive office chairs, visitor chairs and accent lounge chairs — comfortable for long hours, smart enough for the living room.",
    from: 2499,
    tileImg: p(7),
    alt: "Premium chairs at H R Furniture",
    items: [
      { img: p(6), title: "Visitor chair — tan leatherette" },
      { img: p(7), title: "Tub chair — camel fabric" },
      { img: p(8), title: "Executive office chair — high back" },
      { img: p(10), title: "Accent chair — mustard quilted" },
      { img: p(11), title: "Dining chair — cream with gold legs" },
      { img: p(15), title: "Executive recliner chair — mustard" },
    ],
  },
  {
    slug: "wardrobes",
    name: "Wardrobes",
    tagline: "Sliding doors, dressers & storage",
    blurb:
      "Sliding-door wardrobes, classic 4-door units and glass-front crockery units in gloss and laminate finishes — made to fit your room.",
    from: 14999,
    tileImg: p(17),
    alt: "Sliding wardrobe at H R Furniture",
    items: [
      { img: p(17), title: "Sliding wardrobe — glossy finish" },
      { img: p(23), title: "4-door wardrobe with mirror — white" },
      { img: p(25), title: "Sliding wardrobe — grey laminate" },
      { img: p(26), title: "Glass-door crockery unit — oak" },
      { img: p(27), title: "Wardrobe with gold inlay — midnight blue" },
    ],
  },
  {
    slug: "room-combos",
    name: "Room Combos",
    tagline: "Full bedroom & living bundles",
    blurb:
      "Bed + wardrobe + dresser bundles styled as complete rooms — one price, one delivery, a finished room in a single visit.",
    from: 34999,
    tileImg: p(20),
    alt: "Complete bedroom set at H R Furniture",
    items: [
      { img: p(18), title: "Bedroom set — bed, dresser & wardrobe" },
      { img: p(19), title: "Complete bedroom — bed, rug & decor" },
      { img: p(28), title: "Styled bedroom with upholstered bed" },
      { img: p(23), title: "Bedroom wardrobe with mirror — white" },
    ],
  },
];
