"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  Utensils,
  Plus,
  Search,
  Check,
  Edit2,
  Trash2,
  ExternalLink,
  Store,
  Sparkles,
  Save,
  Tag,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  Flame,
} from "lucide-react";
import type { Tenant } from "@/lib/tenant";
import {
  saveTenantCustomizationAction,
  getTenantCustomizationAction,
} from "@/app/actions/tenant";

export interface MenuItem {
  id: string | number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable?: boolean;
  badge?: string;
  dietary?: string[];
}

interface RestaurantMenuCustomizationViewProps {
  tenant: Tenant;
  allTenants: Tenant[];
  onSelectTenant: (tenant: Tenant) => void;
  platformDomain: string;
  platformProtocol: string;
}

const DEFAULT_CATEGORIES = [
  "Craft Burgers",
  "Stone-Fired Pizzas",
  "Handmade Pasta",
  "Craft Beverages",
  "Decadent Sweets",
];

const INITIAL_PRODUCTS: MenuItem[] = [
  {
    id: "prod-1",
    name: "Truffle Wagyu Smash Burger",
    description: "Double Wagyu beef patties, truffle aioli, aged cheddar, caramelized shallots on brioche.",
    price: 18.5,
    category: "Craft Burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    badge: "Chef's Signature",
    dietary: ["Wagyu", "House Special"],
  },
  {
    id: "prod-2",
    name: "Smoked Bacon & Sharp Cheddar Burger",
    description: "Prime beef patty, Applewood bacon, sharp cheddar, crisp butter lettuce, garlic mayo.",
    price: 16.0,
    category: "Craft Burgers",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    dietary: ["Smoked"],
  },
  {
    id: "prod-3",
    name: "Crispy Hot Honey Chicken Burger",
    description: "Buttermilk crispy chicken dipped in habanero hot honey, purple slaw, and dill pickles.",
    price: 15.5,
    category: "Craft Burgers",
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    badge: "Trending",
    dietary: ["Spicy"],
  },
  {
    id: "prod-4",
    name: "Artisanal Margherita D.O.P.",
    description: "San Marzano tomatoes, fresh buffalo mozzarella, fresh basil, extra virgin olive oil.",
    price: 16.5,
    category: "Stone-Fired Pizzas",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    badge: "Authentic",
    dietary: ["Vegetarian"],
  },
  {
    id: "prod-5",
    name: "Black Truffle & Wild Mushroom Pizza",
    description: "Fior di latte, roasted wild foraged chanterelles, shaved black summer truffles.",
    price: 21.0,
    category: "Stone-Fired Pizzas",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    dietary: ["Truffle"],
  },
  {
    id: "prod-6",
    name: "Tagliatelle al Tartufo",
    description: "Fresh egg pasta ribbons tossed in creamy butter, 24-month Parmigiano, shaved black truffle.",
    price: 23.0,
    category: "Handmade Pasta",
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281682?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    dietary: ["Fresh Pasta"],
  },
  {
    id: "prod-7",
    name: "Botanical Citrus Spritz",
    description: "Cold-pressed blood orange, yuzu, sparkling mineral water, fresh rosemary sprig.",
    price: 6.5,
    category: "Craft Beverages",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    dietary: ["Alcohol Free"],
  },
  {
    id: "prod-8",
    name: "Molten Belgian Chocolate Soufflé",
    description: "Warm 70% dark Valrhona chocolate cake with molten core and vanilla bean gelato.",
    price: 9.5,
    category: "Decadent Sweets",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    badge: "Bestseller",
    dietary: ["Dessert"],
  },
];

