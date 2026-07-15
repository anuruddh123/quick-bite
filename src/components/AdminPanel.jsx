


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
  Menu,
  X,
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
    if (stored) {
      return JSON.parse(stored);
    }
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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
    try {
      const storedOrders = JSON.parse(
        localStorage.getItem("quickbite_orders") || "[]"
      );
      setOrders(storedOrders);
    } catch (e) {
      setOrders([]);
    }

    try {
      const storedNotifs = JSON.parse(
        localStorage.getItem("quickbite_notifications") || "[]"
      );
      setNotifications(storedNotifs);
    } catch (e) {
      setNotifications([]);
    }
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
    setIsAdding(false);
  };

  const saveCoupon = (coupon) => {
    if (isAddingCoupon) {
      setCoupons((prev) => [...prev, coupon]);
    } else {
      setCoupons((prev) =>
        prev.map((c) => (c.code === coupon.code ? coupon : c))
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

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "menu",
      label: "Menu",
      icon: UtensilsCrossed,
    },
    {
      id: "orders",
      label: "Orders",
      icon: Package,
    },
    {
      id: "coupons",
      label: "Coupons",
      icon: TicketPercent,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-stone-950 to-black text-white">
      
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 transform bg-black/60 backdrop-blur-xl border-r border-amber-900/30 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-6">

          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-serif text-amber-300">
              Admin Panel
            </h2>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden rounded-lg p-2 text-stone-400 hover:bg-stone-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl p-3 text-sm transition-all ${
                  activeTab === item.id
                    ? "bg-amber-600 text-black font-medium shadow-lg shadow-amber-900/30"
                    : "text-stone-300 hover:bg-stone-800/70 hover:text-amber-200"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={onExit}
            className="mt-4 flex w-full items-center gap-3 rounded-xl p-3 text-sm text-red-400 transition-all hover:bg-red-950/30 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            Exit
          </button>
        </div>
      </aside>

      <main className="flex-1 w-full overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-10">

          <div className="mb-4 flex items-center justify-between md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-stone-800 bg-black/40 p-2 text-stone-300"
            >
              <Menu className="h-5 w-5" />
            </button>

            <h1 className="text-lg font-serif text-amber-300 capitalize">
              {activeTab}
            </h1>

            <div className="w-9" />
          </div>

          {notifications.length > 0 && (
            <div className="mb-6 rounded-2xl border border-amber-700/40 bg-amber-900/30 p-4 flex items-start gap-3">
              <Bell className="h-5 w-5 flex-shrink-0 text-amber-400 mt-0.5" />
              <div className="text-sm text-amber-100">
                {notifications[0]}
              </div>
            </div>
          )}

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="hidden md:block">
                <h1 className="text-3xl lg:text-4xl font-serif text-amber-300">
                  Dashboard Overview
                </h1>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  label="Total Revenue"
                  value={`₹${totalRevenue}`}
                  icon={DollarSign}
                />
                <StatCard
                  label="Total Orders"
                  value={orders.length}
                  icon={ShoppingBag}
                />
                <StatCard
                  label="Pending"
                  value={pendingOrders}
                  icon={Package}
                />
                <StatCard
                  label="Delivered"
                  value={deliveredOrders}
                  icon={Package}
                />
              </div>

              <div className="rounded-3xl border border-stone-800 bg-black/40 backdrop-blur-xl p-4 sm:p-6 lg:p-8 shadow-xl">
                <h2 className="mb-4 text-lg font-semibold text-amber-400">
                  Revenue Chart
                </h2>

                <div className="h-[250px] sm:h-[300px] lg:h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#aaa" />
                      <YAxis stroke="#aaa" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#f59e0b"
                        fill="#f59e0b33"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* MENU */}
          {activeTab === "menu" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl lg:text-3xl font-serif text-amber-300">
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
                  className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-amber-500 px-5 py-3 text-black font-semibold shadow-lg shadow-amber-900/30"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-stone-800 bg-black/40 backdrop-blur-xl p-4 shadow-lg"
                  >
                    <div className="flex gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                        />
                      )}

                      <div className="flex-1 overflow-hidden">
                        <p className="font-medium text-amber-200 truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-stone-400 mt-1">
                          ₹{item.price}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsAdding(false);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-950/30 py-2 text-sm text-blue-400"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        onClick={() => deleteMenuItem(item.id)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-950/30 py-2 text-sm text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h1 className="text-2xl lg:text-3xl font-serif text-amber-300">
                Orders
              </h1>

              {orders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-700 p-10 text-center text-stone-500">
                  No orders yet
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-stone-800 bg-black/40 backdrop-blur-xl p-4 sm:p-6"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                        <div>
                          <p className="font-mono text-lg text-amber-300">
                            #{order.id}
                          </p>
                          <p className="text-xs text-stone-500 mt-1">
                            {order.time}
                          </p>
                        </div>

                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                          className="w-full sm:w-auto rounded-xl bg-stone-800 border border-stone-700 p-3 text-sm"
                        >
                          <option>Pending</option>
                          <option>Preparing</option>
                          <option>Out for Delivery</option>
                          <option>Delivered</option>
                        </select>
                      </div>

                      <div className="mt-4 space-y-2 text-sm text-stone-300">
                        <p>
                          <strong>Name:</strong> {order.customer}
                        </p>
                        <p>
                          <strong>Phone:</strong> {order.phone}
                        </p>
                        <p>
                          <strong>Address:</strong> {order.address}
                        </p>
                      </div>

                      <div className="mt-4 border-t border-stone-800 pt-4">
                        {order.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex justify-between text-sm text-stone-400 py-1"
                          >
                            <span>
                              {item.name} × {item.quantity}
                            </span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 text-right text-xl font-bold text-amber-300">
                        Total: ₹{order.total}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* COUPONS */}
          {activeTab === "coupons" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl lg:text-3xl font-serif text-amber-300">
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
                  className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-amber-500 px-5 py-3 text-black font-semibold"
                >
                  <Plus className="h-4 w-4" />
                  Add Coupon
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.code}
                    className={`rounded-2xl border bg-black/40 backdrop-blur-xl p-5 ${
                      !coupon.active
                        ? "border-red-800/40 opacity-60"
                        : "border-stone-800"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-mono text-xl font-bold text-amber-300">
                          {coupon.code}
                        </p>
                        <p className="text-sm text-stone-400 mt-2">
                          {coupon.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl bg-stone-900/70 p-3">
                        <p className="text-xs text-stone-500">Type</p>
                        <p className="text-stone-200">
                          {coupon.type === "percentage"
                            ? `${coupon.value}%`
                            : `₹${coupon.value}`}
                        </p>
                      </div>

                      <div className="rounded-xl bg-stone-900/70 p-3">
                        <p className="text-xs text-stone-500">Min Order</p>
                        <p className="text-stone-200">₹{coupon.minOrder}</p>
                      </div>

                      <div className="rounded-xl bg-stone-900/70 p-3">
                        <p className="text-xs text-stone-500">Used</p>
                        <p className="text-stone-200">
                          {coupon.usedCount}/{coupon.usageLimit}
                        </p>
                      </div>

                      <div className="rounded-xl bg-stone-900/70 p-3">
                        <p className="text-xs text-stone-500">Expiry</p>
                        <p className="text-stone-200">{coupon.expiry}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <button
                        onClick={() => {
                          setEditingCoupon(coupon);
                          setIsAddingCoupon(false);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-950/30 py-2 text-sm text-blue-400"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        onClick={() => toggleCoupon(coupon.code)}
                        className={`flex-1 rounded-lg py-2 text-sm ${
                          coupon.active
                            ? "bg-emerald-950/30 text-emerald-400"
                            : "bg-red-950/30 text-red-400"
                        }`}
                      >
                        {coupon.active ? "Active" : "Disabled"}
                      </button>

                      <button
                        onClick={() => deleteCoupon(coupon.code)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-950/30 py-2 text-sm text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {editingItem && (
        <MenuFormModal
          item={editingItem}
          isAdding={isAdding}
          onClose={() => {
            setEditingItem(null);
            setIsAdding(false);
          }}
          onSave={saveMenuItem}
        />
      )}

      {editingCoupon && (
        <CouponFormModal
          coupon={editingCoupon}
          isAdding={isAddingCoupon}
          onClose={() => {
            setEditingCoupon(null);
            setIsAddingCoupon(false);
          }}
          onSave={saveCoupon}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-stone-800 bg-black/40 backdrop-blur-xl p-5 sm:p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm text-stone-400">{label}</p>
          <p className="mt-2 text-2xl sm:text-3xl font-bold text-amber-300">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-amber-950/30">
          <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-amber-400" />
        </div>
      </div>
    </div>
  );
}

function MenuFormModal({ item, isAdding, onClose, onSave }) {
  const [form, setForm] = useState(item);

  useEffect(() => {
    setForm(item);
  }, [item]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl border border-stone-800 bg-stone-900 p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-serif text-amber-400 mb-4">
          {isAdding ? "Add New Dish" : "Edit Dish"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Dish Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-stone-800 p-3 rounded-xl text-sm"
            required
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full bg-stone-800 p-3 rounded-xl text-sm resize-none"
            rows={3}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
              className="w-full bg-stone-800 p-3 rounded-xl text-sm"
              required
            />

            <input
              type="number"
              placeholder="Rating"
              value={form.rating}
              onChange={(e) =>
                setForm({ ...form, rating: Number(e.target.value) })
              }
              className="w-full bg-stone-800 p-3 rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Prep Time (mins)"
              value={form.prepTime}
              onChange={(e) =>
                setForm({ ...form, prepTime: Number(e.target.value) })
              }
              className="w-full bg-stone-800 p-3 rounded-xl text-sm"
            />

            <input
              type="text"
              placeholder="Category"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="w-full bg-stone-800 p-3 rounded-xl text-sm"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-stone-300">
            <input
              type="checkbox"
              checked={form.isVeg}
              onChange={(e) =>
                setForm({ ...form, isVeg: e.target.checked })
              }
            />
            Vegetarian
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="text-sm text-stone-300"
          />

          {form.image && (
            <img
              src={form.image}
              alt=""
              className="h-24 rounded-xl object-cover"
            />
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-1/2 rounded-xl border border-stone-700 py-3 text-sm text-stone-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full sm:w-1/2 rounded-xl bg-amber-500 py-3 text-sm font-semibold text-black"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CouponFormModal({ coupon, isAdding, onClose, onSave }) {
  const [form, setForm] = useState(coupon);

  useEffect(() => {
    setForm(coupon);
  }, [coupon]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl border border-stone-800 bg-stone-900 p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-serif text-amber-400 mb-4">
          {isAdding ? "Create Coupon" : "Edit Coupon"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Coupon Code"
            value={form.code}
            onChange={(e) =>
              setForm({ ...form, code: e.target.value.toUpperCase() })
            }
            className="w-full bg-stone-800 p-3 rounded-xl text-sm uppercase"
            required
            disabled={!isAdding}
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full bg-stone-800 p-3 rounded-xl text-sm resize-none"
            rows={2}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
              className="w-full bg-stone-800 p-3 rounded-xl text-sm"
            >
              <option value="percentage">Percentage</option>
              <option value="flat">Flat</option>
            </select>

            <input
              type="number"
              placeholder={
                form.type === "percentage" ? "Value (%)" : "Value (₹)"
              }
              value={form.value}
              onChange={(e) =>
                setForm({ ...form, value: Number(e.target.value) })
              }
              className="w-full bg-stone-800 p-3 rounded-xl text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Min Order"
              value={form.minOrder}
              onChange={(e) =>
                setForm({ ...form, minOrder: Number(e.target.value) })
              }
              className="w-full bg-stone-800 p-3 rounded-xl text-sm"
              required
            />

            <input
              type="number"
              placeholder="Usage Limit"
              value={form.usageLimit}
              onChange={(e) =>
                setForm({ ...form, usageLimit: Number(e.target.value) })
              }
              className="w-full bg-stone-800 p-3 rounded-xl text-sm"
              required
            />
          </div>

          <input
            type="date"
            value={form.expiry}
            onChange={(e) =>
              setForm({ ...form, expiry: e.target.value })
            }
            className="w-full bg-stone-800 p-3 rounded-xl text-sm"
            required
          />

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-stone-300">
              <input
                type="checkbox"
                checked={form.firstOrderOnly}
                onChange={(e) =>
                  setForm({ ...form, firstOrderOnly: e.target.checked })
                }
              />
              First Order Only
            </label>

            <label className="flex items-center gap-2 text-sm text-stone-300">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm({ ...form, active: e.target.checked })
                }
              />
              Active
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-1/2 rounded-xl border border-stone-700 py-3 text-sm text-stone-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full sm:w-1/2 rounded-xl bg-amber-500 py-3 text-sm font-semibold text-black"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
