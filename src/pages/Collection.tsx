import { InstagramIcon, WhatsAppIcon } from "@/components/BrandIcons";
import { BrandLogo } from "@/components/BrandLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CATEGORIES,
  formatPrice,
  type CatalogCategory,
} from "@/lib/catalog";
import {
  ADDRESS,
  INSTAGRAM_URL,
  MAP_SRC,
  PHONE_PRIMARY,
  PHONE_PRIMARY_TEL,
  PHONE_SECONDARY,
  PHONE_SECONDARY_TEL,
  WHATSAPP_URL,
  waLink,
} from "@/lib/contact";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
} as const;

function CollectionGrid({ category }: { category: CatalogCategory }) {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {category.items.map((item, index) => (
        <motion.figure
          key={item.img}
          {...fadeUp}
          transition={{ duration: 0.45, delay: (index % 6) * 0.04 }}
          className="group overflow-hidden rounded-2xl border border-border/70 bg-card"
        >
          <div className="overflow-hidden">
            <img
              src={item.img}
              alt={item.title}
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <figcaption className="flex items-center justify-between gap-3 p-4">
            <p className="text-sm font-medium leading-snug">{item.title}</p>
            <Button asChild size="icon" variant="outline" className="size-8 shrink-0">
              <a
                href={waLink(
                  `Hi H R Furniture, I'm interested in this ${category.name.replace(/s$/, "").toLowerCase()} (photo: ${item.title}). Please share the best price.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ask price on WhatsApp for ${item.title}`}
              >
                <MessageCircle className="size-4" />
              </a>
            </Button>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}

export default function Collection() {
  const { slug } = useParams();
  const category = CATEGORIES.find((c) => c.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!category) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
        <Badge variant="outline" className="border-border/70">
          404
        </Badge>            <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight">
              Collection not found
            </h1>
        <p className="mt-2 text-muted-foreground">
          The collection you're looking for doesn't exist — browse the full
          range on our home page.
        </p>
        <Button asChild className="mt-6 gap-2">
          <Link to="/">
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
        </Button>
      </div>
    );
  }

  const index = CATEGORIES.findIndex((c) => c.slug === slug);
  const prev = CATEGORIES[(index - 1 + CATEGORIES.length) % CATEGORIES.length];
  const next = CATEGORIES[(index + 1) % CATEGORIES.length];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <BrandLogo />
            <span className="flex min-w-0 flex-col leading-none">
              <span className="truncate text-sm font-semibold tracking-tight sm:text-base">
                H R FURNITURE
              </span>
              <span className="mt-0.5 hidden truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:block">
                Sofas · Beds · Dining · Wardrobes
              </span>
            </span>
          </Link>
          <Button asChild size="sm" variant="outline" className="gap-1.5">
            <Link to="/">
              <ArrowLeft className="size-4" />
              All collections
            </Link>
          </Button>
        </div>
      </header>

      {/* Category hero — bright catalogue style */}
      <section className="border-b border-border/60 bg-secondary/60">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <Badge variant="outline" className="border-accent/40 bg-background/70">
              Collection
            </Badge>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              {category.name}
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              {category.blurb}
            </p>
            <p className="mt-4 text-sm font-medium uppercase tracking-[0.16em] text-accent">
              Starting at {formatPrice(category.from)}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <a href={waLink(`Hi H R Furniture, I'm interested in your ${category.name.toLowerCase()} collection. Please share today's best price.`)} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="size-4" />
                  Ask price on WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/#contact">Get best price</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Curated photos */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 lg:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="outline" className="border-border/70">
              In stock &amp; on display
            </Badge>
            <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              {category.name} at our showroom
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
              A hand-picked look at what's on the floor. Tap the chat button on
              any piece for an instant price on WhatsApp — most designs are
              ready to deliver.
            </p>
          </div>
        </div>
        <CollectionGrid category={category} />
      </section>

      {/* Other collections */}
      <section className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-14">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">
              Browse other collections
            </h2>
            <div className="hidden gap-2 sm:flex">
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <Link to={`/collections/${prev.slug}`}>
                  <ArrowLeft className="size-3.5" />
                  {prev.name}
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <Link to={`/collections/${next.slug}`}>
                  {next.name}
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
              <motion.div key={c.slug} {...fadeUp}>
                <Link
                  to={`/collections/${c.slug}`}
                  className="group relative block overflow-hidden rounded-2xl border border-border/70"
                >
                  <img
                    src={c.tileImg}
                    alt={c.alt}
                    className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-accent">
                        From {formatPrice(c.from)}
                      </p>
                      <h3 className="text-lg font-semibold tracking-tight">
                        {c.name}
                      </h3>
                    </div>
                    <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / visit */}
      <section id="location" className="border-t border-border/60">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-14 lg:grid-cols-2">
          <div>
            <Badge variant="outline" className="border-border/70">
              Visit us
            </Badge>
            <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              See it in person
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Photos don't do foam and fabric justice. Visit the showroom, sit
              on everything and take your time.
            </p>
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
                  <Phone className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-medium">Call us</p>
                  <a
                    href={`tel:${PHONE_PRIMARY_TEL}`}
                    className="mt-0.5 block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {PHONE_PRIMARY}
                  </a>
                  <a
                    href={`tel:${PHONE_SECONDARY_TEL}`}
                    className="mt-0.5 block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {PHONE_SECONDARY}
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
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border/70">
            <iframe
              title={`Map — ${ADDRESS}`}
              src={MAP_SRC}
              className="h-full min-h-[320px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-5 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} H R Furniture · Premium Sofas and Premium Chairs</p>
          <p>Mon–Sun, 10am – 9pm · {PHONE_PRIMARY}</p>
        </div>
      </footer>
    </div>
  );
}
