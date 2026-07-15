
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Package,
  LogOut,
  DollarSign,
  ShoppingBag,
  Bell,
  Plus,
  Trash2,
  Pencil,
  TicketPercent,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { availableCoupons } from "../data/menu";

function getDefaultCoupons() {
  try {
    const stored = localStorage.getItem("quickbite_coupons");
    if (stored) return JSON.parse(stored);
  } catch (e) {
    // ignore
  }
  return availableCoupons.map((c) => ({
    ...c,
    usedCount: 0,
    active: true,
  }));
}

export function AdminPanel({ menuItems, setMenuItems, onExit }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [coupons, setCoupons] = useState(getDefaultCoupons);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);

  useEffect(() => {
    localStorage.setItem("quickbite_coupons", JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const storedOrders = JSON.parse(
      localStorage.getItem("quickbite_orders") || "[]"
    );
    setOrders(storedOrders);

    const storedNotifs = JSON.parse(
      localStorage.getItem("quickbite_notifications") || "[]"
    );
    setNotifications(storedNotifs);
  };

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  const pendingOrders = orders.filter(
    (o) => o.status === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (o) => o.status === "Delivered"
  ).length;

  const revenueData = orders.map((o) => ({
    name: o.id,
    revenue: o.total,
  }));

  const updateOrderStatus = (id, status) => {
    const updated = orders.map((o) =>
      o.id === id ? { ...o, status } : o
    );
    setOrders(updated);
    localStorage.setItem(
      "quickbite_orders",
      JSON.stringify(updated)
    );
  };

  const deleteMenuItem = (id) => {
    const updated = menuItems.filter((i) => i.id !== id);
    setMenuItems(updated);
    localStorage.setItem(
      "quickbite_menu",
      JSON.stringify(updated)
    );
  };

  const saveMenuItem = (item) => {
    let updated;

    if (isAdding) {
      updated = [
        ...menuItems,
        { ...item, id: Date.now().toString() },
      ];
    } else {
      updated = menuItems.map((i) =>
        i.id === item.id ? item : i
      );
    }

    setMenuItems(updated);
    localStorage.setItem(
      "quickbite_menu",
      JSON.stringify(updated)
    );

    setEditingItem(null);
  };

  // ✅ Coupon functions
  const saveCoupon = (coupon) => {
    if (isAddingCoupon) {
      setCoupons((prev) => [...prev, coupon]);
    } else {
      setCoupons((prev) =>
        prev.map((c) =>
          c.code === coupon.code ? coupon : c
        )
      );
    }
    setEditingCoupon(null);
    setIsAddingCoupon(false);
  };

  const deleteCoupon = (code) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
  };

  const toggleCoupon = (code) => {
    setCoupons((prev) =>
      prev.map((c) =>
        c.code === code ? { ...c, active: !c.active } : c
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-stone-950 to-black text-white">

      {/* SIDEBAR */}
      <aside className="hidden md:flex w-72 flex-col bg-black/60 backdrop-blur-xl border-r border-amber-900/30 p-6">
        <h2 className="mb-10 text-2xl font-serif text-amber-300">
          Admin Panel
        </h2>

        <NavButton icon={LayoutDashboard} label="Dashboard" active={activeTab==="dashboard"} onClick={()=>setActiveTab("dashboard")} />
        <NavButton icon={UtensilsCrossed} label="Menu" active={activeTab==="menu"} onClick={()=>setActiveTab("menu")} />
        <NavButton icon={Package} label="Orders" active={activeTab==="orders"} onClick={()=>setActiveTab("orders")} />
        <NavButton icon={TicketPercent} label="Coupons" active={activeTab==="coupons"} onClick={()=>setActiveTab("coupons")} />

        <button onClick={onExit} className="mt-auto flex items-center gap-2 text-red-400 hover:text-red-500 transition">
          <LogOut size={18}/> Exit
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-10 space-y-10">

        {notifications.length > 0 && (
          <div className="flex items-center gap-3 bg-amber-900/30 border border-amber-700/40 p-5 rounded-2xl shadow-lg">
            <Bell className="text-amber-400"/>
            <p>{notifications[0]}</p>
          </div>
        )}

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <h1 className="text-4xl font-serif text-amber-300 mb-6">
              Dashboard Overview
            </h1>

            <div className="grid gap-6 md:grid-cols-4">
              <StatCard label="Total Revenue" value={`₹${totalRevenue}`} icon={DollarSign}/>
              <StatCard label="Total Orders" value={orders.length} icon={ShoppingBag}/>
              <StatCard label="Pending" value={pendingOrders} icon={Package}/>
              <StatCard label="Delivered" value={deliveredOrders} icon={Package}/>
            </div>

            <div className="bg-black/40 backdrop-blur-xl border border-stone-800 p-8 rounded-3xl shadow-xl">
              <h2 className="text-lg font-semibold text-amber-400 mb-4">
                Revenue Chart
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333"/>
                  <XAxis dataKey="name" stroke="#aaa"/>
                  <YAxis stroke="#aaa"/>
                  <Tooltip/>
                  <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fill="#f59e0b33"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* MENU */}
        {activeTab === "menu" && (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-serif text-amber-300">
                Manage Menu
              </h1>

              <button
                onClick={() => {
                  setEditingItem({
                    name: "",
                    description: "",
                    price: 0,
                    rating: 4.5,
                    prepTime: 15,
                    category: "",
                    isVeg: true,
                    image: "",
                  });
                  setIsAdding(true);
                }}
                className="bg-amber-500 px-5 py-2 rounded-xl text-black font-semibold"
              >
                <Plus size={16}/> Add Item
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2 mt-8">
              {menuItems.map((item) => (
                <div key={item.id} className="bg-black/40 backdrop-blur-xl border border-stone-800 p-5 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-amber-300">{item.name}</p>
                    <p className="text-sm text-gray-400">₹{item.price}</p>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={()=>{
                      setEditingItem(item);
                      setIsAdding(false);
                    }} className="text-blue-400">
                      <Pencil size={18}/>
                    </button>

                    <button onClick={()=>deleteMenuItem(item.id)} className="text-red-400">
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <>
            <h1 className="text-3xl font-serif text-amber-300 mb-6">
              Orders
            </h1>

            {orders.length === 0 ? (
              <p className="text-gray-400">No orders yet.</p>
            ) : (
              orders.map((order)=>(
                <div key={order.id} className="bg-black/40 backdrop-blur-xl border border-stone-800 p-6 rounded-3xl mb-6 shadow-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-amber-300 font-semibold">
                        Order #{order.id}
                      </p>
                      <p className="text-sm text-gray-400">
                        {order.time}
                      </p>
                    </div>

                    <select
                      value={order.status}
                      onChange={(e)=>updateOrderStatus(order.id,e.target.value)}
                      className="bg-stone-800 px-4 py-2 rounded-xl border border-stone-700"
                    >
                      <option>Pending</option>
                      <option>Preparing</option>
                      <option>Out for Delivery</option>
                      <option>Delivered</option>
                    </select>
                  </div>

                  <div className="mt-5 text-sm space-y-2 text-gray-300">
                    <p><strong>Name:</strong> {order.customer}</p>
                    <p><strong>Phone:</strong> {order.phone}</p>
                    <p><strong>Address:</strong> {order.address}</p>
                    {order.coupon && (
                      <p><strong>Coupon:</strong> {order.coupon} (-₹{order.discount})</p>
                    )}
                  </div>

                  <div className="mt-5 border-t border-stone-800 pt-4">
                    {order.items.map((item,i)=>(
                      <div key={i} className="flex justify-between text-sm text-gray-400">
                        <span>{item.name} × {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-right text-xl font-bold text-amber-300">
                    ₹{order.total}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* COUPONS */}
        {activeTab === "coupons" && (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-serif text-amber-300">
                Manage Coupons
              </h1>

              <button
                onClick={() => {
                  setEditingCoupon({
                    code: "",
                    description: "",
                    type: "percentage",
                    value: 0,
                    minOrder: 0,
                    firstOrderOnly: false,
                    usageLimit: 100,
                    expiry: "",
                    usedCount: 0,
                    active: true,
                  });
                  setIsAddingCoupon(true);
                }}
                className="bg-amber-500 px-5 py-2 rounded-xl text-black font-semibold"
              >
                <Plus size={16}/> Add Coupon
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2 mt-8">
              {coupons.map((coupon) => {
                const isExpired = new Date() > new Date(coupon.expiry);
                const isLimitReached = coupon.usedCount >= coupon.usageLimit;

                return (
                  <div
                    key={coupon.code}
                    className={`bg-black/40 backdrop-blur-xl border p-6 rounded-2xl shadow-lg ${
                      !coupon.active
                        ? "border-red-800/40 opacity-60"
                        : isExpired
                        ? "border-orange-800/40"
                        : "border-stone-800"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xl font-mono font-bold text-amber-300">
                          {coupon.code}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          {coupon.description}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingCoupon(coupon);
                            setIsAddingCoupon(false);
                          }}
                          className="text-blue-400"
                        >
                          <Pencil size={18}/>
                        </button>

                        <button
                          onClick={() => deleteCoupon(coupon.code)}
                          className="text-red-400"
                        >
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-stone-900/70 p-3 rounded-xl">
                        <p className="text-stone-500 text-xs">Type</p>
                        <p className="text-stone-200">
                          {coupon.type === "percentage"
                            ? `${coupon.value}% off`
                            : `₹${coupon.value} off`}
                        </p>
                      </div>

                      <div className="bg-stone-900/70 p-3 rounded-xl">
                        <p className="text-stone-500 text-xs">Min Order</p>
                        <p className="text-stone-200">₹{coupon.minOrder}</p>
                      </div>

                      <div className="bg-stone-900/70 p-3 rounded-xl">
                        <p className="text-stone-500 text-xs">Used</p>
                        <p className="text-stone-200">
                          {coupon.usedCount} / {coupon.usageLimit}
                          {isLimitReached && (
                            <span className="text-red-400 ml-2">
                              (Limit reached)
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="bg-stone-900/70 p-3 rounded-xl">
                        <p className="text-stone-500 text-xs">Expiry</p>
                        <p className={isExpired ? "text-red-400" : "text-stone-200"}>
                          {coupon.expiry}
                          {isExpired && " (Expired)"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex gap-2">
                        {coupon.firstOrderOnly && (
                          <span className="text-xs bg-amber-900/40 text-amber-300 px-3 py-1 rounded-full">
                            First Order Only
                          </span>
                        )}

                        {isExpired && (
                          <span className="text-xs bg-orange-900/40 text-orange-300 px-3 py-1 rounded-full">
                            Expired
                          </span>
                        )}

                        {isLimitReached && (
                          <span className="text-xs bg-red-900/40 text-red-300 px-3 py-1 rounded-full">
                            Limit Reached
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => toggleCoupon(coupon.code)}
                        className={`text-xs px-4 py-1.5 rounded-full font-semibold ${
                          coupon.active
                            ? "bg-emerald-900/40 text-emerald-300"
                            : "bg-red-900/40 text-red-300"
                        }`}
                      >
                        {coupon.active ? "Active" : "Disabled"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* Menu Form Modal */}
      {editingItem && (
        <MenuFormModal
          item={editingItem}
          isAdding={isAdding}
          onClose={() => setEditingItem(null)}
          onSave={saveMenuItem}
        />
      )}

      {/* Coupon Form Modal */}
      {editingCoupon && (
        <CouponFormModal
          coupon={editingCoupon}
          isAdding={isAddingCoupon}
          onClose={() => setEditingCoupon(null)}
          onSave={saveCoupon}
        />
      )}
    </div>
  );
}

/* ============================================ */
/* ============ UI COMPONENTS ================ */
/* ============================================ */

function NavButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-4 rounded-2xl mb-3 transition ${
        active
          ? "bg-amber-600 text-black shadow-lg"
          : "hover:bg-stone-800"
      }`}
    >
      <Icon size={18}/>
      {label}
    </button>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-black/40 backdrop-blur-xl border border-stone-800 p-6 rounded-3xl shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-3xl font-bold text-amber-300">{value}</p>
        </div>
        <Icon size={30} className="text-amber-400"/>
      </div>
    </div>
  );
}

/* ============================================ */
/* ========== MENU FORM MODAL ================ */
/* ============================================ */

function MenuFormModal({ item, isAdding, onClose, onSave }) {
  const [form, setForm] = useState(item);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm({ ...form, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-stone-900 w-full max-w-lg rounded-3xl p-6 border border-stone-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-serif text-amber-400 mb-6">
          {isAdding ? "Add New Dish" : "Edit Dish"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Dish Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-stone-800 p-3 rounded-xl"
            required
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-stone-800 p-3 rounded-xl"
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="w-full bg-stone-800 p-3 rounded-xl"
            required
          />

          <input
            type="number"
            placeholder="Rating (0-5)"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
            className="w-full bg-stone-800 p-3 rounded-xl"
          />

          <input
            type="number"
            placeholder="Preparation Time (minutes)"
            value={form.prepTime}
            onChange={(e) => setForm({ ...form, prepTime: Number(e.target.value) })}
            className="w-full bg-stone-800 p-3 rounded-xl"
          />

          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full bg-stone-800 p-3 rounded-xl"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isVeg}
              onChange={(e) => setForm({ ...form, isVeg: e.target.checked })}
            />
            Vegetarian
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />

          {form.image && (
            <img src={form.image} alt="" className="h-24 rounded-xl mt-2"/>
          )}

          <div className="flex justify-between pt-4">
            <button type="button" onClick={onClose} className="text-red-400">
              Cancel
            </button>
            <button type="submit" className="bg-amber-500 px-5 py-2 rounded-xl text-black font-semibold">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================ */
/* ========== COUPON FORM MODAL ============== */
/* ============================================ */

function CouponFormModal({ coupon, isAdding, onClose, onSave }) {
  const [form, setForm] = useState(coupon);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-stone-900 w-full max-w-lg rounded-3xl p-6 border border-stone-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-serif text-amber-400 mb-6">
          {isAdding ? "Create Coupon" : "Edit Coupon"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Coupon Code (e.g. WELCOME50)"
            value={form.code}
            onChange={(e) =>
              setForm({ ...form, code: e.target.value.toUpperCase() })
            }
            className="w-full bg-stone-800 p-3 rounded-xl uppercase"
            required
            disabled={!isAdding}
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full bg-stone-800 p-3 rounded-xl"
            required
          />

          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
            className="w-full bg-stone-800 p-3 rounded-xl"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="flat">Flat (₹)</option>
          </select>

          <input
            type="number"
            placeholder={form.type === "percentage" ? "Discount %" : "Discount ₹"}
            value={form.value}
            onChange={(e) =>
              setForm({ ...form, value: Number(e.target.value) })
            }
            className="w-full bg-stone-800 p-3 rounded-xl"
            required
          />

          <input
            type="number"
            placeholder="Minimum Order Amount (₹)"
            value={form.minOrder}
            onChange={(e) =>
              setForm({ ...form, minOrder: Number(e.target.value) })
            }
            className="w-full bg-stone-800 p-3 rounded-xl"
            required
          />

          <input
            type="number"
            placeholder="Usage Limit (e.g. 100)"
            value={form.usageLimit}
            onChange={(e) =>
              setForm({ ...form, usageLimit: Number(e.target.value) })
            }
            className="w-full bg-stone-800 p-3 rounded-xl"
            required
          />

          <input
            type="date"
            placeholder="Expiry Date"
            value={form.expiry}
            onChange={(e) =>
              setForm({ ...form, expiry: e.target.value })
            }
            className="w-full bg-stone-800 p-3 rounded-xl"
            required
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.firstOrderOnly}
              onChange={(e) =>
                setForm({ ...form, firstOrderOnly: e.target.checked })
              }
            />
            First Order Only
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                setForm({ ...form, active: e.target.checked })
              }
            />
            Active
          </label>

          <div className="flex justify-between pt-4">
            <button type="button" onClick={onClose} className="text-red-400">
              Cancel
            </button>
            <button type="submit" className="bg-amber-500 px-5 py-2 rounded-xl text-black font-semibold">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
