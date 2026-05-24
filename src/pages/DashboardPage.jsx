import React, { useMemo, useState, useEffect } from "react";
import {
  ShieldCheck,
  Plus,
  Search,
  Import,
  Download,
  LogOut,
  User,
  Tag,
  KeyRound,
  Server,
  Database,
  BriefcaseBusiness,
  UserCircle2,
  FolderKanban,
  Trash2,
  Eye,
  EyeOff,
  User2, Pencil,

  // ADD THESE
  Cloud,
  Globe,
  Code2,
  Boxes,
  LockKeyhole,
} from "lucide-react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const TAGS = [
  { label: "All", icon: FolderKanban },

  // Infrastructure
  { label: "Servers", icon: Server },
  { label: "Databases", icon: Database },
  { label: "Hosting", icon: Globe },

  // Engineering
  { label: "Development", icon: Code2 },
  { label: "APIs", icon: Boxes },

  // Services
  { label: "Cloud Services", icon: Cloud },
  { label: "Subscriptions", icon: Tag },

  // Accounts
  { label: "Personal", icon: UserCircle2 },
  { label: "Work", icon: BriefcaseBusiness },
  { label: "Clients", icon: User },

  // Security
  { label: "Admin Panels", icon: LockKeyhole },

  // Misc
  { label: "Other", icon: Tag },
];

const DB_NAME = "AasPassVault";
const STORE_NAME = "credentials";

