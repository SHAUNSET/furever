import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  IndianRupee,
  CreditCard,
  Banknote,
  ShoppingBag,
  Clock3,
  CheckCircle2,
  XCircle,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Star,
  Layers,
  AlertCircle,
  ImageOff,
  TrendingUp,
} from "lucide-react";

import Nav from "../component/Nav";
import Sidebar from "../component/Sidebar";
import { authDataContext } from "../context/AuthContext";

// =============================================================================
// CONSTANTS
// =============================================================================

const STATUS_META = [
  { key: "placed", label: "Placed", color: "#FF6A3D" },
  { key: "processing", label: "Processing", color: "#F59E0B" },
  { key: "shipped", label: "Shipped", color: "#3B82F6" },
  { key: "out for delivery", label: "Out for delivery", color: "#A855F7" },
  { key: "delivered", label: "Delivered", color: "#10B981" },
  { key: "cancelled", label: "Cancelled", color: "#EF4444" },
];

const PAYMENT_COLORS = ["#FF6A3D", "#3B4CE0"];
const CATEGORY_COLORS = ["#14172E", "#FF6A3D", "#3B4CE0", "#10B981", "#F59E0B"];

// =============================================================================
// HELPERS
// =============================================================================

const normalizeStatus = (status) => String(status || "Placed").toLowerCase().trim();

const formatPrice = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const formatCompactPrice = (amount) => {
  const value = Number(amount || 0);
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value}`;
};

const formatDateShort = (dateValue) => {
  if (!dateValue) return "—";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

const formatDateTime = (dateValue) => {
  if (!dateValue) return "—";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "—";
  return `${date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  })} · ${date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
};

const getCustomerName = (order) => {
  const address = order?.address || {};
  const first = address?.firstName || "";
  const last = address?.lastName || "";
  const full = [first, last].filter(Boolean).join(" ");
  return full || "Customer";
};

const getStatusMeta = (status) => {
  const normalized = normalizeStatus(status);
  return STATUS_META.find((item) => item.key === normalized) || STATUS_META[0];
};

// =============================================================================
// SUB COMPONENT — STAT CARD
// =============================================================================

function StatCard({ icon: Icon, label, value, subtext, tint, iconColor, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -3 }}
      className="relative overflow-hidden rounded-3xl border border-[#F0E9DE] bg-white p-4 shadow-sm transition-shadow hover:shadow-lg sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold text-[#8A8578] sm:text-xs">{label}</p>
          <h3 className="mt-2 truncate text-xl font-bold text-[#14172E] sm:text-2xl">{value}</h3>
          {subtext && <p className="mt-1 truncate text-[11px] font-medium text-[#B4AFA1]">{subtext}</p>}
        </div>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:h-11 sm:w-11"
          style={{ backgroundColor: tint, color: iconColor }}
        >
          <Icon size={19} />
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// SUB COMPONENT — HERO REVENUE BAND
// =============================================================================

function HeroChip({ icon: Icon, label, value, tint, iconColor }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: tint, color: iconColor }}
      >
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium text-white/60">{label}</p>
        <p className="truncate text-sm font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

