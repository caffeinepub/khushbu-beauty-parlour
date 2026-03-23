import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import {
  Award,
  ChevronDown,
  Clock,
  Flower2,
  Heart,
  Loader2,
  MapPin,
  Menu,
  Phone,
  Shield,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AdminLogin from "./AdminLogin";
import { loadContact } from "./AdminPanel";
import { Service } from "./backend.d";
import { useBookAppointment } from "./hooks/useQueries";

// ─── Service Data ──────────────────────────────────────────────────────────────
const services = [
  {
    id: Service.eyeBrow,
    name: "Eye Brow",
    nameHi: "आइब्रो",
    desc: "Perfect shape & threading",
    icon: "✨",
    img: null,
  },
  {
    id: Service.facials,
    name: "Facials",
    nameHi: "फेशियल",
    desc: "Glow & skin rejuvenation",
    icon: "🌸",
    img: "/assets/generated/facial-service.dim_400x300.jpg",
  },
  {
    id: Service.waxing,
    name: "Waxing",
    nameHi: "वैक्सिंग",
    desc: "Smooth skin treatments",
    icon: "💫",
    img: null,
  },
  {
    id: Service.pedicure,
    name: "Pedicure",
    nameHi: "पेडीक्योर",
    desc: "Foot care & nail art",
    icon: "💅",
    img: null,
  },
  {
    id: Service.manicure,
    name: "Manicure",
    nameHi: "मेनीक्योर",
    desc: "Hand care & nail polish",
    icon: "💅",
    img: null,
  },
  {
    id: Service.hairCutting,
    name: "Hair Cutting",
    nameHi: "हेयर कटिंग",
    desc: "Stylish cuts & trims",
    icon: "✂️",
    img: "/assets/generated/hair-service.dim_400x300.jpg",
  },
  {
    id: Service.hairColor,
    name: "Hair Color",
    nameHi: "हेयर कलर",
    desc: "Vibrant color & highlights",
    icon: "🎨",
    img: "/assets/generated/hair-service.dim_400x300.jpg",
  },
  {
    id: Service.hairSpa,
    name: "Hair Spa",
    nameHi: "हेयर स्पा",
    desc: "Deep conditioning therapy",
    icon: "🌿",
    img: null,
  },
  {
    id: Service.partyMakeup,
    name: "Party Makeup",
    nameHi: "पार्टी मेकअप",
    desc: "Glamorous party looks",
    icon: "🌟",
    img: "/assets/generated/party-makeup.dim_400x300.jpg",
  },
  {
    id: Service.bridalMakeup,
    name: "Bridal Makeup",
    nameHi: "ब्राइडल मेकअप",
    desc: "Your perfect bridal look",
    icon: "👑",
    img: "/assets/generated/party-makeup.dim_400x300.jpg",
  },
];

const serviceLabels: Record<Service, string> = {
  [Service.eyeBrow]: "Eye Brow",
  [Service.facials]: "Facials",
  [Service.waxing]: "Waxing",
  [Service.pedicure]: "Pedicure",
  [Service.manicure]: "Manicure",
  [Service.hairCutting]: "Hair Cutting",
  [Service.hairColor]: "Hair Color",
  [Service.hairSpa]: "Hair Spa",
  [Service.partyMakeup]: "Party Makeup",
  [Service.bridalMakeup]: "Bridal Makeup",
};

const testimonials = [
  {
    name: "प्रिया शर्मा",
    text: "खुशबू ब्यूटी पार्लर में ब्राइडल मेकअप करवाया, बहुत अच्छा काम किया। सभी ने तारीफ की!",
    rating: 5,
    service: "Bridal Makeup",
  },
  {
    name: "अंजलि गुप्ता",
    text: "फेशियल और हेयर स्पा दोनों बहुत अच्छे लगे। स्टाफ बहुत विनम्र और प्रोफेशनल है।",
    rating: 5,
    service: "Facial & Hair Spa",
  },
  {
    name: "रोहिणी तिवारी",
    text: "मेंहदी और पार्टी मेकअप दोनों बेहतरीन थे। अगली बार भी यहीं आऊँगी।",
    rating: 5,
    service: "Mehendi & Party Makeup",
  },
];

// ─── Utility: scroll to section ────────────────────────────────────────────────────────
function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ─── Announcement Bar ─────────────────────────────────────────────────────────────────
function AnnouncementBar() {
  return (
    <div className="w-full bg-[oklch(0.22_0.04_30)] text-[oklch(0.93_0.02_65)] text-center py-2 px-4 text-sm font-devanagari tracking-widest">
      <span className="text-gold font-bold">!! श्री गणेशाय नमः !!</span>
      <span className="mx-3 opacity-60">|</span>
      <span>खुशबू ब्यूटी पार्लर में आपका स्वागत है</span>
      <span className="mx-3 opacity-60">|</span>
      <span className="text-gold">केवल महिलाओं के लिये</span>
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────────────
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Home", labelHi: "होम", id: "hero" },
    { label: "Services", labelHi: "सेवाएं", id: "services" },
    { label: "Bridal", labelHi: "ब्राइडल", id: "bridal" },
    { label: "About", labelHi: "परिचय", id: "about" },
    { label: "Contact", labelHi: "संपर्क", id: "footer" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-shadow duration-300 ${
        scrolled ? "shadow-header" : ""
      } bg-[oklch(0.97_0.015_65)]`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-2 group"
          data-ocid="nav.link"
          aria-label="Go to top"
        >
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-sm">
            <Flower2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="font-serif text-base font-bold text-foreground">
              खुशबू ब्यूटी पार्लर
            </div>
            <div className="text-[10px] text-muted-foreground font-devanagari tracking-wider uppercase">
              Ladies Only Salon
            </div>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              data-ocid="nav.link"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => scrollTo("booking")}
            className="hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-5"
            data-ocid="nav.primary_button"
          >
            बुक करें
          </Button>
          <button
            type="button"
            className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[oklch(0.97_0.015_65)] border-t border-border"
          >
            <div className="container px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.id}
                  onClick={() => {
                    scrollTo(link.id);
                    setMenuOpen(false);
                  }}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors text-left py-1"
                  data-ocid="nav.link"
                >
                  {link.label} —{" "}
                  <span className="font-devanagari text-muted-foreground">
                    {link.labelHi}
                  </span>
                </button>
              ))}
              <Button
                onClick={() => {
                  scrollTo("booking");
                  setMenuOpen(false);
                }}
                className="bg-primary text-primary-foreground w-full mt-2"
                data-ocid="nav.primary_button"
              >
                अपॉइंटमेंट बुक करें
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────────────
function Hero() {
  const contact = loadContact();
  return (
    <section
      id="hero"
      className="relative overflow-hidden hero-bg min-h-[90vh] flex items-center"
    >
      {/* Decorative floral overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 50%, oklch(0.78 0.1 68) 0%, transparent 60%)",
        }}
      />

      <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-[oklch(0.93_0.02_65)] order-2 lg:order-1"
        >
          <Badge className="mb-5 bg-[oklch(0.78_0.1_68/0.2)] text-[oklch(0.93_0.02_65)] border border-[oklch(0.78_0.1_68/0.4)] font-devanagari">
            ✨ केवल महिलाओं के लिये
          </Badge>

          <div className="font-devanagari text-lg text-[oklch(0.78_0.1_68)] mb-1 tracking-wide">
            !! श्री गणेशाय नमः !!
          </div>

          <h1 className="font-serif text-4xl lg:text-6xl font-bold leading-tight mb-3">
            <span className="text-gold">खुशबू</span>
            <br />
            <span>ब्यूटी पार्लर</span>
          </h1>

          <p className="font-serif text-xl text-[oklch(0.85_0.04_65)] italic mb-2">
            Khushbu Beauty Parlour
          </p>

          <p className="font-devanagari text-[oklch(0.80_0.03_60)] mb-8 text-base leading-relaxed max-w-md">
            {contact.tagline}
            <br />
            <span className="text-[oklch(0.78_0.1_68)]">प्रो. खुशबू परमार</span>{" "}
            द्वारा संचालित।
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              onClick={() => scrollTo("booking")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base px-8 py-3 shadow-lg"
              data-ocid="hero.primary_button"
            >
              अपॉइंटमेंट बुक करें
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollTo("services")}
              className="border-[oklch(0.78_0.1_68)] text-[oklch(0.93_0.02_65)] hover:bg-[oklch(0.78_0.1_68/0.15)] font-medium"
              data-ocid="hero.secondary_button"
            >
              हमारी सेवाएं देखें
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-[oklch(0.78_0.1_68)]">
              <Phone className="w-4 h-4" />
              {contact.phone1}
            </div>
            <div className="flex items-center gap-2 text-sm text-[oklch(0.78_0.1_68)]">
              <Phone className="w-4 h-4" />
              {contact.phone2}
            </div>
          </div>
        </motion.div>

        {/* Right: Bridal Image */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="order-1 lg:order-2 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[oklch(0.78_0.1_68/0.3)] to-transparent blur-2xl scale-110" />
            <img
              src={
                localStorage.getItem("khushbu_banner_img") ||
                "/assets/generated/bridal-hero.dim_800x600.jpg"
              }
              alt="Bridal beauty - Khushbu Beauty Parlour"
              className="relative rounded-3xl shadow-2xl w-full max-w-sm lg:max-w-md object-cover aspect-[4/5]"
              loading="eager"
            />
            <div className="absolute -bottom-4 -left-4 bg-[oklch(0.97_0.015_65)] rounded-2xl px-4 py-3 shadow-card">
              <p className="font-serif text-sm font-bold text-foreground">
                Bridal Specialist
              </p>
              <p className="text-xs text-muted-foreground font-devanagari">
                ब्राइडल मेकअप एक्सपर्ट
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          className="text-[oklch(0.78_0.1_68)] cursor-pointer"
          onClick={() => scrollTo("services")}
        >
          <ChevronDown className="w-7 h-7" />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Services Grid ────────────────────────────────────────────────────────────────────
function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-primary font-devanagari text-sm tracking-widest uppercase mb-2">
            What We Offer
          </p>
          <h2 className="font-serif text-4xl font-bold text-foreground mb-3">
            Our Services
          </h2>
          <p className="font-devanagari text-2xl text-muted-foreground">
            हमारी सेवाएं
          </p>
          <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
        </motion.div>

        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
          data-ocid="services.list"
        >
          {services.map((svc, i) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => scrollTo("booking")}
              data-ocid={`services.item.${i + 1}`}
            >
              {(() => {
                const customImg = (() => {
                  try {
                    return JSON.parse(
                      localStorage.getItem("khushbu_service_imgs") || "{}",
                    )[svc.id];
                  } catch {
                    return null;
                  }
                })();
                const imgSrc = customImg || svc.img;
                return imgSrc ? (
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={imgSrc}
                      alt={svc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                    <span className="text-4xl">{svc.icon}</span>
                  </div>
                );
              })()}
              <div className="p-3">
                <h3 className="font-serif text-sm font-bold text-foreground">
                  {svc.name}
                </h3>
                <p className="font-devanagari text-xs text-primary mt-0.5">
                  {svc.nameHi}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {svc.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Bridal Section ──────────────────────────────────────────────────────────────────
function BridalSection() {
  const packages = [
    {
      name: "Standard",
      nameHi: "स्टैंडर्ड",
      price: "₹3,500",
      features: ["Bridal Makeup", "Hair Styling", "Eye Brow", "Basic Facial"],
      featured: false,
    },
    {
      name: "Premium",
      nameHi: "प्रीमियम",
      price: "₹6,500",
      features: [
        "HD Bridal Makeup",
        "Hair Color & Style",
        "Full Body Waxing",
        "Advance Facial",
        "Pedicure & Manicure",
      ],
      featured: true,
    },
    {
      name: "Elite",
      nameHi: "एलीट",
      price: "₹12,000",
      features: [
        "Airbrush Bridal Makeup",
        "Mehndi by Specialist",
        "Lehenga & Jewellery Rental",
        "All Premium Services",
        "Pre-Bridal Package",
      ],
      featured: false,
    },
  ];

  return (
    <section id="bridal" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        {localStorage.getItem("khushbu_bridal_img") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 rounded-3xl overflow-hidden shadow-card max-h-80"
          >
            <img
              src={localStorage.getItem("khushbu_bridal_img")!}
              alt="Bridal - Khushbu Beauty Parlour"
              className="w-full h-80 object-cover"
              loading="lazy"
            />
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-primary font-devanagari text-sm tracking-widest uppercase mb-2">
            Wedding Special
          </p>
          <h2 className="font-serif text-4xl font-bold text-foreground mb-3">
            Bridal Packages
          </h2>
          <p className="font-devanagari text-2xl text-muted-foreground">
            ब्राइडल पैकेज
          </p>
          <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={`relative rounded-3xl p-6 shadow-card flex flex-col ${
                pkg.featured
                  ? "bg-[oklch(0.22_0.04_30)] text-[oklch(0.93_0.02_65)] scale-105"
                  : "bg-card text-foreground"
              }`}
              data-ocid={`bridal.item.${i + 1}`}
            >
              {pkg.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1 text-xs font-bold">
                    Most Popular
                  </Badge>
                </div>
              )}
              <div className="mb-4">
                <h3 className="font-serif text-xl font-bold">{pkg.name}</h3>
                <p className="font-devanagari text-sm opacity-70">
                  {pkg.nameHi}
                </p>
                <p
                  className={`font-serif text-3xl font-bold mt-2 ${
                    pkg.featured ? "text-gold" : "text-primary"
                  }`}
                >
                  {pkg.price}
                </p>
              </div>
              <ul className="space-y-2 flex-1 mb-6">
                {pkg.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm">
                    <Sparkles
                      className={`w-3.5 h-3.5 flex-shrink-0 ${
                        pkg.featured ? "text-gold" : "text-primary"
                      }`}
                    />
                    {feat}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => scrollTo("booking")}
                className={`w-full font-bold ${
                  pkg.featured
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "variant-outline border-primary text-primary hover:bg-primary/10"
                }`}
                variant={pkg.featured ? "default" : "outline"}
                data-ocid="bridal.primary_button"
              >
                BOOK NOW
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Mehendi + Wedding Rentals Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden shadow-card min-h-[240px]"
          >
            <img
              src="/assets/generated/mehendi.dim_400x300.jpg"
              alt="Mehendi design"
              className="w-full h-full object-cover absolute inset-0"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.15_0.04_30/0.9)] via-[oklch(0.15_0.04_30/0.4)] to-transparent" />
            <div className="relative z-10 p-6 flex flex-col justify-end h-full">
              <Badge className="mb-2 bg-primary text-primary-foreground w-fit">
                Specialist Artists
              </Badge>
              <h3 className="font-serif text-2xl font-bold text-[oklch(0.93_0.02_65)] mb-1">
                मेंहदी बुकिंग
              </h3>
              <p className="text-sm text-[oklch(0.85_0.03_60)] font-devanagari">
                शादी और पार्टी के लिये विशेषज्ञ मेंहदी आर्टिस्ट उपलब्ध हैं।
              </p>
              <Button
                size="sm"
                className="mt-3 w-fit bg-primary text-primary-foreground"
                onClick={() => scrollTo("booking")}
                data-ocid="bridal.secondary_button"
              >
                बुकिंग करें
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-3xl p-6 shadow-card flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <span className="text-2xl">👗</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                लहंगा व ज्वेलरी
              </h3>
              <p className="font-devanagari text-muted-foreground text-sm leading-relaxed">
                शादी और पार्टी के लिये लहंगा व ज्वेलरी किराये पर उपलब्ध है। सुंदर डिजाइनर
                कलेक्शन से अपनी पसंद चुनें।
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  "Designer Lehenga Collection",
                  "Bridal Jewellery Set",
                  "Affordable Rentals",
                  "Saree & Accessories",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <Heart className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Button
              onClick={() => scrollTo("booking")}
              className="mt-6 w-full bg-primary text-primary-foreground font-bold"
              data-ocid="bridal.primary_button"
            >
              अभी संपर्क करें
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Booking Form ───────────────────────────────────────────────────────────────────
function BookingSection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState<Service | "">("");
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutate, isPending, isSuccess } = useBookAppointment();

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "नाम आवश्यक है";
    if (!phone.trim() || !/^[0-9]{10}$/.test(phone.trim()))
      errs.phone = "10 अंकों का मोबाइल नंबर दर्ज करें";
    if (!service) errs.service = "सेवा चुनें";
    if (!date) errs.date = "तारीख चुनें";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Open WhatsApp with booking details
    const serviceLabel = service ? serviceLabels[service as Service] : "";
    const waMessage = `नई अपॉइंटमेंट बुकिंग 🌸
----------------------------
नाम: ${name.trim()}
मोबाइल: ${phone.trim()}
सेवा: ${serviceLabel}
तारीख: ${date}
----------------------------
खुशबू ब्यूटी पार्लर`;
    const waUrl = `https://wa.me/917693899623?text=${encodeURIComponent(waMessage)}`;
    window.open(waUrl, "_blank");

    mutate(
      {
        customerName: name.trim(),
        phoneNumber: phone.trim(),
        selectedService: service as Service,
        preferredDate: date,
      },
      {
        onSuccess: () => {
          toast.success("अपॉइंटमेंट बुक हो गई! हम जल्द संपर्क करेंगे।");
          setName("");
          setPhone("");
          setService("");
          setDate("");
        },
        onError: () => toast.error("कुछ गलत हुआ। कृपया पुनः प्रयास करें।"),
      },
    );
  }

  return (
    <section id="booking" className="py-20 hero-bg">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-10">
            <p className="text-gold font-devanagari text-sm tracking-widest uppercase mb-2">
              Appointment
            </p>
            <h2 className="font-serif text-4xl font-bold text-[oklch(0.93_0.02_65)] mb-2">
              Book Now
            </h2>
            <p className="font-devanagari text-2xl text-[oklch(0.78_0.1_68)]">
              अपॉइंटमेंट बुक करें
            </p>
            <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
          </div>

          <div
            className="bg-[oklch(0.97_0.015_65)] rounded-3xl p-8 shadow-2xl"
            data-ocid="booking.panel"
          >
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <Label
                  htmlFor="booking-name"
                  className="text-foreground font-medium mb-1.5 block font-devanagari"
                >
                  नाम *
                </Label>
                <Input
                  id="booking-name"
                  placeholder="आपका पूरा नाम"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="font-devanagari"
                  data-ocid="booking.input"
                />
                {errors.name && (
                  <p
                    className="text-destructive text-xs mt-1 font-devanagari"
                    data-ocid="booking.error_state"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="booking-phone"
                  className="text-foreground font-medium mb-1.5 block"
                >
                  Phone Number / मोबाइल नंबर *
                </Label>
                <Input
                  id="booking-phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  data-ocid="booking.input"
                />
                {errors.phone && (
                  <p
                    className="text-destructive text-xs mt-1 font-devanagari"
                    data-ocid="booking.error_state"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-foreground font-medium mb-1.5 block font-devanagari">
                  सेवा चुनें *
                </Label>
                <Select
                  value={service}
                  onValueChange={(v) => setService(v as Service)}
                >
                  <SelectTrigger data-ocid="booking.select">
                    <SelectValue placeholder="सेवा चुनें / Select Service" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Service).map((svc) => (
                      <SelectItem key={svc} value={svc}>
                        {serviceLabels[svc]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.service && (
                  <p
                    className="text-destructive text-xs mt-1 font-devanagari"
                    data-ocid="booking.error_state"
                  >
                    {errors.service}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="booking-date"
                  className="text-foreground font-medium mb-1.5 block font-devanagari"
                >
                  पसंदीदा तारीख *
                </Label>
                <Input
                  id="booking-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  data-ocid="booking.input"
                />
                {errors.date && (
                  <p
                    className="text-destructive text-xs mt-1 font-devanagari"
                    data-ocid="booking.error_state"
                  >
                    {errors.date}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base py-3 h-auto"
                data-ocid="booking.submit_button"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    बुक हो रहा है...
                  </>
                ) : (
                  "BOOK NOW — WhatsApp पर भेजें 💬"
                )}
              </Button>

              {isSuccess && (
                <div
                  className="text-center text-sm text-green-700 font-devanagari bg-green-50 rounded-xl p-3"
                  data-ocid="booking.success_state"
                >
                  ✅ आपकी अपॉइंटमेंट बुक हो गई है। हम जल्द आपसे संपर्क करेंगे!
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Why Choose Us + Testimonials ────────────────────────────────────────────────────────────────
function AboutSection() {
  const reasons = [
    {
      icon: Award,
      title: "Experienced Team",
      titleHi: "अनुभवी टीम",
      desc: "Years of expertise in beauty treatments",
    },
    {
      icon: Sparkles,
      title: "Premium Products",
      titleHi: "प्रीमियम प्रोडक्ट्स",
      desc: "Only high-quality branded products",
    },
    {
      icon: Shield,
      title: "Hygienic Environment",
      titleHi: "स्वच्छ वातावरण",
      desc: "100% hygienic & sanitized salon",
    },
    {
      icon: Users,
      title: "Women Only Safe Space",
      titleHi: "महिलाओं के लिये सुरक्षित",
      desc: "Exclusively for women, always",
    },
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Why Choose Us */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary font-devanagari text-sm tracking-widest uppercase mb-2">
              Why Us
            </p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-2">
              Why Choose Us
            </h2>
            <p className="font-devanagari text-xl text-muted-foreground mb-8">
              हमें क्यों चुनें
            </p>
            <div className="space-y-5">
              {reasons.map((r, i) => (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <r.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-foreground">
                      {r.title}
                    </h3>
                    <p className="font-devanagari text-xs text-primary mb-1">
                      {r.titleHi}
                    </p>
                    <p className="text-sm text-muted-foreground">{r.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary font-devanagari text-sm tracking-widest uppercase mb-2">
              Reviews
            </p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-2">
              Testimonials
            </h2>
            <p className="font-devanagari text-xl text-muted-foreground mb-8">
              ग्राहकों के विचार
            </p>
            <div className="space-y-4" data-ocid="testimonials.list">
              {testimonials.map((t, i) => (
                <div
                  key={t.name}
                  className="bg-card rounded-2xl p-5 shadow-card"
                  data-ocid={`testimonials.item.${i + 1}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-primary font-serif">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground font-devanagari">
                        {t.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.service}
                      </p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {[1, 2, 3, 4, 5].slice(0, t.rating).map((starNum) => (
                        <Star
                          key={starNum}
                          className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground font-devanagari leading-relaxed">
                    "{t.text}"
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────────────────
function Footer() {
  const contact = loadContact();
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer id="footer" className="footer-bg footer-text py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Flower2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <div className="font-serif text-lg font-bold">
                  खुशबू ब्यूटी पार्लर
                </div>
                <div className="text-xs opacity-60 font-devanagari">
                  केवल महिलाओं के लिये
                </div>
              </div>
            </div>
            <p className="font-devanagari text-sm opacity-80 leading-relaxed">
              प्रो. खुशबू परमार द्वारा संचालित, मुरैना की सबसे विश्वसनीय महिला ब्यूटी
              पार्लर।
            </p>
            <p className="font-serif text-sm italic opacity-60 mt-2">
              By Prof. Khushbu Parmar
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4 text-gold">
              संपर्क करें
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <p className="text-sm font-devanagari opacity-80 leading-relaxed">
                  {contact.address}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="text-sm opacity-80">
                  <a
                    href={`tel:${contact.phone1}`}
                    className="block hover:text-gold transition-colors"
                  >
                    📞 {contact.phone1}
                  </a>
                  <a
                    href={`tel:${contact.phone2}`}
                    className="block hover:text-gold transition-colors"
                  >
                    📞 {contact.phone2}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4 text-gold">
              समय-सारणी
            </h3>
            <div
              className="space-y-2 text-sm opacity-80"
              data-ocid="footer.panel"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-devanagari">
                  सोम–शनि: सुबह 9 बजे – शाम 8 बजे
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-devanagari">
                  रविवार: सुबह 10 बजे – शाम 6 बजे
                </span>
              </div>
              <div className="mt-4">
                <Badge className="bg-green-600 text-white text-xs">
                  ✅ अभी खुला है
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs opacity-50 font-devanagari text-center">
            !! श्री गणेशाय नमः !! — © {year} खुशबू ब्यूटी पार्लर। सर्वाधिकार सुरक्षित।
          </p>
          <p className="text-xs opacity-50">
            Built with <Heart className="w-3 h-3 inline text-primary" /> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80 transition-opacity"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── App Root ───────────────────────────────────────────────────────────────────────
export default function App() {
  // Admin panel routing — show admin panel if path starts with /admin
  if (window.location.pathname.startsWith("/admin")) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" />
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Hero />
        <ServicesSection />
        <BridalSection />
        <BookingSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
