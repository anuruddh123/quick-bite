// Sample structure reference (optional comment)
/*
MenuItem shape:
{
  id: "",
  name: "",
  description: "",
  price: 0,
  emoji: "",
  image: "", // optional
  category: "",
  rating: 0,
  prepTime: 0,
  isVeg: true
}
*/

export const availableCoupons = [
  {
    code: "WELCOME50",
    description: "50% off on your first order above ₹200",
    type: "percentage",
    value: 50,
    minOrder: 200,
    firstOrderOnly: true,
    usageLimit: 100,
    expiry: "2025-12-31",
    usedCount: 0,
    active: true,
  },
  {
    code: "SAVE100",
    description: "Flat ₹100 off on orders above ₹800",
    type: "flat",
    value: 100,
    minOrder: 800,
    firstOrderOnly: false,
    usageLimit: 50,
    expiry: "2025-10-01",
    usedCount: 0,
    active: true,
  },
  {
    code: "FREEDEL",
    description: "Free delivery on orders above ₹500",
    type: "flat",
    value: 40,
    minOrder: 500,
    firstOrderOnly: false,
    usageLimit: 200,
    expiry: "2025-12-31",
    usedCount: 0,
    active: true,
  },
  {
    code: "FEAST20",
    description: "20% off on orders above ₹1000",
    type: "percentage",
    value: 20,
    minOrder: 1000,
    firstOrderOnly: false,
    usageLimit: 100,
    expiry: "2025-12-31",
    usedCount: 0,
    active: true,
  },
];