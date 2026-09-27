import { EnquiryForm } from "@/components/EnquiryForm";
import { InstagramIcon, WhatsAppIcon } from "@/components/BrandIcons";
import { BrandLogo } from "@/components/BrandLogo";
import { ReviewForm } from "@/components/ReviewForm";
import { Stars } from "@/components/Stars";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/lib/api";
import type { GalleryItem, Product, Review } from "@/lib/api";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Armchair,
  Award,
  BedDouble,
  Check,
  Clock,
  DoorClosed,
  MapPin,
  Package,
  Phone,
  Quote,
  ShieldCheck,
  Sofa,
  Sparkles,
  Star,
  Truck,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import { Link } from "react-router";

const INSTAGRAM_URL = "https://instagram.com/hrfurniture"; // TODO: client handle
// wa.me needs the full international format — 91 (India) + 10-digit mobile.
const WHATSAPP_URL = "https://wa.me/919999999999"; // TODO: client WhatsApp number
const ADDRESS = "H R Furniture, Main Road, Your City 000000"; // TODO: client address
const MAP_SRC =
  "https://www.google.com/maps?q=Surat%2C%20Gujarat%2C%20India&output=embed"; // TODO: exact showroom

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
} as const;

// One hero-family photo per category — swapped for admin uploads over time.
const categoryTiles = [
  {
    name: "Sofas",
    tagline: "3-seater, L-shaped & designer sets",
    from: 18999,
    img: "/client-photos/img-34.jpg",
    alt: "Premium sofa set at H R Furniture",
  },
  {
    name: "Beds",
    tagline: "Storage beds & mattresses",
    from: 12499,
    img: "/client-photos/img-18.jpg",
    alt: "Designer bed with storage at H R Furniture",
  },
  {
    name: "Dining & Tables",
    tagline: "4/6/8-seater sets & center tables",
    from: 9999,
    img: "/client-photos/img-01.jpg",
    alt: "Marble-top dining table at H R Furniture",
  },
  {
    name: "Chairs",
    tagline: "Dining, lounge & office chairs",
    from: 2499,
    img: "/client-photos/img-07.jpg",
    alt: "Premium chairs at H R Furniture",
  },
  {
    name: "Wardrobes",
    tagline: "Sliding doors, dressers & storage",
    from: 14999,
    img: "/client-photos/img-17.jpg",
    alt: "Sliding wardrobe at H R Furniture",
  },
  {
    name: "Room Combos",
    tagline: "Full bedroom & living bundles",
    from: 34999,
    img: "/client-photos/img-20.jpg",
    alt: "Complete bedroom set at H R Furniture",
  },
];

const benefits = [
  {
    icon: Award,
    title: "Hand-picked quality",
    copy: "Every sofa, chair and table is selected for frame strength, fabric and finish — nothing flimsy makes the showroom floor.",
  },
  {
    icon: Wallet,
    title: "Honest showroom pricing",
    copy: "Direct-from-manufacturer rates without the mall markup. What we quote is what you pay.",
  },
  {
    icon: Truck,
    title: "Home delivery & setup",
    copy: "Doorstep delivery with careful handling and placement, so your new furniture arrives perfect and sits right.",
  },
  {
    icon: ShieldCheck,
    title: "Warranty on every piece",
    copy: "Frame and workmanship warranty on all sofas and tables — buy with confidence, we stand behind what we sell.",
  },
];

const steps = [
  { title: "Browse & shortlist", copy: "Explore the showroom or the gallery online and note what you love." },
  { title: "Visit or call us", copy: "Sit, feel the fabric, check the finish — or ask us anything on WhatsApp." },
  { title: "Best price, booked", copy: "Get a clear quote with delivery. Pay and lock your piece." },
  { title: "Delivered & placed", copy: "We deliver, set it up and hand over care tips for years of use." },
];

const stats = [
  { value: "1000+", label: "Happy homes furnished" },
  { value: "500+", label: "Designs in store" },
  { value: "10 yr", label: "Trusted locally" },
  { value: "4.9★", label: "Customer rating" },
];

const faqs = [
  {
    q: "Do you sell ready stock or made-to-order?",
    a: "Both. Most sofa sets, chairs and tables are in ready stock for immediate delivery; premium fabrics and specific sizes can be ordered and typically arrive in 2–3 weeks.",
  },
  {
    q: "Can I try the sofa before buying?",
    a: "Absolutely — that's the whole point of a showroom. Visit us, sit on everything, compare fabrics and foam densities. We'd rather you be sure.",
  },
  {
    q: "Do you deliver to my area?",
    a: "We deliver across the city and surrounding towns. Delivery charges depend on distance and floor access — share your pin code or area on WhatsApp for an exact figure.",
  },
  {
    q: "What about warranty and after-sales?",
    a: "Every piece carries a frame and workmanship warranty (terms vary by product). If anything goes wrong, message us — the same people who sold it to you will fix it.",
  },
];

