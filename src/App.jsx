import React, { useEffect, useMemo, useState } from "react";

const CATEGORIES = [
  { id: "general", label: "General Feedback" },
  { id: "academic", label: "Academic" },
  { id: "facilities", label: "Facilities" },
  { id: "technical", label: "Technical" },
  { id: "hr", label: "HR" },
];

const PRIORITY = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
];

const STATUS = [
  { id: "open", label: "Open" },
  { id: "in_progress", label: "In Progress" },
  { id: "resolved", label: "Resolved" },
  { id: "closed", label: "Closed" },
];

const STORAGE_KEY = "og_app_state_v3";
const uid = () => Math.random().toString(36).slice(2, 10);
const nowISO = () => new Date().toISOString();

const defaultState = {
  users: [], 
  tickets: [],
  sessionUserId: null,
};

function saveState(s) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch (e) {
    console.warn("saveState failed", e);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed };
  } catch (e) {
    console.warn("loadState failed, resetting", e);
    return defaultState;
  }
}


export default function App() {
  const [state, setState] = useState(loadState);

  useEffect(() => saveState(state), [state]);

  const currentUser = state.users.find((u) => u.id === state.sessionUserId) || null;

  function register({ name, username, password, role }) {
    
    const uname = (username || "").trim().toLowerCase();
    if (!uname || !password || password.length < 4) {
      alert("Enter a username and a 4+ character password.");
      return;
    }
    if (state.users.some((u) => u.username.toLowerCase() === uname)) {
      alert("Username already exists.");
      return;
    }
    const user = { id: uid(), name: name?.trim() || uname.split("@")[0], username: uname, password, role };
    setState((s) => ({ ...s, users: [...s.users, user], sessionUserId: user.id }));
  }

  function login({ username, password }) {
    const uname = (username || "").trim().toLowerCase();
    const user = state.users.find((u) => u.username.toLowerCase() === uname && u.password === password);
    if (!user) {
      alert("Invalid credentials");
      return;
    }
    setState((s) => ({ ...s, sessionUserId: user.id }));
  }

  function logout() {
    setState((s) => ({ ...s, sessionUserId: null }));
  }

  function createTicket(payload) {
    const t = {
      id: uid(),
      createdAt: nowISO(),
      updatedAt: nowISO(),
      status: "open",
      comments: [],
      assigneeId: null,
      ...payload,
    };
    setState((s) => ({ ...s, tickets: [t, ...s.tickets] }));
  }

  function updateTicket(id, patch) {
    setState((s) => ({
      ...s,
      tickets: s.tickets.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: nowISO() } : t)),
    }));
  }

 
  useEffect(() => {
    if (state.users.length === 0) {
      const seeded = { id: uid(), name: "Admin", username: "admin", password: "admin", role: "admin" };
      setState((s) => ({ ...s, users: [seeded], sessionUserId: seeded.id }));
    }
    
  }, []);

  if (!currentUser) {
    return <AuthScreen onLogin={login} onRegister={register} usersCount={state.users.length} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <TopNav currentUser={currentUser} onLogout={logout} />
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <Hero />
        {currentUser.role === "admin" ? (
          <AdminArea
            tickets={state.tickets}
            users={state.users}
            onUpdate={updateTicket}
          />
        ) : (
          <UserArea
            users={state.users}
            onCreate={createTicket}
            tickets={state.tickets}
            currentUser={currentUser}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}


function AuthScreen({ onLogin, onRegister, usersCount }) {
  const [mode, setMode] = useState(usersCount > 0 ? "login" : "register");
  const [f, setF] = useState({ name: "", username: "", password: "", role: "user" });

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 ring-1 ring-slate-200 shadow-xl">
        <h1 className="text-2xl font-bold">{mode === "login" ? "Welcome back" : "Create account"}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {mode === "login"
            ? "Login to submit or manage grievances."
            : "Register as User or Admin for this demo app."}
        </p>

        {mode === "register" && (
          <div className="mt-4">
            <label className="text-sm font-medium">Name</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 p-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
              placeholder="Your name"
            />
          </div>
        )}

        <div className="mt-3">
          <label className="text-sm font-medium">Username</label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 p-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={f.username}
            onChange={(e) => setF({ ...f, username: e.target.value })}
            placeholder="e.g. email or a handle"
          />
        </div>

        <div className="mt-3">
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border border-slate-200 p-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={f.password}
            onChange={(e) => setF({ ...f, password: e.target.value })}
            placeholder="Min 4 characters"
          />
        </div>

        {mode === "register" && (
          <div className="mt-3">
            <label className="text-sm font-medium">Role</label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 p-2"
              value={f.role}
              onChange={(e) => setF({ ...f, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}

        <button
          className="mt-5 w-full rounded-xl bg-blue-600 py-2 text-white shadow hover:bg-blue-700"
          onClick={() => (mode === "login" ? onLogin(f) : onRegister(f))}
        >
          {mode === "login" ? "Login" : "Register"}
        </button>

        <div className="mt-3 text-center text-sm">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button className="text-blue-700 underline" onClick={() => setMode("register")}>
                Register
              </button>
            </>
          ) : (
            <>
              Already registered?{" "}
              <button className="text-blue-700 underline" onClick={() => setMode("login")}>
                Login
              </button>
            </>
          )}
        </div>

        {usersCount === 0 && (
          <p className="mt-3 text-xs text-slate-500">
            Tip: First account you create can be an Admin to manage tickets.
          </p>
        )}
      </div>
    </div>
  );
}


function TopNav({ currentUser, onLogout }) {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-blue-600/10 ring-1 ring-blue-600/20">
            <span className="text-sm font-bold text-blue-700">OG</span>
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Online Feedback & Grievance</h1>
          <span className="hidden text-sm text-slate-500 sm:inline">— Transparent. Fast. Accountable.</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span>
            Logged in as <b>{currentUser.name}</b> ({currentUser.role})
          </span>
          <button className="rounded-xl border border-slate-200 px-3 py-1.5 hover:bg-slate-50" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mb-6 rounded-3xl bg-gradient-to-r from-blue-50 to-teal-50 p-6 ring-1 ring-slate-200">
      <div className="grid items-center gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold leading-tight md:text-3xl">
            One place for feedback & grievances
          </h2>
          <p className="mt-2 text-slate-600">
            Submit, track, and resolve issues with full transparency. Admins triage quickly with
            smart filters and status workflows.
          </p>
          <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
            <li>Status flow: Open → In Progress → Resolved → Closed</li>
            <li>Categories, priorities, attachments, assignees</li>
            <li>Local persistence. API‑ready architecture.</li>
          </ul>
        </div>
        <StatsCard />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-10 border-t bg-white">
      <div className="mx-auto max-w-7xl p-4 text-center text-xs text-slate-500">
        Built for hackathons — swap to real APIs & auth later.
      </div>
    </footer>
  );
}


function UserArea({ users, onCreate, tickets, currentUser }) {
  const myTickets = tickets.filter((t) => t.createdBy?.id === currentUser.id);
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <NewTicketCard users={users} onCreate={onCreate} currentUser={currentUser} />
      </div>
      <div className="lg:col-span-2">
        <TicketList title="My Tickets" tickets={myTickets} showOwner={false} />
      </div>
    </div>
  );
}

function NewTicketCard({ users, onCreate, currentUser }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: CATEGORIES[0].id,
    priority: PRIORITY[1].id,
    attachment: null,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      priority: form.priority,
      attachment: form.attachment,
      createdBy: { id: currentUser.id, name: currentUser.name },
    };
    onCreate(payload);
    setForm({ ...form, title: "", description: "", attachment: null });
  };

  return (
    <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
      <h3 className="text-lg font-semibold">Submit New</h3>
      <p className="mt-1 text-sm text-slate-600">Create a ticket for feedback or grievance.</p>

      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="text-sm font-medium">Title</label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 p-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Short summary"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            className="mt-1 w-full rounded-xl border border-slate-200 p-2 outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What happened? Include details, steps, evidence."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 p-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Priority</label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 p-2"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              {PRIORITY.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Attachment (optional)</label>
          <input
            type="file"
            className="mt-1 w-full rounded-xl border border-slate-200 p-2"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return setForm({ ...form, attachment: null });
              const url = URL.createObjectURL(file);
              setForm({ ...form, attachment: { name: file.name, url } });
            }}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 py-2 text-white shadow hover:bg-blue-700"
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
}

