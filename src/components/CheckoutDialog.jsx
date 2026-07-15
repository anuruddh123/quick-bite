import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CreditCard,
  Wallet,
  Banknote,
  CheckCircle2,
} from "lucide-react";
import { AuthContext } from "../AuthContext";

export function CheckoutDialog({
  open,
  onClose,
  items,
  onPlaceOrder,
  appliedCoupon,
}) {
  const { user } = useContext(AuthContext);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user, open]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    setCouponError("");

    // ✅ Prevent coupon reuse per user
    if (appliedCoupon && user) {
      const usedCoupons =
        JSON.parse(localStorage.getItem("quickbite_usedCoupons") || "{}");

      const userKey = user.phone || user.name;

      if (
        usedCoupons[userKey] &&
        usedCoupons[userKey].includes(appliedCoupon.code)
      ) {
        setCouponError("You have already used this coupon.");
        return;
      }
    }

    const orderId = `QB${Math.floor(
      Math.random() * 90000 + 10000
    )}`;

    const newOrder = {
      id: orderId,
      customer: name,
      phone: phone,
      address: address,
      items: items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
      })),
      subtotal,
      deliveryCharge,
      gst,
      discount,
      coupon: appliedCoupon ? appliedCoupon.code : null,
      total,
      paymentMethod,
      status: "Pending",
      time: new Date().toLocaleString(),
      createdBy: user
        ? { name: user.name, phone: user.phone }
        : null,
    };

    try {
      const existingOrders = JSON.parse(
        localStorage.getItem("quickbite_orders") || "[]"
      );

      existingOrders.unshift(newOrder);

      localStorage.setItem(
        "quickbite_orders",
        JSON.stringify(existingOrders)
      );

      // ✅ Mark coupon as used
      if (appliedCoupon && user) {
        const usedCoupons =
          JSON.parse(localStorage.getItem("quickbite_usedCoupons") || "{}");

        const userKey = user.phone || user.name;

        if (!usedCoupons[userKey]) {
          usedCoupons[userKey] = [];
        }

        usedCoupons[userKey].push(appliedCoupon.code);

        localStorage.setItem(
          "quickbite_usedCoupons",
          JSON.stringify(usedCoupons)
        );
      }

    } catch (err) {
      console.error("Failed to save order");
    }

    onPlaceOrder();
  };

  const paymentOptions = [
    { id: "cod", label: "Cash on Delivery", icon: Banknote },
    { id: "upi", label: "UPI Payment", icon: Wallet },
    { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-lg rounded-2xl bg-stone-900 p-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4"
            >
              <X />
            </button>

            <h2 className="text-xl font-bold text-amber-400">
              Checkout
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">

              {/* Delivery Info */}
              <div className="space-y-3">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full p-3 rounded bg-stone-800"
                />

                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full p-3 rounded bg-stone-800"
                />

                <textarea
                  required
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  placeholder="Full Address"
                  rows={3}
                  className="w-full p-3 rounded bg-stone-800"
                />
              </div>

              {/* Payment */}
              <div className="space-y-2">
                {paymentOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setPaymentMethod(option.id)
                    }
                    className={`flex items-center justify-between w-full p-3 rounded ${
                      paymentMethod === option.id
                        ? "bg-amber-600 text-black"
                        : "bg-stone-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <option.icon size={18} />
                      {option.label}
                    </div>
                    {paymentMethod === option.id && (
                      <CheckCircle2 size={18} />
                    )}
                  </button>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-stone-800 p-4 rounded">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm mb-1"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}

                <div className="border-t border-stone-700 mt-2 pt-2 text-sm space-y-1">
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
              </div>

              {couponError && (
                <p className="text-red-400 text-sm">
                  {couponError}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-amber-500 py-3 rounded text-black font-bold"
              >
                Place Order • ₹{total}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}