function HeroRevenueBand({ analytics }) {
  const isPositive = analytics.revenueGrowth >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#14172E] via-[#191D3B] to-[#20254B] p-6 text-white shadow-lg sm:p-8"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#FF6A3D]/10" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-[#3B4CE0]/10" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
            Total Revenue Collected
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {formatPrice(analytics.totalRevenueCollected)}
            </h2>

            <span
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                isPositive ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
              }`}
            >
              {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {Math.abs(analytics.revenueGrowth)}% vs last week
            </span>
          </div>

          <p className="mt-3 max-w-md text-sm leading-6 text-white/60">
            Combined earnings from online payments and cash actually collected on
            delivery. Excludes cancelled orders.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[420px]">
          <HeroChip
            icon={CreditCard}
            label="Online (Razorpay)"
            value={formatPrice(analytics.razorpayRevenue)}
            tint="rgba(255,106,61,0.2)"
            iconColor="#FF8F6B"
          />
          <HeroChip
            icon={Banknote}
            label="COD Collected"
            value={formatPrice(analytics.codCollected)}
            tint="rgba(59,76,224,0.25)"
            iconColor="#8C97F2"
          />
          <HeroChip
            icon={Clock3}
            label="COD Pending"
            value={formatPrice(analytics.codPendingAmount)}
            tint="rgba(245,158,11,0.2)"
            iconColor="#FBBF24"
          />
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// TOOLTIPS
// =============================================================================

function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0]?.payload;
  return (
    <div className="rounded-xl border border-[#F0E9DE] bg-white px-4 py-3 shadow-lg">
      <p className="text-xs font-bold text-[#8A8578]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#FF6A3D]">{formatPrice(point?.revenue)}</p>
      <p className="text-xs text-[#8A8578]">
        {point?.orders || 0} order{point?.orders === 1 ? "" : "s"}
      </p>
    </div>
  );
}

function PaymentTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const entry = payload[0];
  return (
    <div className="rounded-xl border border-[#F0E9DE] bg-white px-4 py-3 shadow-lg">
      <p className="text-sm font-bold text-[#14172E]">{entry.name}</p>
      <p className="mt-1 text-sm font-bold" style={{ color: entry.color || "#14172E" }}>
        {formatPrice(entry.value)}
      </p>
    </div>
  );
}

function StatusTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const entry = payload[0];
  return (
    <div className="rounded-xl border border-[#F0E9DE] bg-white px-4 py-3 shadow-lg">
      <p className="text-sm font-bold text-[#14172E]">{entry.payload.label}</p>
      <p className="mt-1 text-sm font-bold" style={{ color: entry.payload.color }}>
        {entry.value} order{entry.value === 1 ? "" : "s"}
      </p>
    </div>
  );
}

function CategoryTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const entry = payload[0];
  return (
    <div className="rounded-xl border border-[#F0E9DE] bg-white px-4 py-3 shadow-lg">
      <p className="text-sm font-bold text-[#14172E]">{entry.name}</p>
      <p className="mt-1 text-sm font-bold" style={{ color: entry.color }}>
        {entry.value} product{entry.value === 1 ? "" : "s"}
      </p>
    </div>
  );
}

// =============================================================================
// SUB COMPONENT — RECENT ORDER ROW
// =============================================================================

function RecentOrderRow({ order }) {
  const meta = getStatusMeta(order?.status);
  const customerName = getCustomerName(order);
  const initial = customerName.charAt(0).toUpperCase() || "C";
  const isRazorpay = order?.paymentMethod === "Razorpay";

  return (
    <div className="flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-[#FAF7F1] sm:px-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FF6A3D]/10 text-sm font-bold text-[#FF6A3D]">
        {initial}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-[#14172E]">{customerName}</p>
        <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-[#8A8578]">
          {isRazorpay ? <CreditCard size={12} /> : <Banknote size={12} />}
          {order?.paymentMethod || "COD"} · {formatDateTime(order?.createdAt)}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="text-sm font-bold text-[#14172E]">{formatPrice(order?.amount)}</span>
        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-bold"
          style={{ backgroundColor: `${meta.color}1A`, color: meta.color }}
        >
          {meta.label}
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// SUB COMPONENT — TOP PRODUCT ROW
// =============================================================================

function TopProductRow({ product, rank }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-[#FAF7F1] sm:px-4">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#14172E] text-xs font-bold text-white">
        {rank}
      </span>

      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="h-12 w-12 shrink-0 rounded-xl object-cover shadow-sm"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F3EFE7] text-[#B4AFA1]">
          <ImageOff size={18} />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-[#14172E]">{product.name}</p>
        <p className="mt-0.5 text-xs text-[#8A8578]">{product.quantity} sold</p>
      </div>

      <span className="shrink-0 text-sm font-bold text-[#FF6A3D]">{formatPrice(product.revenue)}</span>
    </div>
  );
}

// =============================================================================
// SUB COMPONENT — SKELETON
// =============================================================================

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-44 animate-pulse rounded-3xl bg-[#F2ECE1]" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-3xl bg-[#F2ECE1]" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-3xl bg-[#F2ECE1]" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-80 animate-pulse rounded-3xl bg-[#F2ECE1] lg:col-span-2" />
        <div className="h-80 animate-pulse rounded-3xl bg-[#F2ECE1]" />
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

function Home() {
  const { serverUrl } = useContext(authDataContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  // ---------------------------------------------------------------------
  // FETCH ORDERS + PRODUCTS TOGETHER
  // ---------------------------------------------------------------------
  const fetchDashboardData = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setErrorMsg("");

      const [ordersRes, productsRes] = await Promise.all([
        axios.get(`${serverUrl}/api/order/allorders`, { withCredentials: true }),
        axios.get(`${serverUrl}/api/product/listproduct`, { withCredentials: true }),
      ]);

      const orderList = Array.isArray(ordersRes.data)
        ? ordersRes.data
        : ordersRes.data?.orders || ordersRes.data?.allOrders || [];

      const productList = Array.isArray(productsRes.data)
        ? productsRes.data
        : productsRes.data?.products || [];

      setOrders(orderList);
      setProducts(productList);
      setLastUpdated(new Date());
    } catch (err) {
      console.log("Dashboard Fetch Error:", err);
      setErrorMsg("Unable to load dashboard data. Please try refreshing.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (serverUrl) fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverUrl]);

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    fetchDashboardData(false);
  };

  // ---------------------------------------------------------------------
  // ANALYTICS
  // ---------------------------------------------------------------------
  const analytics = useMemo(() => {
    const nonCancelled = orders.filter((o) => normalizeStatus(o.status) !== "cancelled");

    const codOrders = orders.filter((o) => o.paymentMethod === "COD");
    const razorpayOrders = orders.filter((o) => o.paymentMethod === "Razorpay");

    const codDelivered = codOrders.filter((o) => normalizeStatus(o.status) === "delivered");
    const codPending = codOrders.filter(
      (o) => normalizeStatus(o.status) !== "delivered" && normalizeStatus(o.status) !== "cancelled"
    );

    const razorpayPaid = razorpayOrders.filter((o) => o.payment === true);
    const razorpayUnpaid = razorpayOrders.filter((o) => !o.payment);

    const codCollected = codDelivered.reduce((sum, o) => sum + Number(o.amount || 0), 0);
    const codPendingAmount = codPending.reduce((sum, o) => sum + Number(o.amount || 0), 0);
    const razorpayRevenue = razorpayPaid.reduce((sum, o) => sum + Number(o.amount || 0), 0);

    const totalRevenueCollected = codCollected + razorpayRevenue;
    const totalOrderValue = nonCancelled.reduce((sum, o) => sum + Number(o.amount || 0), 0);

    const statusCounts = {
      placed: 0,
      processing: 0,
      shipped: 0,
      "out for delivery": 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach((o) => {
      const status = normalizeStatus(o.status);
      if (statusCounts[status] !== undefined) statusCounts[status] += 1;
    });

    const pendingOrdersCount =
      statusCounts.placed +
      statusCounts.processing +
      statusCounts.shipped +
      statusCounts["out for delivery"];

    const avgOrderValue =
      nonCancelled.length > 0 ? Math.round(totalOrderValue / nonCancelled.length) : 0;

    // ------------------- REVENUE TREND (last 7 days, vs previous 7) -------------------
    const dayBuckets = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dayBuckets.push({
        key,
        label: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        revenue: 0,
        orders: 0,
      });
    }
    const bucketMap = new Map(dayBuckets.map((b) => [b.key, b]));

    nonCancelled.forEach((o) => {
      if (!o.createdAt) return;
      const created = new Date(o.createdAt);
      if (Number.isNaN(created.getTime())) return;
      const key = created.toISOString().slice(0, 10);
      const bucket = bucketMap.get(key);
      if (bucket) {
        bucket.revenue += Number(o.amount || 0);
        bucket.orders += 1;
      }
    });

    const trend = dayBuckets.slice(7);
    const previousWeek = dayBuckets.slice(0, 7);
    const last7Revenue = trend.reduce((sum, b) => sum + b.revenue, 0);
    const prev7Revenue = previousWeek.reduce((sum, b) => sum + b.revenue, 0);
    const revenueGrowth =
      prev7Revenue > 0
        ? Math.round(((last7Revenue - prev7Revenue) / prev7Revenue) * 100)
        : last7Revenue > 0
        ? 100
        : 0;

    // ------------------- TOP SELLING PRODUCTS -------------------
    const productMap = new Map();
    nonCancelled.forEach((o) => {
      const items = Array.isArray(o.items) ? o.items : [];
      items.forEach((item) => {
        const key = item.productId || item.name;
        if (!key) return;
        if (!productMap.has(key)) {
          productMap.set(key, {
            name: item.name || "Product",
            image: item.image || "",
            quantity: 0,
            revenue: 0,
          });
        }
        const entry = productMap.get(key);
        entry.quantity += Number(item.quantity || 0);
        entry.revenue += Number(item.price || 0) * Number(item.quantity || 0);
      });
    });
    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // ------------------- CATALOG BY CATEGORY -------------------
    const categoryMap = new Map();
    products.forEach((p) => {
      const cat = p.category || "Other";
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
    });
    const categoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    const avgProductPrice =
      products.length > 0
        ? Math.round(products.reduce((sum, p) => sum + Number(p.price || 0), 0) / products.length)
        : 0;

    // ------------------- RECENT ORDERS -------------------
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 6);

    return {
      totalOrders: orders.length,
      pendingOrdersCount,
      deliveredCount: statusCounts.delivered,
      cancelledCount: statusCounts.cancelled,
      totalRevenueCollected,
      totalOrderValue,
      razorpayRevenue,
      razorpayPaidCount: razorpayPaid.length,
      razorpayUnpaidCount: razorpayUnpaid.length,
      codCollected,
      codCollectedCount: codDelivered.length,
      codPendingAmount,
      codPendingCount: codPending.length,
      avgOrderValue,
      totalProducts: products.length,
      bestsellerCount: products.filter((p) => p.bestseller).length,
      avgProductPrice,
      statusCounts,
      trend,
      revenueGrowth,
      topProducts,
      categoryData,
      recentOrders,
    };
  }, [orders, products]);

  const statusChartData = STATUS_META.map((meta) => ({
    ...meta,
    count: analytics.statusCounts[meta.key] || 0,
  }));

  const paymentSplitData = [
    { name: "Online (Razorpay)", value: analytics.razorpayRevenue },
    { name: "Cash on Delivery", value: analytics.codCollected },
  ];

  const hasPaymentData = analytics.razorpayRevenue + analytics.codCollected > 0;

  // ---------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#FAF7F1]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Nav />

      <div className="md:hidden">
        <Sidebar />
      </div>

      <div className="flex min-h-[calc(100vh-80px)] w-full">
        <aside className="hidden shrink-0 md:block">
          <Sidebar />
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8 xl:p-10">
          <div className="mx-auto w-full max-w-[1700px]">
            {/* HEADER */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1
                  className="text-3xl font-bold tracking-tight text-[#14172E] sm:text-4xl"
                  style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700 }}
                >
                  Welcome back, <span className="text-[#FF6A3D]">Admin</span> 👋
                </h1>
                <p className="mt-2 text-sm text-[#8A8578] sm:text-base">
                  {new Date().toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                  {lastUpdated && ` · Updated ${lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`}
                </p>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#14172E] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#FF6A3D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {/* ERROR */}
            {errorMsg && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                <AlertCircle size={20} />
                {errorMsg}
              </div>
            )}

            {loading ? (
              <DashboardSkeleton />
            ) : (
              <div className="space-y-6">
                {/* HERO REVENUE BAND */}
                <HeroRevenueBand analytics={analytics} />

                {/* OPERATIONS STAT CARDS */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                  <StatCard
                    icon={ShoppingBag}
                    label="Total Orders"
                    value={analytics.totalOrders}
                    tint="#FF6A3D1A"
                    iconColor="#FF6A3D"
                    delay={0}
                  />
                  <StatCard
                    icon={Clock3}
                    label="Pending Orders"
                    value={analytics.pendingOrdersCount}
                    tint="#F59E0B1A"
                    iconColor="#D97706"
                    delay={0.03}
                  />
                  <StatCard
                    icon={CheckCircle2}
                    label="Delivered"
                    value={analytics.deliveredCount}
                    tint="#10B9811A"
                    iconColor="#059669"
                    delay={0.06}
                  />
                  <StatCard
                    icon={XCircle}
                    label="Cancelled"
                    value={analytics.cancelledCount}
                    tint="#EF44441A"
                    iconColor="#DC2626"
                    delay={0.09}
                  />
                  <StatCard
                    icon={IndianRupee}
                    label="Avg Order Value"
                    value={formatPrice(analytics.avgOrderValue)}
                    tint="#3B4CE01A"
                    iconColor="#3B4CE0"
                    delay={0.12}
                  />
                  <StatCard
                    icon={Package}
                    label="Total Products"
                    value={analytics.totalProducts}
                    subtext={`${analytics.bestsellerCount} bestsellers`}
                    tint="#14172E1A"
                    iconColor="#14172E"
                    delay={0.15}
                  />
                </div>

                {/* REVENUE TREND + PAYMENT SPLIT */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className="rounded-3xl border border-[#F0E9DE] bg-white p-5 shadow-sm sm:p-6 lg:col-span-2"
                  >
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-[#14172E] sm:text-xl">Revenue Trend</h3>
                        <p className="mt-1 text-xs text-[#8A8578]">Last 7 days, excluding cancelled orders.</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF6A3D]/10 text-[#FF6A3D]">
                        <TrendingUp size={18} />
                      </div>
                    </div>

                    <ResponsiveContainer width="100%" height={260}>
                      <AreaChart data={analytics.trend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF6A3D" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#FF6A3D" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0E9DE" />
                        <XAxis
                          dataKey="label"
                          tick={{ fontSize: 11, fill: "#8A8578" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "#8A8578" }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v) => formatCompactPrice(v)}
                          width={46}
                        />
                        <Tooltip content={<RevenueTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          name="Revenue"
                          stroke="#FF6A3D"
                          strokeWidth={2.5}
                          fill="url(#revenueGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 }}
                    className="rounded-3xl border border-[#F0E9DE] bg-white p-5 shadow-sm sm:p-6"
                  >
                    <h3 className="text-lg font-bold text-[#14172E] sm:text-xl">Payment Split</h3>
                    <p className="mt-1 text-xs text-[#8A8578]">Online vs. cash collected.</p>

                    {hasPaymentData ? (
                      <div className="relative">
                        <ResponsiveContainer width="100%" height={220}>
                          <PieChart>
                            <Pie
                              data={paymentSplitData}
                              dataKey="value"
                              nameKey="name"
                              innerRadius={55}
                              outerRadius={80}
                              paddingAngle={3}
                              stroke="none"
                            >
                              {paymentSplitData.map((entry, index) => (
                                <Cell key={entry.name} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip content={<PaymentTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-[10px] font-semibold text-[#8A8578]">Collected</p>
                          <p className="text-sm font-bold text-[#14172E]">
                            {formatCompactPrice(analytics.totalRevenueCollected)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-[220px] items-center justify-center text-center text-sm text-[#B4AFA1]">
                        No revenue collected yet.
                      </div>
                    )}

                    <div className="mt-2 space-y-2">
                      {paymentSplitData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-2 font-semibold text-[#50546B]">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: PAYMENT_COLORS[index % PAYMENT_COLORS.length] }}
                            />
                            {entry.name}
                          </span>
                          <span className="font-bold text-[#14172E]">{formatPrice(entry.value)}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* ORDER STATUS + CATALOG CATEGORY */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className="rounded-3xl border border-[#F0E9DE] bg-white p-5 shadow-sm sm:p-6"
                  >
                    <h3 className="text-lg font-bold text-[#14172E] sm:text-xl">Orders by Status</h3>
                    <p className="mt-1 text-xs text-[#8A8578]">Current distribution across all orders.</p>

                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={statusChartData} layout="vertical" margin={{ top: 10, left: 0, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F0E9DE" />
                        <XAxis
                          type="number"
                          allowDecimals={false}
                          tick={{ fontSize: 11, fill: "#8A8578" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="label"
                          tick={{ fontSize: 11, fill: "#50546B", fontWeight: 600 }}
                          axisLine={false}
                          tickLine={false}
                          width={100}
                        />
                        <Tooltip content={<StatusTooltip />} cursor={{ fill: "#FAF7F1" }} />
                        <Bar dataKey="count" name="Orders" radius={[0, 8, 8, 0]} barSize={16}>
                          {statusChartData.map((entry) => (
                            <Cell key={entry.key} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 }}
                    className="rounded-3xl border border-[#F0E9DE] bg-white p-5 shadow-sm sm:p-6"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-[#14172E] sm:text-xl">Catalog by Category</h3>
                        <p className="mt-1 text-xs text-[#8A8578]">
                          {analytics.totalProducts} products · avg {formatPrice(analytics.avgProductPrice)}
                        </p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#3B4CE0]/10 text-[#3B4CE0]">
                        <Layers size={18} />
                      </div>
                    </div>

                    {analytics.categoryData.length > 0 ? (
                      <div className="flex flex-col items-center gap-4 sm:flex-row">
                        <ResponsiveContainer width="100%" height={200} className="sm:w-1/2">
                          <PieChart>
                            <Pie
                              data={analytics.categoryData}
                              dataKey="value"
                              nameKey="name"
                              innerRadius={45}
                              outerRadius={75}
                              paddingAngle={3}
                              stroke="none"
                            >
                              {analytics.categoryData.map((entry, index) => (
                                <Cell key={entry.name} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip content={<CategoryTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>

                        <div className="w-full space-y-2.5 sm:w-1/2">
                          {analytics.categoryData.map((entry, index) => (
                            <div key={entry.name} className="flex items-center justify-between text-sm">
                              <span className="flex items-center gap-2 font-semibold text-[#50546B]">
                                <span
                                  className="h-2.5 w-2.5 rounded-full"
                                  style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                                />
                                {entry.name}
                              </span>
                              <span className="font-bold text-[#14172E]">{entry.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-[200px] items-center justify-center text-center text-sm text-[#B4AFA1]">
                        No products added yet.
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* RECENT ORDERS + TOP PRODUCTS */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className="rounded-3xl border border-[#F0E9DE] bg-white p-5 shadow-sm sm:p-6 xl:col-span-2"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h3 className="text-lg font-bold text-[#14172E] sm:text-xl">Recent Orders</h3>
                      <button
                        type="button"
                        onClick={() => navigate("/orders")}
                        className="text-xs font-bold text-[#FF6A3D] hover:underline"
                      >
                        View all
                      </button>
                    </div>

                    {analytics.recentOrders.length > 0 ? (
                      <div className="divide-y divide-[#F5F0E8]">
                        {analytics.recentOrders.map((order) => (
                          <RecentOrderRow key={order._id} order={order} />
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-[200px] items-center justify-center text-center text-sm text-[#B4AFA1]">
                        No orders placed yet.
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 }}
                    className="rounded-3xl border border-[#F0E9DE] bg-white p-5 shadow-sm sm:p-6"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h3 className="text-lg font-bold text-[#14172E] sm:text-xl">Top Selling</h3>
                      <button
                        type="button"
                        onClick={() => navigate("/list")}
                        className="text-xs font-bold text-[#FF6A3D] hover:underline"
                      >
                        View all
                      </button>
                    </div>

                    {analytics.topProducts.length > 0 ? (
                      <div className="divide-y divide-[#F5F0E8]">
                        {analytics.topProducts.map((product, index) => (
                          <TopProductRow key={product.name + index} product={product} rank={index + 1} />
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-[200px] flex-col items-center justify-center gap-2 text-center text-sm text-[#B4AFA1]">
                        <Star size={26} className="text-[#E3D9CB]" />
                        No sales data yet.
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;