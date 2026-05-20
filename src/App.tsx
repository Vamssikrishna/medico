import { Dispatch, FormEvent, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { apiJson, API_BASE_URL, clearAuthToken, getAuthToken, setAuthToken } from "@/lib/api-client";
import type { AuthUser, Medicine, Order, Prescription } from "@/lib/types";

type View = "command" | "inventory" | "market" | "orders" | "care" | "ai" | "auth";

type Health = {
  ok: boolean;
  service: string;
  mongo: string;
  time: string;
};

type AiSource = {
  type: string;
  count: number;
};

const USER_KEY = "medirush_auth_user";

type InventoryForm = {
  pharmacyName: string;
  brand: string;
  genericSalts: string;
  strength: string;
  form: string;
  mrp: string;
  discountedPrice: string;
  manufacturer: string;
  stockQty: string;
  etaMin: string;
  usesSummary: string;
  prescriptionsRequired: boolean;
  temperatureSensitive: boolean;
};

const emptyInventoryForm: InventoryForm = {
  pharmacyName: "",
  brand: "",
  genericSalts: "",
  strength: "",
  form: "Tablet",
  mrp: "",
  discountedPrice: "",
  manufacturer: "",
  stockQty: "",
  etaMin: "18",
  usesSummary: "",
  prescriptionsRequired: false,
  temperatureSensitive: false,
};

function money(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function uniqueCount(values: Array<string | undefined>) {
  return new Set(values.filter(Boolean)).size;
}

function statusLabel(status: string) {
  return status.replaceAll("_", " ");
}

const viewMeta: Record<View, { title: string; subtitle: string }> = {
  command: {
    title: "Command Center",
    subtitle: "A real-time operating layer for pharmacy inventory, customer orders, care workflows, and secure access.",
  },
  inventory: {
    title: "Pharmacy Inventory",
    subtitle: "Publish, review, and manage Mongo-backed medicine stock uploaded by verified pharmacy operators.",
  },
  market: {
    title: "Customer Marketplace",
    subtitle: "Search, evaluate, and order only live pharmacy-uploaded inventory.",
  },
  orders: {
    title: "Orders & Fulfilment",
    subtitle: "Track customer orders, delivery OTPs, pharmacy handoff, and rider-ready fulfilment status.",
  },
  care: {
    title: "Care Operations",
    subtitle: "Manage prescription records and medication workflows using uploaded business data only.",
  },
  ai: {
    title: "Gemini RAG Copilot",
    subtitle: "Ask operational questions grounded in live MongoDB context from your pharmacy network.",
  },
  auth: {
    title: "Secure Access",
    subtitle: "Email OTP only. No protected route opens without a verified JWT session.",
  },
};

export function App() {
  const [view, setView] = useState<View>("command");
  const [health, setHealth] = useState<Health | null>(null);
  const [apiError, setApiError] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<InventoryForm>(emptyInventoryForm);
  const [csv, setCsv] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authName, setAuthName] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiSources, setAiSources] = useState<AiSource[]>([]);
  const [token, setToken] = useState(() => getAuthToken() ?? "");
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });
  const [busy, setBusy] = useState(false);

  const logout = useCallback(() => {
    clearAuthToken();
    localStorage.removeItem(USER_KEY);
    setToken("");
    setUser(null);
    setMedicines([]);
    setOrders([]);
    setPrescriptions([]);
    setCart({});
    setView("auth");
  }, []);

  const refreshAll = useCallback(async () => {
    if (!token) return;
    try {
      const [healthData, inventoryData, orderData, rxData] = await Promise.all([
        apiJson<Health>("/api/v1/health"),
        apiJson<{ medicines: Medicine[] }>("/api/v1/inventory"),
        apiJson<{ orders: Order[] }>("/api/v1/orders"),
        apiJson<{ prescriptions: Prescription[] }>("/api/v1/prescriptions"),
      ]);
      setHealth(healthData);
      setMedicines(inventoryData.medicines);
      setOrders(orderData.orders);
      setPrescriptions(rxData.prescriptions);
      setApiError("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "API connection failed";
      setApiError(message);
      if (message.toLowerCase().includes("session") || message.toLowerCase().includes("authentication")) {
        logout();
      }
    }
  }, [logout, token]);

  const refreshHealth = useCallback(async () => {
    try {
      const healthData = await apiJson<Health>("/api/v1/health");
      setHealth(healthData);
    } catch {
      setHealth(null);
    }
  }, []);

  useEffect(() => {
    const firstLoad = window.setTimeout(() => {
      void refreshHealth();
      if (token) void refreshAll();
    }, 0);
    const id = window.setInterval(() => {
      void refreshHealth();
      if (token) void refreshAll();
    }, 15000);
    return () => {
      window.clearTimeout(firstLoad);
      window.clearInterval(id);
    };
  }, [refreshAll, refreshHealth, token]);

  const stats = useMemo(() => {
    const stockUnits = medicines.reduce((sum, item) => sum + (item.stockQty ?? 0), 0);
    const stockValue = medicines.reduce((sum, item) => sum + (item.discountedPrice ?? item.mrp) * (item.stockQty ?? 0), 0);
    const lowStock = medicines.filter((item) => (item.stockQty ?? 0) <= 5).length;
    return {
      uploadedItems: medicines.length,
      pharmacies: uniqueCount(medicines.map((m) => m.pharmacyName)),
      stockUnits,
      stockValue,
      lowStock,
      activeOrders: orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length,
    };
  }, [medicines, orders]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return medicines;
    return medicines.filter((item) =>
      [item.brand, item.pharmacyName, item.manufacturer, item.form, item.strength, ...item.genericSalts]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [medicines, query]);

  const cartLines = useMemo(
    () =>
      Object.entries(cart)
        .map(([medicineId, qty]) => {
          const medicine = medicines.find((item) => item.id === medicineId);
          return medicine ? { medicine, qty } : null;
        })
        .filter((line): line is { medicine: Medicine; qty: number } => Boolean(line)),
    [cart, medicines],
  );

  const cartTotal = cartLines.reduce((sum, line) => sum + (line.medicine.discountedPrice ?? line.medicine.mrp) * line.qty, 0);

  function updateForm<K extends keyof InventoryForm>(key: K, value: InventoryForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function inventoryPayload(row: InventoryForm) {
    return {
      pharmacyName: row.pharmacyName.trim(),
      brand: row.brand.trim(),
      genericSalts: row.genericSalts.split(",").map((item) => item.trim()).filter(Boolean),
      strength: row.strength.trim() || "As labelled",
      form: row.form.trim() || "Tablet",
      mrp: Number(row.mrp),
      discountedPrice: row.discountedPrice ? Number(row.discountedPrice) : undefined,
      manufacturer: row.manufacturer.trim() || row.pharmacyName.trim(),
      stockQty: Number(row.stockQty) || 0,
      etaMin: Number(row.etaMin) || 18,
      usesSummary: row.usesSummary.trim() || "Pharmacy-uploaded medicine. Verify label and pharmacist guidance before use.",
      prescriptionsRequired: row.prescriptionsRequired,
      temperatureSensitive: row.temperatureSensitive,
    };
  }

  async function publishInventory(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const data = await apiJson<{ medicine: Medicine }>("/api/v1/inventory", {
        method: "POST",
        body: JSON.stringify(inventoryPayload(form)),
      });
      setMedicines((current) => [data.medicine, ...current.filter((item) => item.id !== data.medicine.id)]);
      setForm((current) => ({ ...emptyInventoryForm, pharmacyName: current.pharmacyName }));
      setApiError("");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Unable to publish inventory");
    } finally {
      setBusy(false);
    }
  }

  async function importCsv() {
    const rows = csv
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [pharmacyName, brand, genericSalts, strength, formValue, mrp, stockQty, manufacturer] = line
          .split(",")
          .map((cell) => cell.trim());
        return inventoryPayload({
          ...emptyInventoryForm,
          pharmacyName,
          brand,
          genericSalts,
          strength,
          form: formValue || "Tablet",
          mrp,
          stockQty,
          manufacturer,
        });
      });
    if (!rows.length) return;
    setBusy(true);
    try {
      const data = await apiJson<{ medicines: Medicine[] }>("/api/v1/inventory/bulk", {
        method: "POST",
        body: JSON.stringify({ rows }),
      });
      setMedicines(data.medicines);
      setCsv("");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Bulk import failed");
    } finally {
      setBusy(false);
    }
  }

  async function removeMedicine(id: string) {
    const previous = medicines;
    setMedicines((current) => current.filter((item) => item.id !== id));
    try {
      await apiJson(`/api/v1/inventory/${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch (error) {
      setMedicines(previous);
      setApiError(error instanceof Error ? error.message : "Delete failed");
    }
  }

  function addToCart(id: string) {
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
  }

  async function placeOrder() {
    if (!cartLines.length) return;
    setBusy(true);
    try {
      const data = await apiJson<{ order: Order }>("/api/v1/orders", {
        method: "POST",
        body: JSON.stringify({
          items: cartLines.map((line) => ({ medicineId: line.medicine.id, qty: line.qty })),
          priority: false,
        }),
      });
      setOrders((current) => [data.order, ...current]);
      setCart({});
      await refreshAll();
      setView("orders");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Order failed");
    } finally {
      setBusy(false);
    }
  }

  async function uploadPrescription(fileName: string) {
    if (!fileName.trim()) return;
    const data = await apiJson<{ prescription: Prescription }>("/api/v1/prescriptions", {
      method: "POST",
      body: JSON.stringify({ fileName }),
    });
    setPrescriptions((current) => [data.prescription, ...current]);
  }

  async function sendOtp() {
    setBusy(true);
    setAuthMessage("");
    try {
      const data = await apiJson<{ message: string }>("/api/v1/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ email: authEmail }),
      });
      setAuthMessage(data.message);
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Unable to send OTP");
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp() {
    setBusy(true);
    setAuthMessage("");
    try {
      const data = await apiJson<{ token: string; user: AuthUser }>("/api/v1/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email: authEmail, name: authName, code: authCode }),
      });
      setAuthToken(data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setAuthMessage("Verified. Secure pharmacy session is active.");
      setView("command");
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Verification failed");
    } finally {
      setBusy(false);
    }
  }

  async function askAi() {
    if (!aiQuestion.trim()) return;
    setBusy(true);
    setApiError("");
    try {
      const data = await apiJson<{ answer: string; sources: AiSource[] }>("/api/v1/ai/assistant", {
        method: "POST",
        body: JSON.stringify({ question: aiQuestion }),
      });
      setAiAnswer(data.answer);
      setAiSources(data.sources);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "AI request failed");
    } finally {
      setBusy(false);
    }
  }

  if (!token || !user) {
    return (
      <div className="login-shell">
        <div className="login-hero">
          <div className="brand-lockup login-brand">
            <div className="brand-mark">MR</div>
            <div>
              <strong>MediRush</strong>
              <span>Protected MERN pharmacy network</span>
            </div>
          </div>
          <p className="eyebrow">No login · no entry</p>
          <h1>Secure access before the website opens.</h1>
          <p>
            Every business screen is protected. Inventory, orders, prescriptions, reminders, and marketplace data only
            load after email OTP verification.
          </p>
          <div className="security-list">
            <span>JWT protected API routes</span>
            <span>Email-only OTP delivery</span>
            <span>MongoDB as source of truth</span>
          </div>
          <div className="login-metrics">
            <Metric label="API" value={health?.ok ? "online" : "checking"} />
            <Metric label="Auth method" value="email OTP" />
            <Metric label="Data policy" value="no seeds" />
          </div>
        </div>
        <div className="glass-card auth-card">
          <SectionTitle eyebrow="Email OTP only" title="Sign in to continue" />
          <TextInput label="Name" value={authName} onChange={setAuthName} />
          <TextInput label="Email" value={authEmail} onChange={setAuthEmail} />
          <button className="primary-button" type="button" onClick={() => void sendOtp()} disabled={busy || !authEmail}>
            Send OTP to email
          </button>
          <TextInput label="6-digit OTP from email" value={authCode} onChange={setAuthCode} />
          <button className="secondary-button" type="button" onClick={() => void verifyOtp()} disabled={busy || authCode.length < 6}>
            Verify and enter website
          </button>
          {authMessage && <p className="auth-message">{authMessage}</p>}
          {apiError && <p className="alert">API issue: {apiError}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="app-frame">
      <aside className="side-panel">
        <div className="brand-lockup">
          <div className="brand-mark">MR</div>
          <div>
            <strong>MediRush</strong>
            <span>MERN pharmacy network</span>
          </div>
        </div>
        <nav className="nav-list">
          {[
            ["command", "Command Center", "Live network overview"],
            ["inventory", "Pharmacy Inventory", "Upload and manage stock"],
            ["market", "Customer Marketplace", "Search and checkout"],
            ["orders", "Orders & Fulfilment", "Track delivery flow"],
            ["care", "Care Operations", "Prescriptions and reminders"],
            ["ai", "Gemini AI Copilot", "RAG over live MongoDB data"],
            ["auth", "Email OTP Access", "Session controls"],
          ].map(([id, label, detail], index) => (
            <button key={id} type="button" className={view === id ? "active" : ""} onClick={() => setView(id as View)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{label}</strong>
              <small>{detail}</small>
            </button>
          ))}
        </nav>
        <div className="api-card">
          <span className={health?.ok ? "pulse online" : "pulse"} />
          <div>
            <strong>{health?.ok ? "API online" : "API connecting"}</strong>
            <span>{API_BASE_URL}</span>
          </div>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">No predefined data · MongoDB source of truth</p>
            <h1>{viewMeta[view].title}</h1>
            <p className="topbar-subtitle">{viewMeta[view].subtitle}</p>
          </div>
          <div className="topbar-actions">
            <div className="user-chip">
              <span>{user.name.slice(0, 1).toUpperCase()}</span>
              <div>
                <strong>{user.name}</strong>
                <small>{user.email}</small>
              </div>
            </div>
            <button type="button" className="ghost-button" onClick={() => void refreshAll()}>
              Refresh
            </button>
            <button type="button" className="ghost-button danger" onClick={logout}>
              Sign out
            </button>
          </div>
        </header>

        {apiError && <div className="alert">API issue: {apiError}</div>}

        {view === "command" && (
          <section className="grid-stack">
            <div className="hero-console">
              <div>
                <p className="eyebrow">Enterprise MERN stack</p>
                <h2>Live medicine commerce without seed data.</h2>
                <p>
                  Pharmacies upload their own stock, customers search real inventory, orders persist in MongoDB, and OTP is delivered by email only.
                </p>
                <div className="hero-actions">
                  <button type="button" className="primary-button" onClick={() => setView("inventory")}>
                    Upload inventory
                  </button>
                  <button type="button" className="secondary-button" onClick={() => setView("market")}>
                    Open marketplace
                  </button>
                </div>
              </div>
              <div className="network-orb">
                <span>{stats.uploadedItems}</span>
                <small>uploaded items</small>
              </div>
            </div>

            <div className="metric-grid">
              <Metric label="Uploading pharmacies" value={stats.pharmacies} />
              <Metric label="Stock units" value={stats.stockUnits} />
              <Metric label="Stock value" value={money(stats.stockValue)} />
              <Metric label="Low stock alerts" value={stats.lowStock} />
              <Metric label="Active orders" value={stats.activeOrders} />
              <Metric label="Mongo status" value={health?.mongo ?? "checking"} />
            <Metric label="AI model" value="Gemini" />
            </div>
            <div className="ops-grid">
              <article>
                <span className="pulse online" />
                <div>
                  <strong>Protected route policy</strong>
                  <p>All business APIs require a bearer token from verified email OTP access.</p>
                </div>
              </article>
              <article>
                <span className="pulse online" />
                <div>
                  <strong>Catalogue policy</strong>
                  <p>Customer stock is empty until pharmacies upload records into MongoDB.</p>
                </div>
              </article>
              <article>
                <span className="pulse online" />
                <div>
                  <strong>Fulfilment policy</strong>
                  <p>Checkout validates uploaded stock before creating a real order record.</p>
                </div>
              </article>
            </div>
          </section>
        )}

        {view === "inventory" && (
          <section className="grid-stack">
            <div className="page-banner">
              <div>
                <p className="eyebrow">Inventory control plane</p>
                <h2>Build the live catalogue from pharmacy uploads.</h2>
              </div>
              <Metric label="Uploaded records" value={stats.uploadedItems} />
              <Metric label="Total units" value={stats.stockUnits} />
            </div>
            <div className="split-layout">
            <form className="glass-card form-card" onSubmit={publishInventory}>
              <p className="eyebrow">Pharmacy upload desk</p>
              <h2>Publish real stock</h2>
              <div className="form-grid">
                <TextInput label="Pharmacy name" value={form.pharmacyName} onChange={(v) => updateForm("pharmacyName", v)} />
                <TextInput label="Medicine / tablet name" value={form.brand} onChange={(v) => updateForm("brand", v)} />
                <TextInput label="Salt composition" value={form.genericSalts} onChange={(v) => updateForm("genericSalts", v)} />
                <TextInput label="Strength" value={form.strength} onChange={(v) => updateForm("strength", v)} />
                <TextInput label="Form" value={form.form} onChange={(v) => updateForm("form", v)} />
                <TextInput label="MRP" value={form.mrp} onChange={(v) => updateForm("mrp", v)} />
                <TextInput label="Selling price" value={form.discountedPrice} onChange={(v) => updateForm("discountedPrice", v)} />
                <TextInput label="Manufacturer" value={form.manufacturer} onChange={(v) => updateForm("manufacturer", v)} />
                <TextInput label="Stock quantity" value={form.stockQty} onChange={(v) => updateForm("stockQty", v)} />
                <TextInput label="ETA minutes" value={form.etaMin} onChange={(v) => updateForm("etaMin", v)} />
              </div>
              <label className="field span-all">
                <span>Use / product description</span>
                <textarea value={form.usesSummary} onChange={(event) => updateForm("usesSummary", event.target.value)} />
              </label>
              <div className="toggle-row">
                <label><input type="checkbox" checked={form.prescriptionsRequired} onChange={(e) => updateForm("prescriptionsRequired", e.target.checked)} /> Prescription required</label>
                <label><input type="checkbox" checked={form.temperatureSensitive} onChange={(e) => updateForm("temperatureSensitive", e.target.checked)} /> Cold-chain</label>
              </div>
              <button className="primary-button" type="submit" disabled={busy || !form.pharmacyName || !form.brand || !form.mrp}>
                Publish to Mongo catalogue
              </button>
            </form>

            <div className="glass-card">
              <p className="eyebrow">Bulk upload</p>
              <h2>CSV import</h2>
              <p className="muted">Format: Pharmacy, Brand, Salt, Strength, Form, MRP, Stock, Manufacturer</p>
              <textarea className="csv-box" value={csv} onChange={(e) => setCsv(e.target.value)} placeholder="Pharmacy Name, Brand Name, Salt Name, Strength, Tablet, MRP, Stock, Manufacturer" />
              <button className="secondary-button" type="button" onClick={() => void importCsv()} disabled={busy || !csv.trim()}>
                Import rows
              </button>
              <div className="inventory-list">
                {medicines.slice(0, 8).map((item) => (
                  <article key={item.id}>
                    <div>
                      <strong>{item.brand}</strong>
                      <span>{item.pharmacyName} · {item.stockQty ?? 0} units</span>
                    </div>
                    <button type="button" onClick={() => void removeMedicine(item.id)}>
                      Remove
                    </button>
                  </article>
                ))}
                {medicines.length === 0 && <p className="muted">No Mongo inventory uploaded yet.</p>}
              </div>
            </div>
            </div>
          </section>
        )}

        {view === "market" && (
          <section className="grid-stack">
            <div className="market-toolbar">
              <div>
                <p className="eyebrow">Customer marketplace</p>
                <h2>Search pharmacy-uploaded stock</h2>
              </div>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search brand, salt, pharmacy, manufacturer" />
            </div>
            <div className="market-stats">
              <Metric label="Available items" value={filtered.length} />
              <Metric label="Cart lines" value={cartLines.length} />
              <Metric label="Cart total" value={money(cartTotal)} />
            </div>
            <div className="catalog-grid">
              {filtered.map((item) => (
                <article className="medicine-tile" key={item.id}>
                  <div className="tile-image">{item.form.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <span className="tag">{item.pharmacyName}</span>
                    <h3>{item.brand}</h3>
                    <p>{item.usesSummary}</p>
                    <div className="tile-meta">
                      <strong>{money(item.discountedPrice ?? item.mrp)}</strong>
                      <span>{item.stockQty ?? 0} units</span>
                      <span>{item.etaMin ?? 18} min</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => addToCart(item.id)}>
                    Add
                  </button>
                </article>
              ))}
              {filtered.length === 0 && <EmptyState title="No inventory yet" body="Ask a pharmacy to upload medicines before customers can browse or order." />}
            </div>
            <CartPanel lines={cartLines} total={cartTotal} setCart={setCart} placeOrder={placeOrder} busy={busy} />
          </section>
        )}

        {view === "orders" && (
          <section className="grid-stack">
            <div className="page-banner">
              <SectionTitle eyebrow="Fulfilment cockpit" title="Mongo-backed order stream" />
              <Metric label="Active" value={stats.activeOrders} />
              <Metric label="Total orders" value={orders.length} />
            </div>
            <div className="order-list">
              {orders.map((order) => (
                <article className="order-card" key={order.id}>
                  <div>
                    <span className="tag">{statusLabel(order.status)}</span>
                    <h3>{order.id}</h3>
                    <p>{order.pharmacyName} · ETA {order.etaMin} min · OTP {order.deliveryOtp}</p>
                  </div>
                  <div className="order-items">
                    {order.items.map((item) => (
                      <span key={`${order.id}-${item.medicineId}`}>{item.name} x {item.qty}</span>
                    ))}
                  </div>
                </article>
              ))}
              {orders.length === 0 && <EmptyState title="No orders yet" body="Orders appear after customers checkout using uploaded inventory." />}
            </div>
          </section>
        )}

        {view === "care" && (
          <section className="grid-stack">
            <div className="page-banner">
              <SectionTitle eyebrow="Clinical operations" title="Prescription and reminder workspace" />
              <Metric label="Prescription records" value={prescriptions.length} />
              <Metric label="Reminder source items" value={medicines.length} />
            </div>
          <section className="split-layout">
            <div className="glass-card">
              <SectionTitle eyebrow="Prescription intelligence" title="Upload care documents" />
              <UploadPrescription onUpload={(name) => void uploadPrescription(name)} />
              <div className="record-list">
                {prescriptions.map((rx) => (
                  <article key={rx.id}>
                    <strong>{rx.fileName}</strong>
                    <span>{rx.status}</span>
                  </article>
                ))}
                {prescriptions.length === 0 && <p className="muted">No prescriptions uploaded yet.</p>}
              </div>
            </div>
            <div className="glass-card">
              <SectionTitle eyebrow="Reminder engine" title="Create reminders from real stock" />
              <div className="record-list">
                {medicines.slice(0, 6).map((item) => (
                  <article key={item.id}>
                    <strong>{item.brand}</strong>
                    <span>{item.strength} · {item.stockQty ?? 0} stock</span>
                  </article>
                ))}
                {medicines.length === 0 && <p className="muted">Upload inventory before reminders can be created.</p>}
              </div>
            </div>
          </section>
          </section>
        )}

        {view === "ai" && (
          <section className="grid-stack">
            <div className="ai-hero">
              <div>
                <p className="eyebrow">Gemini API · RAG context</p>
                <h2>Ask grounded questions about your pharmacy operation.</h2>
                <p>
                  The copilot retrieves live MongoDB inventory, orders, prescriptions, and reminders before calling Gemini.
                  It will not invent catalogue data and will ask for missing uploads when context is unavailable.
                </p>
              </div>
              <div className="ai-policy-card">
                <span className="pulse online" />
                <strong>Protected AI endpoint</strong>
                <p>JWT required · Gemini key stays on backend · no client-side AI secrets</p>
              </div>
            </div>

            <div className="ai-workbench">
              <div className="glass-card ai-prompt-card">
                <SectionTitle eyebrow="Ask Gemini" title="RAG assistant" />
                <textarea
                  value={aiQuestion}
                  onChange={(event) => setAiQuestion(event.target.value)}
                  placeholder="Ask about uploaded stock, low inventory, order readiness, prescription workflow, or operational next steps..."
                />
                <button className="primary-button" type="button" onClick={() => void askAi()} disabled={busy || aiQuestion.trim().length < 3}>
                  Ask grounded AI
                </button>
              </div>

              <div className="glass-card ai-answer-card">
                <SectionTitle eyebrow="Gemini response" title="Operational answer" />
                {aiAnswer ? (
                  <pre>{aiAnswer}</pre>
                ) : (
                  <EmptyState title="No AI response yet" body="Ask a question after uploading real inventory or creating operational records." />
                )}
              </div>
            </div>

            <div className="source-grid">
              {[
                ["Inventory", medicines.length],
                ["Orders", orders.length],
                ["Prescriptions", prescriptions.length],
                ["RAG sources used", aiSources.reduce((sum, source) => sum + source.count, 0)],
              ].map(([label, value]) => (
                <Metric key={label} label={String(label)} value={value} />
              ))}
            </div>
          </section>
        )}

        {view === "auth" && (
          <section className="auth-panel">
            <div className="glass-card auth-card">
              <SectionTitle eyebrow="Email OTP only" title="Secure account access" />
              <TextInput label="Name" value={authName} onChange={setAuthName} />
              <TextInput label="Email" value={authEmail} onChange={setAuthEmail} />
              <div className="auth-actions">
                <button className="primary-button" type="button" onClick={() => void sendOtp()} disabled={busy || !authEmail}>
                  Send OTP to email
                </button>
              </div>
              <TextInput label="6-digit OTP from email" value={authCode} onChange={setAuthCode} />
              <button className="secondary-button" type="button" onClick={() => void verifyOtp()} disabled={busy || authCode.length < 6}>
                Verify OTP
              </button>
              {authMessage && <p className="auth-message">{authMessage}</p>}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

function CartPanel({
  lines,
  total,
  setCart,
  placeOrder,
  busy,
}: {
  lines: Array<{ medicine: Medicine; qty: number }>;
  total: number;
  setCart: Dispatch<SetStateAction<Record<string, number>>>;
  placeOrder: () => Promise<void>;
  busy: boolean;
}) {
  return (
    <aside className="cart-panel">
      <div>
        <p className="eyebrow">Smart cart</p>
        <h2>{money(total)}</h2>
      </div>
      {lines.map((line) => (
        <div className="cart-line" key={line.medicine.id}>
          <span>{line.medicine.brand}</span>
          <div>
            <button type="button" onClick={() => setCart((c) => ({ ...c, [line.medicine.id]: Math.max(0, line.qty - 1) }))}>-</button>
            <strong>{line.qty}</strong>
            <button type="button" onClick={() => setCart((c) => ({ ...c, [line.medicine.id]: line.qty + 1 }))}>+</button>
          </div>
        </div>
      ))}
      {lines.length === 0 && <p className="muted">Cart waits for uploaded inventory.</p>}
      <button className="primary-button" type="button" onClick={() => void placeOrder()} disabled={busy || lines.length === 0}>
        Place Mongo order
      </button>
    </aside>
  );
}

function UploadPrescription({ onUpload }: { onUpload: (fileName: string) => void }) {
  const [fileName, setFileName] = useState("");
  return (
    <div className="upload-box">
      <input value={fileName} onChange={(event) => setFileName(event.target.value)} placeholder="Enter uploaded prescription file name" />
      <button type="button" onClick={() => {
        onUpload(fileName);
        setFileName("");
      }}>
        Add record
      </button>
    </div>
  );
}