function TicketList({ title, tickets, showOwner = true }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [stat, setStat] = useState("all");
  const [sortBy, setSortBy] = useState("new");

  const filtered = useMemo(() => {
    let list = tickets.filter((t) =>
      [t.title, t.description].join(" ").toLowerCase().includes(q.toLowerCase())
    );
    if (cat !== "all") list = list.filter((t) => t.category === cat);
    if (stat !== "all") list = list.filter((t) => t.status === stat);

    return list.sort((a, b) => {
      if (sortBy === "new") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "priority") return priorityRank(b.priority) - priorityRank(a.priority);
      return 0;
    });
  }, [tickets, q, cat, stat, sortBy]);

  return (
    <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-slate-600">{filtered.length} result(s)</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <input
            className="rounded-xl border border-slate-200 p-2"
            placeholder="Search..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select className="rounded-xl border border-slate-200 p-2" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <select className="rounded-xl border border-slate-200 p-2" value={stat} onChange={(e) => setStat(e.target.value)}>
            <option value="all">All Status</option>
            {STATUS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          <select className="rounded-xl border border-slate-200 p-2" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="new">Newest</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      <div className="grid gap-3">
        {filtered.map((t) => (
          <TicketRow key={t.id} t={t} showOwner={showOwner} />
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
            No tickets yet.
          </div>
        )}
      </div>
    </div>
  );
}

function TicketRow({ t, showOwner }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <StatusPill status={t.status} />
          <PriorityPill priority={t.priority} />
          <span className="truncate font-medium">{t.title}</span>
        </div>
        <div className="mt-1 text-sm text-slate-600">{t.description}</div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="rounded-lg bg-slate-100 px-2 py-0.5">{catLabel(t.category)}</span>
          <span>Created: {new Date(t.createdAt).toLocaleString()}</span>
          {showOwner && t.createdBy && <span>By: {t.createdBy.name}</span>}
          {t.attachment && (
            <a className="underline" href={t.attachment.url} target="_blank" rel="noreferrer">
              Attachment: {t.attachment.name}
            </a>
          )}
        </div>
      </div>
      {t.assigneeId && (
        <div className="text-xs text-slate-600">Assigned to: {t.assigneeId}</div>
      )}
    </div>
  );
}