function formatPrice(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

/** Picks a fitting lucide icon from the category name (admin-editable). */
function ProductIcon({ name }: { name: string }) {
  const n = name.toLowerCase();
  if (n.includes("bed") || n.includes("mattress")) return <BedDouble className="size-5" />;
  if (n.includes("dining") || n.includes("table")) return <UtensilsCrossed className="size-5" />;
  if (n.includes("chair")) return <Armchair className="size-5" />;
  if (n.includes("wardrobe") || n.includes("storage")) return <DoorClosed className="size-5" />;
  if (n.includes("combo")) return <Package className="size-5" />;
  return <Sofa className="size-5" />;
}

export default function Landing() {
  const gallery = useApi<GalleryItem[]>("/api/gallery");
  const products = useApi<Product[]>("/api/products");
  const reviews = useApi<Review[]>("/api/reviews", { pollMs: 30000 });

  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Announcement strip */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-2 px-5 py-2 text-center text-xs font-medium tracking-wide sm:text-sm">
          <Sparkles className="size-3.5 text-accent" />
          <span>
            Monsoon Sale — up to 30% off on sofa sets · Free home delivery in city
          </span>
        </div>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
          <a href="#top" className="flex min-w-0 items-center gap-2.5">
            <BrandLogo />
            <span className="flex min-w-0 flex-col leading-none">
              <span className="truncate text-sm font-semibold tracking-tight sm:text-base">
                H R FURNITURE
              </span>
              <span className="mt-0.5 hidden truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:block">
                Sofas · Beds · Dining · Wardrobes
              </span>
            </span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
            <a href="#collections" className="transition-colors hover:text-foreground">
              Collections
            </a>
            <a href="#gallery" className="transition-colors hover:text-foreground">
              Gallery
            </a>
            <a href="#reviews" className="transition-colors hover:text-foreground">
              Reviews
            </a>
            <a href="#location" className="transition-colors hover:text-foreground">
              Location
            </a>
            <a href="#contact" className="transition-colors hover:text-foreground">
              Contact
            </a>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="icon"
              aria-label="Instagram"
              className="hidden sm:inline-flex"
            >
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                <InstagramIcon className="size-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="icon"
              aria-label="Chat on WhatsApp"
              className="hidden sm:inline-flex"
            >
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="size-4" />
              </a>
            </Button>
            <Button asChild size="sm" className="gap-1.5">
              <a href="#contact">
                Get best price
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero — full-bleed dark showroom image with editorial overlay */}
      <section id="top" className="relative scroll-mt-20 overflow-hidden">
        <img
          src="/client-photos/img-36.jpg"
          alt="Premium living room furniture at the H R Furniture showroom"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-5 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <Badge
              variant="outline"
              className="border-white/30 bg-white/10 text-white backdrop-blur"
            >
              <MapPin className="mr-1.5 size-3.5 text-accent" />
              Premium furniture showroom
            </Badge>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Furniture for every room,
              <span className="text-accent"> priced for every family</span>.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
              Sofas you sink into, beds built to last, dining sets that anchor
              the room and wardrobes that fit it all — hand-picked by H R
              Furniture, delivered to your door.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                <a href="#contact">
                  Get best price
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                <a href="#collections">Browse collections</a>
              </Button>
            </div>
            {reviews && reviews.length > 0 && (
              <div className="mt-6 flex items-center gap-3 text-sm text-white/80">
                <Stars value={avgRating} />
                <span>
                  {avgRating.toFixed(1)} from {reviews.length} review
                  {reviews.length > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border/60 bg-card">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 px-5 py-6 text-sm sm:grid-cols-4">
          {["Ready stock available", "Free home delivery*", "Best price promise", "Warranty included"].map(
            (item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="size-4 shrink-0 text-accent" />
                <span className="font-medium">{item}</span>
              </div>
            ),
          )}
        </div>
        <p className="pb-3 text-center text-[10px] text-muted-foreground">
          *Free within city limits
        </p>
      </section>

      {/* Collections — the three categories */}
      <section id="collections" className="mx-auto w-full max-w-6xl scroll-mt-20 px-5 py-16 lg:py-20">
        <motion.div {...fadeUp} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <Badge variant="outline" className="border-border/70">
              Collections
            </Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Shop by category
            </h2>
            <p className="mt-3 text-muted-foreground">
              Everything for your home under one roof — sofas, beds, dining,
              chairs and wardrobes. Every piece is ready to see, sit on and
              take home.
            </p>
          </div>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryTiles.map((cat, index) => (
            <motion.a
              key={cat.name}
              href="#contact"
              {...fadeUp}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="group relative block overflow-hidden rounded-2xl border border-border/70"
            >
              <img
                src={cat.img}
                alt={cat.alt}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
                  From {formatPrice(cat.from)}
                </p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight">
                  {cat.name}
                </h3>
                <p className="mt-1 text-sm text-white/80">{cat.tagline}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium">
                  Explore
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Rates / products (admin-editable) */}
      <section id="rates" className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 lg:py-20">
          <motion.div {...fadeUp} className="max-w-2xl">
            <Badge variant="outline" className="border-border/70 bg-background">
              Best prices
            </Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Starting prices — updated by us, always current
            </h2>
            <p className="mt-3 text-muted-foreground">
              Transparent starting rates across the full range. Final price
              depends on size, material and finish — ask us on WhatsApp for an
              exact quote today.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {products === undefined
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-44 w-full rounded-xl" />
                ))
              : products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    {...fadeUp}
                    transition={{ duration: 0.45, delay: index * 0.04 }}
                  >
                    <Card className="h-full border-border/70 shadow-none transition-colors hover:border-accent/60">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-lg font-semibold tracking-tight">
                            {product.name}
                          </h3>
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent-foreground">
                            <ProductIcon name={product.name} />
                          </span>
                        </div>
                        {product.description && (
                          <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            {product.description}
                          </p>
                        )}
                        <div className="mt-4 flex items-baseline gap-2">
                          <span className="text-2xl font-semibold tracking-tight">
                            {formatPrice(product.price)}
                          </span>
                          {product.priceNote && (
                            <span className="text-sm text-muted-foreground">
                              {product.priceNote}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* Gallery — client photos, admin-managed */}
      <section id="gallery" className="mx-auto w-full max-w-6xl scroll-mt-20 px-5 py-16 lg:py-20">
        <motion.div {...fadeUp} className="max-w-2xl">
          <Badge variant="outline" className="border-border/70">
            Gallery
          </Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Fresh arrivals &amp; real stock
          </h2>
          <p className="mt-3 text-muted-foreground">
            Photos from our showroom floor — sofas, beds, dining sets,
            wardrobes and more. See something you like? Message us on
            WhatsApp — most pieces are in ready stock.
          </p>
        </motion.div>

        {gallery && gallery.length > 0 ? (
          <div className="mt-10 columns-2 gap-4 sm:columns-3 [column-fill:_balance]">
            {gallery.map((image, index) => (
              <motion.div
                key={image._id}
                {...fadeUp}
                transition={{ duration: 0.45, delay: (index % 6) * 0.03 }}
                className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border/70 bg-card"
              >
                {image.url && (
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-sm font-medium text-white">
                    {image.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {categoryTiles.map((cat, index) => (
              <motion.div
                key={cat.name}
                {...fadeUp}
                transition={{ duration: 0.45, delay: index * 0.04 }}
                className="overflow-hidden rounded-2xl border border-border/70 bg-card"
              >
                <img src={cat.img} alt={cat.alt} className="aspect-[4/3] w-full object-cover" loading="lazy" />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Why us */}
      <section id="why" className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
          <motion.div {...fadeUp}>
            <Badge variant="outline" className="border-border/70 bg-background">
              Why H R Furniture
            </Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              A showroom that treats you like family
            </h2>
            <p className="mt-3 text-muted-foreground">
              We're a family-run furniture store, not a faceless chain. The
              people who help you choose are the people who deliver and stand
              behind your furniture for years.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="gap-2">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="size-4" />
                  Ask on WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <a href="#location">Visit showroom</a>
              </Button>
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                {...fadeUp}
                transition={{ duration: 0.45, delay: index * 0.05 }}
              >
                <Card className="h-full border-border/70 shadow-none">
                  <CardContent className="p-5">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-accent/15 text-accent-foreground">
                      <benefit.icon className="size-5" />
                    </span>
                    <h3 className="mt-3.5 text-base font-semibold tracking-tight">
                      {benefit.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                      {benefit.copy}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-foreground text-background">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-8 px-5 py-12 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-background/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="process" className="mx-auto w-full max-w-6xl scroll-mt-20 px-5 py-16 lg:py-20">
        <motion.div {...fadeUp} className="max-w-2xl">
          <Badge variant="outline" className="border-border/70">
            How it works
          </Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            From browsing to your living room, in four steps
          </h2>
        </motion.div>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              {...fadeUp}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <h3 className="mt-4 text-base font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                {step.copy}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="scroll-mt-20 border-y border-border/60 bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 lg:py-20">
          <motion.div {...fadeUp} className="max-w-2xl">
            <Badge variant="outline" className="border-border/70 bg-background">
              Reviews
            </Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              What our customers say
            </h2>
          </motion.div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              {reviews === undefined ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full rounded-xl" />
                ))
              ) : reviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground sm:col-span-2">
                  No reviews yet — be the first to share your experience.
                </div>
              ) : (
                reviews.map((review, index) => (
                  <motion.div
                    key={review._id}
                    {...fadeUp}
                    transition={{ duration: 0.45, delay: index * 0.04 }}
                  >
                    <Card className="h-full border-border/70 shadow-none">
                      <CardContent className="flex h-full flex-col p-6">
                        <Quote className="size-6 text-accent/60" />
                        <Stars value={review.rating} className="mt-3" />
                        <p className="mt-3 flex-1 text-sm leading-6 text-foreground/80">
                          {review.text}
                        </p>
                        <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                          <span className="flex size-9 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent-foreground">
                            {review.name.charAt(0).toUpperCase()}
                          </span>
                          <p className="text-sm font-medium">{review.name}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>

            <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.1 }}>
              <h3 className="mb-3 text-base font-semibold tracking-tight">
                Leave a review
              </h3>
              <ReviewForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-3xl px-5 py-16 lg:py-20">
        <motion.div {...fadeUp} className="text-center">
          <Badge variant="outline" className="border-border/70">
            FAQ
          </Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Questions, answered
          </h2>
        </motion.div>
        <motion.div {...fadeUp} className="mt-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.q} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-6 text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </section>

      {/* Location + map */}
      <section id="location" className="scroll-mt-20 border-y border-border/60 bg-muted/30">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2 lg:py-20">
          <motion.div {...fadeUp}>
            <Badge variant="outline" className="border-border/70 bg-background">
              Find us
            </Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Visit the showroom
            </h2>
            <div className="mt-6 space-y-5">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-accent shadow-sm">
                  <MapPin className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{ADDRESS}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-accent shadow-sm">
                  <Clock className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-medium">Opening hours</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Mon–Sun, 10am – 9pm · Open all days
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-accent shadow-sm">
                  <Phone className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-medium">Call us</p>
                  <a
                    href="tel:+919999999999"
                    className="mt-0.5 block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    +91 99999 99999
                  </a>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <Button asChild className="gap-2">
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="size-4" />
                    Chat on WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                    <InstagramIcon className="size-4" />
                    Follow on Instagram
                  </a>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="size-4" />
                    Open in Google Maps
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm"
          >
            <iframe
              title="H R Furniture location on Google Maps"
              src={MAP_SRC}
              className="h-80 w-full border-0 lg:h-full lg:min-h-[22rem]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-20">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2 lg:py-20">
          <motion.div {...fadeUp}>
            <Badge variant="outline" className="border-border/70">
              Get best price
            </Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Tell us what your home needs
            </h2>
            <p className="mt-3 text-muted-foreground">
              Send your details and we'll reply with availability, exact pricing
              and delivery time. No obligation — ask anything.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Ready stock — see it today, take it home this week",
                "Best price promise — we beat mall quotes",
                "Home delivery and careful placement",
                "Warranty and after-sales support",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent-foreground">
                    <Check className="size-3" />
                  </span>
                  <span className="text-foreground/80">{line}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.1 }}>
            <EnquiryForm />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <BrandLogo />
              <span className="truncate text-sm font-semibold tracking-tight sm:text-base">
                H R FURNITURE
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
              Premium sofas, beds, dining sets, chairs and wardrobes at
              honest showroom prices. Visit us, try the comfort, and furnish
              your home with pieces built to last.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold">Explore</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#collections" className="hover:text-foreground">
                  Collections
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-foreground">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-foreground">
                  Reviews
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-foreground"
                >
                  <WhatsAppIcon className="size-3.5" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-foreground"
                >
                  <InstagramIcon className="size-3.5" />
                  Instagram
                </a>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="mt-0.5 size-3.5 shrink-0" />
                <span>Furniture Bazaar, Your City</span>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="text-xs text-muted-foreground/70 underline-offset-4 hover:text-foreground hover:underline"
                >
                  Admin login
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/60">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} H R Furniture. All rights reserved.</p>
            <p>Craftsmanship · Comfort · Trust</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
