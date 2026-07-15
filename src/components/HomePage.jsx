
import {
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  UtensilsCrossed,
  ShoppingBag,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  ClipboardList,
  CheckCircle2,
  X,
  ArrowRight,
  Sparkles,
  ChefHat,
  Bike,
  Star,
  TicketPercent,
  UserRound,
  Mail,
  Quote,
} from "lucide-react";

import { MenuSection } from "./MenuSection";
import { CartDrawer } from "./CartDrawer";
import { CheckoutDialog } from "./CheckoutDialog";
import { UserAuth } from "./UserAuth";
import { AuthContext } from "../AuthContext";
import { availableCoupons } from "../data/menu";

const statusSteps = [
  {
    value: "Pending",
    label: "Order received",
    description: "Your order has reached our kitchen.",
    icon: ClipboardList,
  },
  {
    value: "Preparing",
    label: "Preparing",
    description: "Our chefs are preparing your meal.",
    icon: ChefHat,
  },
  {
    value: "Out for Delivery",
    label: "On the way",
    description: "Your order is out for delivery.",
    icon: Bike,
  },
  {
    value: "Delivered",
    label: "Delivered",
    description: "Your order has been delivered.",
    icon: CheckCircle2,
  },
];


export function HomePage({ menuItems }) {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [myOrdersOpen, setMyOrdersOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [couponNotice, setCouponNotice] = useState("");
const [mobileOpen, setMobileOpen] = useState(false);

  const [coupons, setCoupons] = useState([]);

useEffect(() => {
  const storedCoupons = JSON.parse(
    localStorage.getItem("quickbite_coupons") || "[]"
  );

  setCoupons(storedCoupons);
}, []);


  const loadOrders = useCallback(() => {
    try {
      const storedOrders = JSON.parse(
        localStorage.getItem("quickbite_orders") || "[]"
      );

      setOrders(Array.isArray(storedOrders) ? storedOrders : []);
    } catch (error) {
      console.error("Failed to load orders:", error);
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    loadOrders();

    const interval = setInterval(loadOrders, 2000);
    window.addEventListener("storage", loadOrders);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", loadOrders);
    };
  }, [loadOrders]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  useEffect(() => {
    let noticeTimer;

    if (
      appliedCoupon &&
      subtotal < Number(appliedCoupon.minOrder || 0)
    ) {
      const removedCode = appliedCoupon.code;

      setAppliedCoupon(null);
      setCouponNotice(
        `${removedCode} was removed because the cart value is below ₹${appliedCoupon.minOrder}.`
      );

      noticeTimer = setTimeout(() => {
        setCouponNotice("");
      }, 3500);
    }

    return () => clearTimeout(noticeTimer);
  }, [subtotal, appliedCoupon]);

  const handleAddToCart = useCallback((item) => {
    setCart((previousCart) => {
      const existingItem = previousCart.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        return previousCart.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem
        );
      }

      return [
        ...previousCart,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          emoji: item.emoji,
          image: item.image,
          quantity: 1,
        },
      ];
    });

    setCartOpen(true);
  }, []);

  const handleUpdateQty = useCallback((id, delta) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(0, item.quantity + delta),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const handleRemove = useCallback((id) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== id)
    );
  }, []);

  const handleCheckout = useCallback(() => {
    if (cart.length === 0) return;

    setCartOpen(false);
    setCheckoutOpen(true);
  }, [cart.length]);

  const handleOrderPlaced = useCallback(() => {
    setCheckoutOpen(false);
    setCartOpen(false);
    setCart([]);
    setAppliedCoupon(null);
    setOrderSuccess(true);

    loadOrders();

    setTimeout(() => {
      setOrderSuccess(false);
    }, 4500);
  }, [loadOrders]);

  const openMyOrders = () => {
    loadOrders();
    setMyOrdersOpen(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#090806] text-stone-100">
      {/* Background texture */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #f59e0b 0px, #f59e0b 1px, transparent 1px, transparent 4px)",
        }}
      />

      {/* Coupon removed notification */}
      <AnimatePresence>
        {couponNotice && (
          <motion.div
            initial={{ opacity: 0, y: -30, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed left-1/2 top-24 z-[90] w-[calc(100%-2rem)] max-w-md rounded-2xl border border-orange-700/40 bg-orange-950/95 px-5 py-4 text-sm text-orange-100 shadow-2xl backdrop-blur-xl"
          >
            {couponNotice}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      {/* ================= NAVBAR ================= */}
<nav className="fixed top-0 inset-x-0 z-50 bg-black border-b border-stone-800">
  <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">

    {/* Logo */}
    <a href="#home" className="flex items-center gap-2">
      <UtensilsCrossed className="text-amber-400" />
      <span className="text-amber-300 font-semibold text-lg">
        Quick Bite
      </span>
    </a>

    {/* Desktop Menu */}
    <div className="hidden lg:flex items-center gap-8 text-sm text-stone-300">
      <a href="#home" className="hover:text-amber-400 transition">Home</a>
      <a href="#menu" className="hover:text-amber-400 transition">Menu</a>
      <a href="#offers" className="hover:text-amber-400 transition">Offers</a>
      <a href="#about" className="hover:text-amber-400 transition">About</a>
      <button onClick={openMyOrders} className="hover:text-amber-400 transition">
        My Orders
      </button>
    </div>

    {/* Right Side */}
    <div className="flex items-center gap-4">

      {/* Auth */}
      {user ? (
        <button
          onClick={logout}
          className="hidden sm:block text-sm text-stone-300 hover:text-red-400 transition"
        >
          Sign Out
        </button>
      ) : (
        <button
          onClick={() => setAuthOpen(true)}
          className="hidden sm:block text-sm text-stone-300 hover:text-amber-400 transition"
        >
          Sign In
        </button>
      )}

      {/* Cart */}
      <button
        onClick={() => setCartOpen(true)}
        className="relative"
      >
        <ShoppingBag size={20} />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-amber-500 text-black text-xs px-1 rounded-full">
            {cartCount}
          </span>
        )}
      </button>

      {/* Hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden text-stone-300"
      >
        ☰
      </button>
    </div>
  </div>

  {/* ================= MOBILE MENU ================= */}
  <AnimatePresence>
    {mobileOpen && (
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3 }}
        className="fixed inset-y-0 right-0 w-64 bg-black z-[100] border-l border-stone-800 p-6"
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="mb-6 text-stone-400 hover:text-amber-400"
        >
          ✕ Close
        </button>

        <div className="flex flex-col gap-6 text-stone-300">
          <a href="#home" onClick={() => setMobileOpen(false)}>Home</a>
          <a href="#menu" onClick={() => setMobileOpen(false)}>Menu</a>
          <a href="#offers" onClick={() => setMobileOpen(false)}>Offers</a>
          <a href="#about" onClick={() => setMobileOpen(false)}>About</a>

          <button onClick={() => {
            openMyOrders();
            setMobileOpen(false);
          }}>
            My Orders
          </button>

          {user ? (
            <button onClick={logout} className="text-red-400">
              Sign Out
            </button>
          ) : (
            <button onClick={() => {
              setAuthOpen(true);
              setMobileOpen(false);
            }}>
              Sign In
            </button>
          )}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</nav>

      {/* Hero */}
      <section
        id="home"
        className="relative flex min-h-[94vh] items-center overflow-hidden pt-[76px]"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2000&q=90')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090806] via-transparent to-black/40" />

        <motion.div
          className="absolute -left-32 top-24 h-96 w-96 rounded-full bg-amber-600/10 blur-[120px]"
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-amber-700/30 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.25em] text-amber-300 backdrop-blur-xl"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Crafted fresh, delivered beautifully
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="font-serif text-5xl font-medium leading-[1.05] text-amber-50 sm:text-6xl lg:text-8xl"
            >
              A feast for
              <span className="block bg-gradient-to-r from-amber-200 via-amber-400 to-orange-600 bg-clip-text italic text-transparent">
                every sense.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mt-7 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg"
            >
              Discover thoughtfully prepared dishes, seasonal ingredients,
              bold flavours and warm hospitality—delivered from our kitchen
              to your table.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <a
                href="#menu"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-7 py-4 font-semibold text-stone-950 shadow-2xl shadow-amber-950/50 transition hover:-translate-y-1"
              >
                Explore our menu
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>

              <button
                type="button"
                onClick={openMyOrders}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-black/35 px-7 py-4 font-medium text-white backdrop-blur-xl transition hover:border-amber-500/50 hover:text-amber-200"
              >
                <ClipboardList className="h-4 w-4" />
                Track my order
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-stone-300"
            >
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>
                  <strong className="text-white">4.9</strong> guest rating
                </span>
              </div>

              <div className="hidden h-5 w-px bg-white/20 sm:block" />

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                25–35 minute delivery
              </div>

              <div className="hidden h-5 w-px bg-white/20 sm:block" />

              <div className="flex items-center gap-2">
                <ChefHat className="h-4 w-4 text-amber-400" />
                Made fresh to order
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience cards */}
      <section className="relative z-10 mx-auto -mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-stone-900/90 shadow-2xl shadow-black/50 backdrop-blur-2xl md:grid-cols-3">
          <ExperienceCard
            number="01"
            icon={ChefHat}
            title="Chef-led kitchen"
            text="Every dish is prepared only after you order, using carefully selected ingredients."
          />

          <ExperienceCard
            number="02"
            icon={Bike}
            title="Delivered with care"
            text="Secure packaging and timely delivery preserve the flavour, texture and warmth."
          />

          <ExperienceCard
            number="03"
            icon={Sparkles}
            title="Seasonal creations"
            text="Our menu evolves with inspired specials and ingredients at their best."
          />
        </div>
      </section>

      {/* Menu */}
      <section
        id="menu"
        className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8"
      >
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-amber-500">
              From our kitchen
            </p>

            <h2 className="max-w-3xl font-serif text-4xl text-amber-50 sm:text-5xl lg:text-6xl">
              Signature dishes,
              <span className="italic text-amber-400"> made memorable.</span>
            </h2>
          </div>

          <p className="max-w-md leading-7 text-stone-400">
            From comforting classics to modern favourites, discover food
            created to make every meal feel like an occasion.
          </p>
        </div>

        <MenuSection
          items={menuItems}
          onAddToCart={handleAddToCart}
        />
      </section>

      {/* Offers */}
      <section
  id="offers"
  className="relative overflow-hidden border-y border-amber-900/20 bg-stone-900/50 py-24"
>
  <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-amber-600/10 blur-[110px]" />

  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="mb-12 text-center">
      <p className="mb-3 text-xs uppercase tracking-[0.35em] text-amber-500">
        A little extra
      </p>
      <h2 className="font-serif text-4xl text-amber-50 sm:text-5xl">
        Offers worth savouring
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-stone-400">
        Enter any eligible coupon at checkout and enjoy more of what you love.
      </p>
    </div>

    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {coupons
        .filter((c) => c.active)
        .filter((c) => new Date(c.expiry) > new Date())
        .filter((c) => c.usedCount < c.usageLimit)
        .map((coupon, index) => (
          <motion.article
            key={coupon.code}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -6 }}
            className="relative overflow-hidden rounded-[1.75rem] border border-dashed border-amber-700/35 bg-gradient-to-br from-amber-950/35 to-stone-950 p-6"
          >
            <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-stone-900" />
            <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-stone-900" />

            <div className="mb-8 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
                <TicketPercent className="h-5 w-5" />
              </div>

              <span className="text-[10px] uppercase tracking-widest text-stone-500">
                {coupon.firstOrderOnly
                  ? "First order only"
                  : "Limited offer"}
              </span>
            </div>

            <p className="font-mono text-lg font-bold tracking-wider text-amber-300">
              {coupon.code}
            </p>

            <p className="mt-3 min-h-12 text-sm leading-6 text-stone-400">
              {coupon.description}
            </p>

            <div className="mt-5 border-t border-stone-800 pt-4 text-xs text-stone-500 space-y-1">
              <div>Minimum order ₹{coupon.minOrder}</div>
              <div>
                Used {coupon.usedCount} / {coupon.usageLimit}
              </div>
              <div>Valid till {coupon.expiry}</div>
            </div>
          </motion.article>
        ))}
    </div>

    {coupons.length === 0 && (
      <div className="text-center text-gray-400 mt-10">
        No active offers available right now.
      </div>
    )}
  </div>