function AdminArea({ tickets, users, onUpdate }) {
  const groups = useMemo(() => {
    const byStatus = { open: [], in_progress: [], resolved: [], closed: [] };
    tickets.forEach((t) => byStatus[t.status]?.push(t));
    return byStatus;
  }, [tickets]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(groups).map(([status, list]) => (
          <div key={status} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-semibold capitalize">{status.replace("_", " ")}</h4>
              <span className="text-xs text-slate-500">{list.length}</span>
            </div>
            <div className="grid gap-2">
              {list.map((t) => (
                <AdminCard key={t.id} t={t} users={users} onUpdate={onUpdate} />)
              )}
              {list.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-200 p-3 text-center text-xs text-slate-500">
                  Empty
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Analytics tickets={tickets} />
    </div>
  );
}

function AdminCard({ t, users, onUpdate }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <PriorityPill priority={t.priority} />
            <span className="truncate font-medium">{t.title}</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">{catLabel(t.category)} • {new Date(t.createdAt).toLocaleString()}</div>
        </div>
        <select
          className="rounded-lg border border-slate-200 p-1 text-sm"
          value={t.status}
          onChange={(e) => onUpdate(t.id, { status: e.target.value })}
        >
          {STATUS.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <select
          className="rounded-lg border border-slate-200 p-2 text-sm"
          value={t.assigneeId || ""}
          onChange={(e) => onUpdate(t.id, { assigneeId: e.target.value || null })}
        >
          <option value="">Unassigned</option>
          {users.filter((u) => u.role === "admin").map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <select
          className="rounded-lg border border-slate-200 p-2 text-sm"
          value={t.priority}
          onChange={(e) => onUpdate(t.id, { priority: e.target.value })}
        >
          {PRIORITY.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
      </div>

      {t.attachment && (
        <a className="mt-2 inline-block text-xs text-blue-600 underline" href={t.attachment.url} target="_blank" rel="noreferrer">
          View attachment: {t.attachment.name}
        </a>
      )}
    </div>
  );
}

function Analytics({ tickets }) {
  const totals = tickets.length;
  const byStatus = countBy(tickets, (t) => t.status);
  const byCategory = countBy(tickets, (t) => t.category);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatBox label="Total Tickets" value={totals} />
      <StatBox label="Open" value={byStatus.open || 0} />
      <StatBox label="Resolved" value={byStatus.resolved || 0} />

      <div className="md:col-span-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
        <h4 className="mb-2 font-semibold">By Category</h4>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          {Object.entries(byCategory).map(([k, v]) => (
            <div key={k} className="rounded-xl border border-slate-200 p-3 text-sm">
              <div className="font-medium">{catLabel(k)}</div>
              <div className="text-2xl font-bold">{v}</div>
            </div>
          ))}
          {Object.keys(byCategory).length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
              No data yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function StatsCard() {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-xs text-slate-500">Avg. First Response</div>
          <div className="text-2xl font-semibold">&lt; 24h</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Resolution Rate</div>
          <div className="text-2xl font-semibold">92%</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">CSAT</div>
          <div className="text-2xl font-semibold">4.6★</div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    open: "bg-rose-50 text-rose-700 ring-rose-200",
    in_progress: "bg-amber-50 text-amber-700 ring-amber-200",
    resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    closed: "bg-slate-100 text-slate-700 ring-slate-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ring-1 ${map[status]}`}>
      ● {status.replace("_", " ")}
    </span>
  );
}

function PriorityPill({ priority }) {
  const map = {
    low: "bg-slate-100 text-slate-700 ring-slate-200",
    medium: "bg-blue-50 text-blue-700 ring-blue-200",
    high: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ring-1 ${map[priority]}`}>
      ▲ {priority}
    </span>
  );
}


function catLabel(id) {
  return CATEGORIES.find((c) => c.id === id)?.label || id;
}

function countBy(arr, fn) {
  return arr.reduce((acc, x) => {
    const k = fn(x);
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}

function priorityRank(p) {
  return p === "high" ? 3 : p === "medium" ? 2 : 1;
}