export function RestaurantMenuCustomizationView({
  tenant,
  allTenants,
  onSelectTenant,
  platformDomain,
  platformProtocol,
}: RestaurantMenuCustomizationViewProps) {
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<MenuItem[]>(INITIAL_PRODUCTS);

  // Edit/Create Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [itemPrice, setItemPrice] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemImage, setItemImage] = useState("");
  const [itemBadge, setItemBadge] = useState("");
  const [itemDietary, setItemDietary] = useState("");
  const [itemAvailable, setItemAvailable] = useState(true);

  // Category modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [isSaving, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load tenant's custom menu if saved
  useEffect(() => {
    if (tenant?.slug) {
      getTenantCustomizationAction(tenant.slug).then((res) => {
        if (res.success && res.data) {
          if (res.data.menuProducts && Array.isArray(res.data.menuProducts) && res.data.menuProducts.length > 0) {
            setItems(res.data.menuProducts);
          } else {
            setItems(INITIAL_PRODUCTS);
          }
          if (res.data.menuCategories && Array.isArray(res.data.menuCategories) && res.data.menuCategories.length > 0) {
            setCategories(res.data.menuCategories.map((c: any) => (typeof c === "string" ? c : c.name)));
          }
        }
      });
    }
  }, [tenant?.slug]);

  // Handle Save
  const handleSaveMenu = () => {
    startTransition(async () => {
      await saveTenantCustomizationAction(tenant.slug, {
        menuProducts: items,
        menuCategories: categories.map((c, i) => ({ id: i + 1, name: c })),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    });
  };

  // Toggle item availability
  const handleToggleAvailability = (id: string | number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  // Delete item
  const handleDeleteItem = (id: string | number) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Open modal for Create or Edit
  const openItemModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setItemName(item.name);
      setItemCategory(item.category);
      setItemPrice(item.price.toString());
      setItemDesc(item.description);
      setItemImage(item.image || "");
      setItemBadge(item.badge || "");
      setItemDietary(item.dietary ? item.dietary.join(", ") : "");
      setItemAvailable(item.isAvailable ?? true);
    } else {
      setEditingItem(null);
      setItemName("");
      setItemCategory(categories[0] || "Craft Burgers");
      setItemPrice("");
      setItemDesc("");
      setItemImage("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80");
      setItemBadge("");
      setItemDietary("");
      setItemAvailable(true);
    }
    setIsModalOpen(true);
  };

  // Save Item (Create or Update)
  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(itemPrice) || 0;
    const dietaryArr = itemDietary
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    if (editingItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: itemName,
                category: itemCategory,
                price: priceNum,
                description: itemDesc,
                image: itemImage,
                badge: itemBadge || undefined,
                dietary: dietaryArr.length > 0 ? dietaryArr : undefined,
                isAvailable: itemAvailable,
              }
            : item
        )
      );
    } else {
      const newItem: MenuItem = {
        id: "prod-" + Date.now(),
        name: itemName,
        category: itemCategory,
        price: priceNum,
        description: itemDesc,
        image: itemImage,
        badge: itemBadge || undefined,
        dietary: dietaryArr.length > 0 ? dietaryArr : undefined,
        isAvailable: itemAvailable,
      };
      setItems((prev) => [newItem, ...prev]);
    }
    setIsModalOpen(false);
  };

  // Add category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = newCategoryName.trim();
    if (cat && !categories.includes(cat)) {
      setCategories((prev) => [...prev, cat]);
      setSelectedCategory(cat);
      setNewCategoryName("");
      setIsCategoryModalOpen(false);
    }
  };

  // Filtered items
  const filteredItems = items.filter((item) => {
    const matchesCat =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const liveStoreUrl = `${platformProtocol}://${tenant.slug}.${platformDomain}`;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header & Restaurant Context Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-lime-500 text-black uppercase font-mono">
              MENU CUSTOMIZATION
            </span>
            <span className="text-xs text-zinc-400 font-mono">•</span>
            <span className="text-xs font-semibold text-zinc-700">
              {tenant.name}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 flex items-center gap-2">
            <span>Restaurant Menu & Dishes</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1">
            Manage your dishes, adjust pricing, toggle availability, and organize food categories.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Restaurant Switcher Dropdown if merchant has multiple stores */}
          {allTenants.length > 1 && (
            <select
              value={tenant.id}
              onChange={(e) => {
                const found = allTenants.find((t) => t.id === e.target.value);
                if (found) onSelectTenant(found);
              }}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 shadow-2xs focus:outline-none focus:border-lime-500"
            >
              {allTenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          )}

          <a
            href={liveStoreUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-lime-700" />
          </a>

          <button
            type="button"
            onClick={handleSaveMenu}
            disabled={isSaving}
            className="px-4 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isSaving ? (
              <span>Saving...</span>
            ) : saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-zinc-200 bg-white shadow-2xs">
          <span className="text-[10px] uppercase font-mono text-zinc-500">
            Total Dishes
          </span>
          <p className="text-xl font-bold font-mono text-zinc-900 mt-0.5">
            {items.length}
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-zinc-200 bg-white shadow-2xs">
          <span className="text-[10px] uppercase font-mono text-zinc-500">
            Active Categories
          </span>
          <p className="text-xl font-bold font-mono text-zinc-900 mt-0.5">
            {categories.length}
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-zinc-200 bg-white shadow-2xs">
          <span className="text-[10px] uppercase font-mono text-zinc-500">
            In Stock
          </span>
          <p className="text-xl font-bold font-mono text-lime-700 mt-0.5">
            {items.filter((i) => i.isAvailable !== false).length}
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-zinc-200 bg-white shadow-2xs">
          <span className="text-[10px] uppercase font-mono text-zinc-500">
            Sold Out
          </span>
          <p className="text-xl font-bold font-mono text-zinc-400 mt-0.5">
            {items.filter((i) => i.isAvailable === false).length}
          </p>
        </div>
      </div>

      {/* Controls: Search, Category Filters, and Add Dish Button */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes by name or ingredients..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-lime-500 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Tag className="w-3.5 h-3.5 text-zinc-500" />
              <span>+ Category</span>
            </button>

            <button
              type="button"
              onClick={() => openItemModal()}
              className="px-3.5 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Dish</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === "All"
                ? "bg-zinc-900 text-white"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            All Items ({items.length})
          </button>
          {categories.map((cat) => {
            const count = items.filter((i) => i.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-zinc-900 text-white"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Dishes Grid */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-800">
              No dishes found matching your criteria
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Add your first dish to this category or adjust your search filter.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openItemModal()}
            className="px-3.5 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Dish</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredItems.map((item) => {
            const isAvail = item.isAvailable !== false;
            return (
              <div
                key={item.id}
                className={`rounded-2xl border bg-white p-3.5 sm:p-4 transition-all shadow-xs flex flex-col justify-between ${
                  isAvail ? "border-zinc-200 hover:border-zinc-300" : "border-zinc-200 opacity-60 bg-zinc-50/70"
                }`}
              >
                <div>
                  <div className="flex gap-3 items-start">
                    {/* Dish Image */}
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover border border-zinc-200 flex-shrink-0 bg-zinc-100"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 flex-shrink-0">
                        <Utensils className="w-5 h-5" />
                      </div>
                    )}

                    {/* Dish Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-zinc-900 truncate">
                          {item.name}
                        </h4>
                        <span className="font-mono font-bold text-xs sm:text-sm text-lime-700 flex-shrink-0">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-zinc-100 border border-zinc-200 text-zinc-700">
                          {item.category}
                        </span>

                        {item.badge && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-lime-100 border border-lime-300 text-lime-800">
                            {item.badge}
                          </span>
                        )}

                        {item.dietary?.map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-amber-50 border border-amber-200 text-amber-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Bottom Controls */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-100">
                  {/* Availability Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleAvailability(item.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer ${
                      isAvail
                        ? "bg-lime-50 text-lime-800 border border-lime-200 hover:bg-lime-100"
                        : "bg-zinc-100 text-zinc-600 border border-zinc-200 hover:bg-zinc-200"
                    }`}
                  >
                    {isAvail ? (
                      <>
                        <Eye className="w-3 h-3 text-lime-600" />
                        <span>In Stock</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 text-zinc-400" />
                        <span>Sold Out</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openItemModal(item)}
                      title="Edit dish"
                      className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      title="Delete dish"
                      className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-lime-600" />
                <h3 className="text-sm font-bold text-zinc-900">
                  {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleItemSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Truffle Burrata Pizza"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-lime-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    placeholder="18.50"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-lime-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Category
                  </label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-lime-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Highlight Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={itemBadge}
                    onChange={(e) => setItemBadge(e.target.value)}
                    placeholder="e.g. Chef's Pick, New, Bestseller"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-lime-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  placeholder="Ingredients, preparation, flavor notes..."
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-lime-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={itemImage}
                    onChange={(e) => setItemImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-lime-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Dietary Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={itemDietary}
                    onChange={(e) => setItemDietary(e.target.value)}
                    placeholder="e.g. Vegetarian, Spicy, Gluten Free"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-lime-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="avail-chk"
                  checked={itemAvailable}
                  onChange={(e) => setItemAvailable(e.target.checked)}
                  className="w-4 h-4 accent-lime-600 rounded cursor-pointer"
                />
                <label htmlFor="avail-chk" className="text-xs font-medium text-zinc-700 cursor-pointer">
                  Available in restaurant menu
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-xs text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  {editingItem ? "Update Dish" : "Add Dish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-sm font-bold text-zinc-900">Add Menu Category</h3>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Artisan Sides, Wood-Fired Bowls"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-lime-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-xs text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