</section>

      {/* About */}
      <section
        id="about"
        className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8"
      >
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="overflow-hidden rounded-[2.5rem] border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=90"
                alt="The elegant interior of Quick Bite restaurant"
                className="h-[520px] w-full object-cover"
              />
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-6 -right-2 max-w-xs rounded-[1.75rem] border border-amber-700/25 bg-stone-950/95 p-6 shadow-2xl backdrop-blur-xl sm:right-6">
              <Quote className="mb-3 h-6 w-6 text-amber-500" />
              <p className="font-serif text-lg italic leading-7 text-amber-50">
                “Food should feel generous, personal and unforgettable.”
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-amber-500">
              The Quick Bite story
            </p>

            <h2 className="font-serif text-4xl leading-tight text-amber-50 sm:text-5xl">
              Contemporary dining,
              <span className="block italic text-amber-400">
                rooted in warmth.
              </span>
            </h2>

            <p className="mt-7 leading-8 text-stone-400">
              Quick Bite brings together bold flavours, thoughtful
              preparation and genuine hospitality. Our kitchen transforms
              familiar favourites into memorable dishes without losing the
              comfort that makes them special.
            </p>

            <p className="mt-5 leading-8 text-stone-400">
              Whether you are planning a quiet dinner or ordering for the
              entire family, every meal receives the same care—from the
              first ingredient to the final delivery.
            </p>

            <div className="mt-9 grid grid-cols-2 gap-4">
              <AboutStat value="100%" label="Made fresh" />
              <AboutStat value="4.9/5" label="Guest rating" />
              <AboutStat value="30 min" label="Average delivery" />
              <AboutStat value="7 days" label="Open every week" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact strip */}
      <section className="border-y border-white/5 bg-gradient-to-r from-amber-950/25 via-stone-900 to-amber-950/25">
        <div className="mx-auto grid max-w-7xl gap-7 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
          <ContactItem
            icon={Clock}
            label="Opening hours"
            value="Daily, 11:00 AM – 11:00 PM"
          />
          <ContactItem
            icon={MapPin}
            label="Visit us"
            value="12 Downtown Street, New Delhi"
          />
          <ContactItem
            icon={Phone}
            label="Call us"
            value="+91 98765 43210"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500">
                <UtensilsCrossed className="h-5 w-5 text-stone-950" />
              </div>
              <span className="font-serif text-xl text-amber-100">
                Quick Bite
              </span>
            </div>

            <p className="mt-5 max-w-md leading-7 text-stone-500">
              Freshly prepared food, modern flavours and warm hospitality
              delivered to your doorstep.
            </p>
          </div>

          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-amber-300">
              Explore
            </p>
            <div className="space-y-3 text-sm text-stone-500">
              <a className="block hover:text-amber-300" href="#menu">
                Menu
              </a>
              <a className="block hover:text-amber-300" href="#offers">
                Offers
              </a>
              <a className="block hover:text-amber-300" href="#about">
                Our Story
              </a>
              <button
                type="button"
                onClick={openMyOrders}
                className="block hover:text-amber-300"
              >
                My Orders
              </button>
            </div>
          </div>

          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-amber-300">
              Contact
            </p>
            <div className="space-y-3 text-sm text-stone-500">
              <p>+91 98765 43210</p>
              <p>hello@quickbite.in</p>
              <p>New Delhi, India</p>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-900 px-4 py-6 text-center text-xs text-stone-600">
          © {new Date().getFullYear()} Quick Bite. Crafted with care.
        </div>
      </footer>

      {/* My Orders modal */}
      <AnimatePresence>
        {myOrdersOpen && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMyOrdersOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              onClick={(event) => event.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-amber-800/25 bg-gradient-to-br from-stone-900 to-stone-950 p-5 shadow-2xl sm:p-8"
            >
              <button
                type="button"
                onClick={() => setMyOrdersOpen(false)}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-stone-800 text-stone-400 transition hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-7 pr-12">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-500">
                  Live order tracking
                </p>
                <h2 className="mt-2 font-serif text-3xl text-amber-50">
                  My Orders
                </h2>
                <p className="mt-2 text-sm text-stone-500">
                  Status automatically refreshes when the restaurant updates
                  your order.
                </p>
              </div>

              {orders.length === 0 ? (
                <div className="flex flex-col items-center rounded-3xl border border-dashed border-stone-700 px-6 py-14 text-center">
                  <ClipboardList className="h-12 w-12 text-stone-700" />
                  <p className="mt-4 font-serif text-xl text-stone-300">
                    No orders yet
                  </p>
                  <p className="mt-2 text-sm text-stone-500">
                    Your placed orders and their live status will appear
                    here.
                  </p>
                  <button
                    type="button"
                    onClick={() => setMyOrdersOpen(false)}
                    className="mt-6 rounded-full bg-amber-500 px-5 py-2.5 font-semibold text-stone-950"
                  >
                    Explore menu
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {orders.map((order) => (
                    <article
                      key={order.id}
                      className="rounded-3xl border border-stone-800 bg-black/25 p-5 sm:p-6"
                    >
                      <div className="flex flex-col gap-3 border-b border-stone-800 pb-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-mono text-sm font-bold text-amber-300">
                            #{order.id}
                          </p>
                          <p className="mt-1 text-xs text-stone-500">
                            {order.time || "Recently placed"}
                          </p>
                        </div>

                        <div className="sm:text-right">
                          <StatusBadge status={order.status} />
                          <p className="mt-2 font-serif text-xl font-bold text-amber-100">
                            ₹{order.total}
                          </p>
                        </div>
                      </div>

                      <OrderTimeline status={order.status} />

                      {Array.isArray(order.items) &&
                        order.items.length > 0 && (
                          <div className="mt-5 rounded-2xl bg-stone-900/70 p-4">
                            <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-stone-500">
                              Order items
                            </p>

                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div
                                  key={`${order.id}-${index}`}
                                  className="flex items-center justify-between gap-4 text-sm"
                                >
                                  <span className="text-stone-300">
                                    {item.name} × {item.quantity}
                                  </span>
                                  <span className="text-stone-500">
                                    ₹{item.price * item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {order.address && (
                        <div className="mt-4 flex items-start gap-3 text-sm text-stone-500">
                          <MapPin className="mt-0.5 h-4 w-4 flex-none text-amber-600" />
                          <span>{order.address}</span>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
        onCheckout={handleCheckout}
        appliedCoupon={appliedCoupon}
        setAppliedCoupon={setAppliedCoupon}
      />

      {/* Checkout */}
      <CheckoutDialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cart}
        appliedCoupon={appliedCoupon}
        onPlaceOrder={handleOrderPlaced}
      />

      {/* User authentication */}
      <UserAuth
        open={authOpen}
        onClose={() => setAuthOpen(false)}
      />

      {/* Order success */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md rounded-[2rem] border border-amber-800/30 bg-gradient-to-br from-stone-900 to-stone-950 p-8 text-center shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.15 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-emerald-700/30 bg-emerald-950/30"
              >
                <CheckCircle2 className="h-11 w-11 text-emerald-400" />
              </motion.div>

              <p className="mt-6 text-xs uppercase tracking-[0.3em] text-amber-500">
                Order confirmed
              </p>
              <h3 className="mt-2 font-serif text-3xl text-amber-50">
                Your meal is on its way.
              </h3>
              <p className="mt-3 leading-7 text-stone-400">
                The kitchen has received your order. Track its progress
                anytime from My Orders.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderSuccess(false)}
                  className="rounded-full border border-stone-700 px-4 py-3 text-sm text-stone-300 transition hover:border-amber-700/50"
                >
                  Continue
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOrderSuccess(false);
                    openMyOrders();
                  }}
                  className="rounded-full bg-amber-500 px-4 py-3 text-sm font-semibold text-stone-950"
                >
                  Track order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExperienceCard({ number, icon: Icon, title, text }) {
  return (
    <motion.article
      whileHover={{ backgroundColor: "rgba(120, 53, 15, 0.12)" }}
      className="relative border-b border-white/10 p-7 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 lg:p-9"
    >
      <span className="absolute right-7 top-6 font-serif text-5xl text-white/[0.035]">
        {number}
      </span>

      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-700/25 bg-amber-950/25">
        <Icon className="h-5 w-5 text-amber-400" />
      </div>

      <h3 className="font-serif text-xl text-amber-50">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-stone-500">{text}</p>
    </motion.article>
  );
}

function AboutStat({ value, label }) {
  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-5">
      <p className="font-serif text-2xl text-amber-300">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wider text-stone-500">
        {label}
      </p>
    </div>
  );
}

function ContactItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl border border-amber-700/25 bg-amber-950/30">
        <Icon className="h-5 w-5 text-amber-400" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-stone-500">
          {label}
        </p>
        <p className="mt-1 text-sm text-stone-200">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const statusClasses = {
    Pending: "border-orange-700/30 bg-orange-950/40 text-orange-300",
    Preparing: "border-amber-700/30 bg-amber-950/40 text-amber-300",
    "Out for Delivery":
      "border-sky-700/30 bg-sky-950/40 text-sky-300",
    Delivered:
      "border-emerald-700/30 bg-emerald-950/40 text-emerald-300",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
        statusClasses[status] ||
        "border-stone-700 bg-stone-800 text-stone-300"
      }`}
    >
      {status || "Pending"}
    </span>
  );
}

function OrderTimeline({ status }) {
  const currentIndex = Math.max(
    0,
    statusSteps.findIndex((step) => step.value === status)
  );

  return (
    <div className="mt-6 space-y-0">
      {statusSteps.map((step, index) => {
        const StepIcon = step.icon;
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isActive = index <= currentIndex;

        return (
          <div key={step.value} className="relative flex gap-4">
            {index < statusSteps.length - 1 && (
              <div
                className={`absolute left-[17px] top-9 h-[calc(100%-4px)] w-px ${
                  index < currentIndex
                    ? "bg-emerald-500"
                    : "bg-stone-700"
                }`}
              />
            )}

            <div
              className={`relative z-10 flex h-9 w-9 flex-none items-center justify-center rounded-full border ${
                isCompleted
                  ? "border-emerald-500 bg-emerald-500 text-stone-950"
                  : isCurrent
                  ? "border-amber-400 bg-amber-500 text-stone-950 shadow-lg shadow-amber-900/40"
                  : "border-stone-700 bg-stone-900 text-stone-600"
              }`}
            >
              <StepIcon className="h-4 w-4" />
            </div>

            <div className="min-h-16 pb-4">
              <p
                className={`text-sm font-medium ${
                  isActive ? "text-stone-100" : "text-stone-600"
                }`}
              >
                {step.label}
              </p>
              <p
                className={`mt-1 text-xs ${
                  isActive ? "text-stone-500" : "text-stone-700"
                }`}
              >
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

