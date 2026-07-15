import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Star,
  Flame,
  Leaf,
  Clock,
  UtensilsCrossed,
  ArrowUpRight,
} from "lucide-react";

export function MenuSection({ items = [], onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        items
          .map((item) => item.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [items]);

  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory("All");
    }
  }, [categories, activeCategory]);

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter(
          (item) => item.category === activeCategory
        );

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-stone-700 bg-stone-900/30 px-6 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-amber-800/20 bg-amber-950/20">
          <UtensilsCrossed className="h-9 w-9 text-stone-600" />
        </div>

        <h3 className="mt-6 font-serif text-2xl text-stone-300">
          Our kitchen is preparing something special
        </h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-stone-500">
          New dishes will appear here as soon as they are added by the
          restaurant.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Categories */}
      <div className="mb-12 flex gap-2 overflow-x-auto pb-3 sm:flex-wrap sm:justify-center sm:overflow-visible">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`flex-none rounded-full border px-5 py-2.5 text-sm transition ${
              activeCategory === category
                ? "border-amber-500 bg-amber-500 font-semibold text-stone-950 shadow-lg shadow-amber-950/40"
                : "border-stone-800 bg-stone-900/70 text-stone-400 hover:border-amber-800/50 hover:text-amber-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Tall portrait cards */}
      <motion.div
        layout
        className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.article
              key={item.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{
                duration: 0.4,
                delay: Math.min(index * 0.05, 0.25),
              }}
              whileHover={{ y: -9 }}
              className="group relative overflow-hidden rounded-[2rem] border border-stone-800/80 bg-gradient-to-b from-stone-900 to-stone-950 shadow-[0_24px_70px_rgba(0,0,0,0.35)] transition-colors hover:border-amber-700/35"
            >
              {/* Complete image container */}
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-900">
                {item.image ? (
                  <>
                    {/* Blurred background fills unused space */}
                    <img
                      src={item.image}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-2xl"
                    />

                    <div className="absolute inset-0 bg-black/15" />

                    {/* Actual image remains completely visible */}
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="relative z-[1] h-full w-full object-contain p-1 transition-transform duration-700 group-hover:scale-[1.035]"
                    />
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-950">
                    <motion.span
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      className="text-8xl drop-shadow-2xl"
                    >
                      {item.emoji || "🍽️"}
                    </motion.span>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-t from-stone-950 via-stone-950/45 to-transparent" />

                {/* Category */}
                <div className="absolute left-4 top-4 z-[3] rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-amber-200 backdrop-blur-xl">
                  {item.category || "Chef Special"}
                </div>

                {/* Veg / non-veg */}
                <div
                  className={`absolute right-4 top-4 z-[3] flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs backdrop-blur-xl ${
                    item.isVeg
                      ? "border-emerald-700/30 bg-emerald-950/70 text-emerald-300"
                      : "border-red-700/30 bg-red-950/70 text-red-300"
                  }`}
                >
                  {item.isVeg ? (
                    <Leaf className="h-3.5 w-3.5" />
                  ) : (
                    <Flame className="h-3.5 w-3.5" />
                  )}
                  {item.isVeg ? "Vegetarian" : "Non-Veg"}
                </div>

                <div className="absolute bottom-5 left-5 right-5 z-[3] flex items-end justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 rounded-full border border-amber-600/25 bg-black/70 px-2.5 py-1 text-xs text-amber-300 backdrop-blur-xl">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {item.rating || 4.5}
                    </span>

                    <span className="flex items-center gap-1 rounded-full border border-white/10 bg-black/70 px-2.5 py-1 text-xs text-stone-300 backdrop-blur-xl">
                      <Clock className="h-3.5 w-3.5 text-amber-400" />
                      {item.prepTime || 15} min
                    </span>
                  </div>
                </div>
              </div>

              {/* Card details */}
              <div className="relative p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-2xl leading-tight text-amber-50">
                      {item.name}
                    </h3>
                    <p className="mt-3 min-h-12 text-sm leading-6 text-stone-500">
                      {item.description ||
                        "Thoughtfully prepared with fresh ingredients and balanced flavours."}
                    </p>
                  </div>

                  <ArrowUpRight className="mt-1 h-5 w-5 flex-none text-stone-700 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-amber-400" />
                </div>

                <div className="my-6 h-px bg-gradient-to-r from-transparent via-stone-800 to-transparent" />

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-stone-600">
                      Price
                    </p>
                    <p className="mt-1 font-serif text-2xl font-bold text-amber-300">
                      ₹{item.price}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddToCart(item)}
                    className="group/button inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 shadow-lg shadow-amber-950/40 transition hover:-translate-y-1 hover:from-amber-300 hover:to-amber-500 active:translate-y-0"
                  >
                    <Plus className="h-4 w-4 transition group-hover/button:rotate-90" />
                    Add to cart
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
