import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
} from "lucide-react";
import { availableCoupons } from "../data/menu";

export function CartDrawer({
  open,
  onClose,
  items,
  onUpdateQty,
  onRemove,
  onCheckout,
  appliedCoupon,
  setAppliedCoupon,
}) {
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  const subtotal = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const deliveryCharge = subtotal > 0 ? 40 : 0;
  const gst = Math.round(subtotal * 0.05);

  let discount = 0;

  if (appliedCoupon) {
    if (appliedCoupon.type === "percentage") {
      discount = Math.round(
        (subtotal * appliedCoupon.value) / 100
      );
    } else {
      discount = appliedCoupon.value;
    }
  }

  const total = Math.max(
    0,
    subtotal + deliveryCharge + gst - discount
  );

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    const coupon = availableCoupons.find(
      (c) => c.code === code
    );

    if (!coupon) {
      setCouponError("Invalid coupon code.");
      return;
    }

    if (subtotal < coupon.minOrder) {
      setCouponError(
        `Minimum order ₹${coupon.minOrder} required.`
      );
      return;
    }

    setCouponError("");
    setAppliedCoupon(coupon);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-stone-900 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-800 p-6">
              <h2 className="font-bold text-amber-400">
                Your Cart
              </h2>
              <button onClick={onClose}>
                <X />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between bg-stone-800 p-4 rounded-lg mb-3"
                >
                  <div>
                    <p className="font-bold text-amber-300">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      ₹{item.price} × {item.quantity}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          onUpdateQty(item.id, -1)
                        }
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          onUpdateQty(item.id, 1)
                        }
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemove(item.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-stone-800 p-6">
                {/* Coupon */}
                <div className="mb-4">
                  {appliedCoupon ? (
                    <div className="flex justify-between bg-green-900/40 p-3 rounded-lg">
                      <span className="text-green-400">
                        {appliedCoupon.code} Applied
                      </span>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-red-400 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value)
                        }
                        placeholder="Coupon Code"
                        className="flex-1 p-2 rounded bg-stone-800"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="bg-amber-500 px-3 rounded text-black"
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {couponError && (
                    <p className="text-red-400 text-xs mt-1">
                      {couponError}
                    </p>
                  )}
                </div>

                {/* Bill */}
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>₹{deliveryCharge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST</span>
                    <span>₹{gst}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold text-amber-400 mt-2">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <button
                  onClick={onCheckout}
                  className="mt-4 w-full bg-amber-500 py-3 rounded text-black font-bold"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}