export default function DashboardPage() {
  const [selectedTag, setSelectedTag] = useState("All");
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    username: "",
    email: "",
    password: "",
    website: "",
    ipAddress: "",
    link: "",

    databaseType: "",
    databaseUsername: "",
    databasePassword: "",
    port: "",

    notes: "",
    backupDetails: "",

    tag: "Servers",
  });

  const [credentials, setCredentials] = useState([]);

  // Initialize IndexedDB
  const initDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  };

  // Load credentials from IndexedDB
  const loadCredentials = async () => {
    try {
      const db = await initDB();
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        setCredentials(request.result || []);
        setIsLoading(false);
      };
    } catch (error) {
      console.error("Failed to load credentials:", error);
      setIsLoading(false);
    }
  };

  // Save credential to IndexedDB
  const saveToDB = async (credential) => {
    try {
      const db = await initDB();
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      store.put(credential);
    } catch (error) {
      console.error("Failed to save credential:", error);
    }
  };

  // Delete from IndexedDB
  const deleteFromDB = async (id) => {
    try {
      const db = await initDB();
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      store.delete(id);
    } catch (error) {
      console.error("Failed to delete credential:", error);
    }
  };

  // Export to JSON
  const exportToJSON = () => {
    if (credentials.length === 0) {
      alert("No credentials to export!");
      return;
    }

    const dataStr = JSON.stringify(credentials, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = `AasPass_Vault_${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Import from JSON
  const importFromJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedCredentials = JSON.parse(e.target.result);

        if (!Array.isArray(importedCredentials)) {
          alert("Invalid JSON format. Expected an array of credentials.");
          return;
        }

        // Validate and add
        const validCredentials = importedCredentials.filter(cred =>
          cred.id && cred.title && cred.username && cred.password
        );

        if (validCredentials.length === 0) {
          alert("No valid credentials found in the file.");
          return;
        }

        setCredentials((prev) => {
          const combined = [...validCredentials, ...prev];
          // Remove duplicates by id
          const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
          return unique;
        });

        // Save all to IndexedDB
        validCredentials.forEach(cred => saveToDB(cred));

        alert(`Successfully imported ${validCredentials.length} credentials!`);
      } catch (err) {
        alert("Failed to import file. Please select a valid JSON file.");
      }
    };
    reader.readAsText(file);
    event.target.value = ""; // Reset input
  };

  // Load data on mount
  useEffect(() => {
    loadCredentials();
  }, []);

  // Filtered Credentials
  const filteredCredentials = useMemo(() => {
    return credentials.filter((item) => {
      const matchesTag = selectedTag === "All" ? true : item.tag === selectedTag;
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.username.toLowerCase().includes(search.toLowerCase()) ||
        (item.website && item.website.toLowerCase().includes(search.toLowerCase()));

      return matchesTag && matchesSearch;
    });
  }, [credentials, selectedTag, search]);

  const handleCreateCredential = () => {
    if (!formData.title || !formData.password) {
      alert("Please fill all required fields.");
      return;
    }

    // EDIT MODE
    if (isEditing) {
      const updatedCredential = {
        ...formData,
        id: editingId,
        createdAt:
          credentials.find((c) => c.id === editingId)?.createdAt ||
          new Date().toISOString(),
      };

      setCredentials((prev) =>
        prev.map((item) =>
          item.id === editingId ? updatedCredential : item
        )
      );

      saveToDB(updatedCredential);

      setIsEditing(false);
      setEditingId(null);

      alert("Credential updated successfully!");
    }

    // CREATE MODE
    else {
      const newCredential = {
        id: `AAP-${Date.now()}`,

        title: formData.title,
        username: formData.username,
        email: formData.email,
        password: formData.password,

        website: formData.website,
        ipAddress: formData.ipAddress,
        link: formData.link,

        databaseType: formData.databaseType,
        databaseUsername: formData.databaseUsername,
        databasePassword: formData.databasePassword,
        port: formData.port,

        notes: formData.notes,
        backupDetails: formData.backupDetails,

        tag: formData.tag,

        createdAt: new Date().toISOString(),
      };

      setCredentials((prev) => [newCredential, ...prev]);

      saveToDB(newCredential);

      alert("Credential created successfully!");
    }

    // RESET FORM
    setFormData({
      title: "",
      username: "",
      email: "",
      password: "",
      website: "",
      ipAddress: "",
      link: "",

      databaseType: "",
      databaseUsername: "",
      databasePassword: "",
      port: "",

      notes: "",
      backupDetails: "",

      tag: "Servers",
    });

    setOpenDialog(false);
  };;


  const handleEditCredential = (credential) => {
    setFormData({
      title: credential.title || "",
      username: credential.username || "",
      email: credential.email || "",
      password: credential.password || "",

      website: credential.website || "",
      ipAddress: credential.ipAddress || "",
      link: credential.link || "",

      databaseType: credential.databaseType || "",
      databaseUsername: credential.databaseUsername || "",
      databasePassword: credential.databasePassword || "",
      port: credential.port || "",

      notes: credential.notes || "",
      backupDetails: credential.backupDetails || "",

      tag: credential.tag || "Servers",
    });

    setEditingId(credential.id);
    setIsEditing(true);

    setOpenDialog(true);
  };

  const handleDeleteCredential = (credentialId) => {
    if (!window.confirm("Are you sure you want to delete this credential?")) return;

    setCredentials((prev) => prev.filter((item) => item.id !== credentialId));
    deleteFromDB(credentialId);
  };

  const handleLogout = () => {
    if (credentials.length > 0) {
      const confirm = window.confirm("Export vault before logging out?");
      if (confirm) exportToJSON();
    }

    // Clear IndexedDB
    indexedDB.deleteDatabase(DB_NAME);

    localStorage.removeItem("isAuthenticated");
    window.location.reload();
  };


  const exportToPDF = () => {
    if (!filteredCredentials.length) {
      alert("No data to export");
      return;
    }

    const doc = new jsPDF("landscape");

    doc.setFontSize(16);
    doc.text("AasPass Credential Vault", 14, 15);

    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
    const tableData = filteredCredentials.map((item, index) => [
      index + 1,
      item.title,
      item.id,
      item.username || "-",
      item.email || "-",
      item.website || "-",
      item.databaseType || "-",
      item.databaseUsername || "-",
      item.ipAddress || "-",
      item.tag || "-",
      item.password || "-",   // ✅ REAL PASSWORD HERE
      new Date(item.createdAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      startY: 30,
      head: [[
        "#",
        "Title",
        "ID",
        "Username",
        "Email",
        "Website",
        "DB",
        "DB User",
        "IP",
        "Tag",
        "Password",
        "Created",
      ]],
      body: tableData,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [20, 20, 20],
        textColor: 255,
      },
      alternateRowStyles: {
        fillColor: [245, 247, 251],
      },
    });

    doc.save(`AasPass_Vault_${Date.now()}.pdf`);
  };
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#111827] overflow-hidden">
      {/* Background Decor */}
      <div className="pointer-events-none fixed top-0 left-0 w-[500px] h-[500px] bg-blue-400/10 blur-3xl rounded-full" />

      <div className="pointer-events-none fixed bottom-0 right-0 w-[500px] h-[500px] bg-emerald-400/10 blur-3xl rounded-full" />

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/30 backdrop-blur-2xl">
        <div className="px-4 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-black/5 shadow-sm flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">AasPass</h1>
              <p className="text-xs text-neutral-500">Local Secure Credential Vault</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="hidden sm:flex items-center gap-2 px-4 h-11 rounded-xl bg-black text-white text-sm font-semibold hover:opacity-90"
              onClick={() => setOpenDialog(true)}
            >
              <Plus size={16} /> Create Credential
            </button>

            <label className="hidden md:flex items-center gap-2 px-4 h-11 rounded-xl border border-black/10 bg-white text-sm hover:bg-neutral-50 shadow-sm transition-all cursor-pointer">
              <Import size={16} /> Import
              <input
                type="file"
                accept=".json"
                onChange={importFromJSON}
                className="hidden"
              />
            </label>

            <button
              onClick={exportToJSON}
              className="hidden md:flex items-center gap-2 px-4 h-11 rounded-xl border border-black/10 bg-white text-sm hover:bg-neutral-50 shadow-sm transition-all"
            >
              <Download size={16} /> Export
            </button>

            <button
              onClick={exportToPDF}
              className="hidden md:flex items-center gap-2 px-4 h-11 rounded-xl border border-black/10 bg-white text-sm hover:bg-neutral-50 shadow-sm transition-all"
            >
              Print / PDF
            </button>
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-4 h-11 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm hover:bg-red-100 transition-all"
            >
              <LogOut size={16} /> Logout
            </button>

            <div className="flex items-center gap-3 pl-2">
              <div className="w-11 h-11 rounded-2xl bg-white border border-black/5 shadow-sm flex items-center justify-center">
                <User size={18} />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium">Administrator</div>
                <div className="text-xs text-neutral-500">admin@aaspass.local</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* SIDEBAR */}
        <aside className="hidden lg:block w-[280px] border-r border-black/5 bg-white min-h-[calc(100vh-80px)] p-6">
          <div className="mb-8">
            <div className="text-xs uppercase tracking-[0.25em] text-neutral-500 mb-4">
              Credential Tags
            </div>

            <div className="space-y-2">
              {TAGS.map((tag) => {
                const Icon = tag.icon;

                const count =
                  tag.label === "All"
                    ? credentials.length
                    : credentials.filter((c) => c.tag === tag.label).length;

                return (
                  <button
                    key={tag.label}
                    onClick={() => setSelectedTag(tag.label)}
                    className={`w-full h-12 rounded-2xl px-4 flex items-center justify-between gap-3 transition-all text-sm border ${selectedTag === tag.label
                      ? "bg-black text-white border-black shadow-md"
                      : "bg-white border-black/5 hover:bg-neutral-50 text-neutral-700 shadow-sm"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} />
                      <span>{tag.label}</span>
                    </div>

                    <div
                      className={`text-xs px-2 py-1 rounded-full ${selectedTag === tag.label
                        ? "bg-white/20 text-white"
                        : "bg-neutral-100 text-neutral-600"
                        }`}
                    >
                      {count}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Security Card */}
          <div className="rounded-3xl border border-black/5 bg-white shadow-sm p-5 text-xs text-neutral-500">
            <div className="uppercase tracking-widest text-neutral-500 mb-3">
              Security Notice
            </div>

            <p className="leading-relaxed text-neutral-600">
              All data is stored locally in your browser using IndexedDB.
            </p>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 lg:p-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
                Credential Dashboard
              </h2>

              <p className="text-sm text-neutral-500 mt-1">
                Securely manage infrastructure, database, and application credentials.
              </p>
            </div>

            <div className="relative w-full lg:w-[320px]">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
              />

              <input
                type="text"
                placeholder="Search credentials..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 text-sm outline-none focus:border-white/20 transition-all"
              />
            </div>
          </div>

          {/* Mobile Tags */}
          <div className="lg:hidden flex gap-2 overflow-auto mb-5 pb-1">
            {TAGS.map((tag) => {
              const Icon = tag.icon;

              return (
                <button
                  key={tag.label}
                  onClick={() => setSelectedTag(tag.label)}
                  className={`flex items-center gap-2 px-3 h-10 whitespace-nowrap rounded-xl text-xs border transition-all ${selectedTag === tag.label
                    ? "bg-black text-white border-white"
                    : "bg-white/5 border-white/10 text-white hover:bg-neutral-50 shadow-sm"
                    }`}
                >
                  <Icon size={13} />
                  {tag.label}
                </button>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">

            {[
              {
                label: "Total",
                value: credentials.length,
              },
              {
                label: "Category",
                value: selectedTag,
              },
              {
                label: "Results",
                value: filteredCredentials.length,
              },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-xl border border-black/10 bg-white px-4 py-3 flex items-center justify-between shadow-sm"
              >
                {/* Left */}
                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                    {card.label}
                  </div>

                  <div className="text-sm font-semibold text-black">
                    {card.value}
                  </div>
                </div>

                {/* Right indicator dot */}
                <div className="w-2 h-2 rounded-full bg-black/20" />
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
            {/* Table Header */}
            <div className="border-b border-white/10 px-5 h-14 flex items-center justify-between">
              <h3 className="font-medium text-sm tracking-wide">
                Stored Credentials
              </h3>

              <div className="text-xs text-neutral-500">
                {filteredCredentials.length} entries
              </div>
            </div>

            <div className="overflow-auto">
              <table className="w-full min-w-[1200px]">
                {/* HEADER */}
                <thead>
                  <tr className="border-b border-black/5 text-left text-[11px] uppercase tracking-[0.16em] text-neutral-500 bg-white">
                    <th className="px-5 py-3 font-medium">Title</th>
                    <th className="px-5 py-3 font-medium">Credential ID</th>
                    <th className="px-5 py-3 font-medium">Username</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Database</th>
                    <th className="px-5 py-3 font-medium">DB Username</th>
                    <th className="px-5 py-3 font-medium">Host IP</th>
                    <th className="px-5 py-3 font-medium">Tag</th>
                    <th className="px-5 py-3 font-medium">Password</th>
                    <th className="px-5 py-3 font-medium">Created</th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>

                {/* BODY */}
                <tbody className="bg-white">
                  {filteredCredentials.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-black/[0.04] hover:bg-neutral-50 transition-all"
                    >
                      {/* TITLE */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 min-w-[220px]">
                          <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-black/5 flex items-center justify-center shrink-0">
                            <KeyRound size={15} className="text-neutral-700" />
                          </div>

                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate text-neutral-900">
                              {item.title}
                            </div>

                            {item.website && (
                              <div className="text-[11px] text-neutral-500 truncate mt-0.5">
                                {item.website}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* ID */}
                      <td className="px-5 py-4">
                        <div className="text-[12px] font-mono text-neutral-500 whitespace-nowrap">
                          {item.id}
                        </div>
                      </td>

                      {/* USERNAME */}
                      <td className="px-5 py-4">
                        <div className="text-sm text-neutral-700 max-w-[160px] truncate">
                          {item.username || "—"}
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td className="px-5 py-4">
                        <div className="text-sm text-neutral-500 max-w-[220px] truncate">
                          {item.email || "—"}
                        </div>
                      </td>

                      {/* DATABASE */}
                      <td className="px-5 py-4">
                        {item.databaseType ? (
                          <div className="inline-flex items-center px-2.5 h-7 rounded-full bg-blue-50 border border-blue-200 text-[11px] text-blue-700 whitespace-nowrap">
                            {item.databaseType}
                          </div>
                        ) : (
                          <span className="text-neutral-400 text-sm">—</span>
                        )}
                      </td>

                      {/* DB USERNAME */}
                      <td className="px-5 py-4">
                        <div className="text-sm text-neutral-700 max-w-[140px] truncate">
                          {item.databaseUsername || "—"}
                        </div>
                      </td>

                      {/* HOST IP */}
                      <td className="px-5 py-4">
                        <div className="text-sm text-neutral-500 whitespace-nowrap">
                          {item.ipAddress || "—"}
                        </div>
                      </td>

                      {/* TAG */}
                      <td className="px-5 py-4">
                        <div className="inline-flex items-center px-2.5 h-7 rounded-full bg-neutral-100 border border-black/5 text-[11px] text-neutral-700 whitespace-nowrap">
                          {item.tag}
                        </div>
                      </td>

                      {/* PASSWORD */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono tracking-wider truncate max-w-[140px] text-neutral-700">
                            {showPassword ? item.password : "••••••••"}
                          </span>

                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-neutral-400 hover:text-neutral-700 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff size={15} />
                            ) : (
                              <Eye size={15} />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* CREATED */}
                      <td className="px-5 py-4">
                        <div className="text-sm text-neutral-500 whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* VIEW */}
                          <button
                            onClick={() => {
                              setSelectedCredential(item);
                              setShowDetailsModal(true);
                            }}
                            className="h-9 px-4 rounded-xl border border-black/10 bg-white text-xs text-neutral-700 hover:bg-neutral-50 transition-all shadow-sm"
                          >
                            View
                          </button>

                          {/* EDIT */}
                          <button
                            onClick={() => handleEditCredential(item)}
                            className="w-9 h-9 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all flex items-center justify-center"
                          >
                            <Pencil size={15} />
                          </button>

                          {/* DELETE */}
                          <button
                            onClick={() => handleDeleteCredential(item.id)}
                            className="w-9 h-9 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all flex items-center justify-center"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Create Dialog */}
      {openDialog && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-black/10 bg-white shadow-2xl overflow-hidden">

            {/* HEADER */}
            <div className="border-b border-black/5 px-6 py-5 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-2xl font-black text-neutral-900">
                  {isEditing ? "Edit Credential" : "Create New Credential"}
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  All data stays in your browser.
                </p>
              </div>

              <button
                onClick={() => {
                  setOpenDialog(false);
                  setIsEditing(false);
                  setEditingId(null);
                }}
                className="text-3xl text-neutral-400 hover:text-neutral-700"
              >
                ×
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-auto bg-white">

              {/* BASIC DETAILS */}
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-neutral-400 mb-4">
                  Basic Details
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {[
                    {
                      label: "Website / Server Name",
                      value: formData.title,
                      placeholder: "Production API Server",
                      key: "title",
                    },
                    {
                      label: "Username (optional)",
                      value: formData.username,
                      placeholder: "admin",
                      key: "username",
                    },
                    {
                      label: "Email (optional)",
                      value: formData.email,
                      placeholder: "admin@example.com",
                      key: "email",
                      type: "email",
                    },
                    {
                      label: "Password",
                      value: formData.password,
                      placeholder: "••••••••",
                      key: "password",
                    },
                    {
                      label: "Website / Host",
                      value: formData.website,
                      placeholder: "api.example.com",
                      key: "website",
                    },
                    {
                      label: "IP Address (optional)",
                      value: formData.ipAddress,
                      placeholder: "192.168.1.10",
                      key: "ipAddress",
                    },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="text-xs text-neutral-500 mb-2 block">
                        {field.label}
                      </label>

                      <input
                        type={field.type || "text"}
                        value={field.value}
                        onChange={(e) =>
                          setFormData({ ...formData, [field.key]: e.target.value })
                        }
                        placeholder={field.placeholder}
                        className="w-full h-11 rounded-xl bg-neutral-50 border border-black/10 px-4 text-sm outline-none focus:border-black/20 transition-all"
                      />
                    </div>
                  ))}

                  {/* LINK */}
                  <div className="md:col-span-2">
                    <label className="text-xs text-neutral-500 mb-2 block">
                      Link (optional)
                    </label>

                    <input
                      type="text"
                      value={formData.link}
                      onChange={(e) =>
                        setFormData({ ...formData, link: e.target.value })
                      }
                      placeholder="https://dashboard.example.com"
                      className="w-full h-11 rounded-xl bg-neutral-50 border border-black/10 px-4 text-sm outline-none focus:border-black/20"
                    />
                  </div>
                </div>
              </div>

              {/* DATABASE DETAILS */}
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-neutral-400 mb-4">
                  Database Details
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* DB TYPE */}
                  <div>
                    <label className="text-xs text-neutral-500 mb-2 block">
                      Database Type
                    </label>

                    <select
                      value={formData.databaseType}
                      onChange={(e) =>
                        setFormData({ ...formData, databaseType: e.target.value })
                      }
                      className="w-full h-11 rounded-xl bg-neutral-50 border border-black/10 px-4 text-sm outline-none focus:border-black/20"
                    >
                      <option value="">Select Database</option>
                      <option value="MongoDB">MongoDB</option>
                      <option value="MySQL">MySQL</option>
                      <option value="MSSQL">MSSQL</option>
                    </select>
                  </div>

                  {/* PORT */}
                  <div>
                    <label className="text-xs text-neutral-500 mb-2 block">
                      Port (optional)
                    </label>

                    <input
                      type="text"
                      value={formData.port}
                      onChange={(e) =>
                        setFormData({ ...formData, port: e.target.value })
                      }
                      placeholder="3306"
                      className="w-full h-11 rounded-xl bg-neutral-50 border border-black/10 px-4 text-sm outline-none focus:border-black/20"
                    />
                  </div>

                  {/* DB USER */}
                  <div>
                    <label className="text-xs text-neutral-500 mb-2 block">
                      Database Username
                    </label>

                    <input
                      type="text"
                      value={formData.databaseUsername}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          databaseUsername: e.target.value,
                        })
                      }
                      placeholder="root"
                      className="w-full h-11 rounded-xl bg-neutral-50 border border-black/10 px-4 text-sm outline-none focus:border-black/20"
                    />
                  </div>

                  {/* DB PASSWORD */}
                  <div>
                    <label className="text-xs text-neutral-500 mb-2 block">
                      Database Password
                    </label>

                    <input
                      type="text"
                      value={formData.databasePassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          databasePassword: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      className="w-full h-11 rounded-xl bg-neutral-50 border border-black/10 px-4 text-sm outline-none focus:border-black/20"
                    />
                  </div>

                  {/* NOTES */}
                  <div className="md:col-span-2">
                    <label className="text-xs text-neutral-500 mb-2 block">
                      Notes
                    </label>

                    <textarea
                      rows={4}
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Additional notes..."
                      className="w-full rounded-xl bg-neutral-50 border border-black/10 px-4 py-3 text-sm outline-none focus:border-black/20 resize-none"
                    />
                  </div>

                  {/* BACKUP */}
                  <div className="md:col-span-2">
                    <label className="text-xs text-neutral-500 mb-2 block">
                      Backup Details
                    </label>

                    <textarea
                      rows={4}
                      value={formData.backupDetails}
                      onChange={(e) =>
                        setFormData({ ...formData, backupDetails: e.target.value })
                      }
                      placeholder="Backup information..."
                      className="w-full rounded-xl bg-neutral-50 border border-black/10 px-4 py-3 text-sm outline-none focus:border-black/20 resize-none"
                    />
                  </div>

                  {/* TAG */}
                  <div className="md:col-span-2">
                    <label className="text-xs text-neutral-500 mb-2 block">
                      Tag
                    </label>

                    <select
                      value={formData.tag}
                      onChange={(e) =>
                        setFormData({ ...formData, tag: e.target.value })
                      }
                      className="w-full h-11 rounded-xl bg-neutral-50 border border-black/10 px-4 text-sm outline-none focus:border-black/20"
                    >
                      <option value="Servers">Servers</option>
                      <option value="Databases">Databases</option>
                      <option value="Hosting">Hosting</option>
                      <option value="Development">Development</option>
                      <option value="APIs">APIs</option>
                      <option value="Cloud Services">Cloud Services</option>
                      <option value="Subscriptions">Subscriptions</option>
                      <option value="Personal">Personal</option>
                      <option value="Work">Work</option>
                      <option value="Clients">Clients</option>
                      <option value="Admin Panels">Admin Panels</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="border-t border-black/5 p-5 flex items-center justify-end gap-3 bg-white">
              <button
                onClick={() => setOpenDialog(false)}
                className="h-10 px-5 rounded-xl border border-black/10 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-all"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateCredential}
                className="h-10 px-5 rounded-xl bg-black text-white text-sm font-semibold hover:opacity-90 transition-all"
              >
                {isEditing ? "Update Credential" : "Save Credential"}
              </button>
            </div>

          </div>
        </div>
      )}


      {showDetailsModal && selectedCredential && (
        <div className="fixed inset-0 z-[120] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-3xl rounded-3xl border border-black/10 bg-white shadow-2xl overflow-hidden">

            {/* HEADER */}
            <div className="border-b border-black/10 px-6 py-5 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-xl font-bold text-black">
                  {selectedCredential.title}
                </h2>

                <p className="text-sm text-neutral-500 mt-1">
                  Credential Details
                </p>
              </div>

              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-3xl text-neutral-500 hover:text-black transition"
              >
                ×
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[70vh] overflow-auto bg-white">

              {[
                ["Username", selectedCredential.username],
                ["Email", selectedCredential.email],
                ["Password", selectedCredential.password],
                ["Website", selectedCredential.website],
                ["IP Address", selectedCredential.ipAddress],
                ["Link", selectedCredential.link],
                ["Database", selectedCredential.databaseType],
                ["DB Username", selectedCredential.databaseUsername],
                ["DB Password", selectedCredential.databasePassword],
                ["Port", selectedCredential.port],
                ["Notes", selectedCredential.notes],
                ["Backup Details", selectedCredential.backupDetails],
                ["Tag", selectedCredential.tag],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm"
                >
                  <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-2">
                    {label}
                  </div>

                  <div className="text-sm whitespace-pre-wrap break-words text-neutral-800 leading-relaxed">
                    {value || "—"}
                  </div>
                </div>
              ))}

            </div>

            {/* FOOTER */}
            <div className="border-t border-black/10 p-5 flex justify-end bg-white">

              <button
                onClick={() => setShowDetailsModal(false)}
                className="h-10 px-5 rounded-xl bg-black text-white text-sm font-semibold hover:opacity-90 transition"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}