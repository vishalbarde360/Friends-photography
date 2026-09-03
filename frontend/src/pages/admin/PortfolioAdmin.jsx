import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import { Field, Input, Textarea, Select, Button } from "../../components/Field";
import ErrorBanner from "../../components/ErrorBanner";
import * as portfolioApi from "../../api/portfolio";

const categories = ["Wedding", "Pre-Wedding", "Birthday", "Corporate", "Events", "Other"];
const emptyText = { title: "", description: "", category: "Wedding", eventDate: "", location: "" };

export default function PortfolioAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyText);
  const [coverImage, setCoverImage] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = () => {
    setLoading(true);
    portfolioApi
      .getAllPortfolios()
      .then((res) => setItems(res.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setForm(emptyText);
    setCoverImage(null);
    setImages([]);
    setError("");
    setModal({ mode: "create" });
  };

  const openEdit = (item) => {
    setForm({
      title: item.title,
      description: item.description,
      category: item.category,
      eventDate: item.eventDate ? item.eventDate.slice(0, 10) : "",
      location: item.location,
    });
    setCoverImage(null);
    setImages([]);
    setError("");
    setModal({ mode: "edit", id: item._id });
  };

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (modal.mode === "create" && !coverImage) {
      setError("A cover image is required.");
      return;
    }
    if (modal.mode === "create" && images.length === 0) {
      setError("At least one gallery image is required.");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (coverImage) fd.append("coverImage", coverImage);
      images.forEach((f) => fd.append("images", f));

      if (modal.mode === "create") await portfolioApi.createPortfolio(fd);
      else await portfolioApi.updatePortfolio(modal.id, fd);

      setModal(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save portfolio piece.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    await portfolioApi.deletePortfolio(confirmDelete._id);
    setConfirmDelete(null);
    load();
  };

  return (
    <AdminLayout title="Portfolio">
      <div className="mb-5 flex justify-end">
        <Button onClick={openCreate}>+ Add portfolio piece</Button>
      </div>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState title="No portfolio pieces yet" subtitle="Publish your best work to showcase it on the public site." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <div key={p._id} className="overflow-hidden rounded-2xl bg-softwhite shadow-sm ring-1 ring-espresso/5">
              <div className="aspect-[4/3] bg-beige">
                <img src={p.coverImage} alt={p.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <p className="text-[11px] uppercase tracking-wide2 text-terracotta">{p.category}</p>
                <p className="mt-1 font-display text-lg text-espresso">{p.title}</p>
                <p className="mt-1 text-xs text-espresso/55">{p.location}</p>
                <div className="mt-3 flex gap-3 text-sm">
                  <button onClick={() => openEdit(p)} className="text-terracotta hover:underline">Edit</button>
                  <button onClick={() => setConfirmDelete(p)} className="text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === "create" ? "Add portfolio piece" : "Edit portfolio piece"}
        wide
      >
        <form onSubmit={submit} className="space-y-4">
          <ErrorBanner message={error} />
          <Field label="Title">
            <Input required value={form.title} onChange={update("title")} />
          </Field>
          <Field label="Description">
            <Textarea rows={3} required value={form.description} onChange={update("description")} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Category">
              <Select required value={form.category} onChange={update("category")}>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Event date">
              <Input type="date" required value={form.eventDate} onChange={update("eventDate")} />
            </Field>
            <Field label="Location">
              <Input required value={form.location} onChange={update("location")} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={`Cover image${modal?.mode === "edit" ? " (leave empty to keep current)" : ""}`}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                className="block w-full text-sm text-espresso/70 file:mr-4 file:rounded-full file:border-0 file:bg-espresso file:px-4 file:py-2 file:text-sm file:text-softwhite hover:file:bg-terracotta"
              />
            </Field>
            <Field label={`Gallery images${modal?.mode === "edit" ? " (adds to existing)" : ""}`}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(Array.from(e.target.files || []))}
                className="block w-full text-sm text-espresso/70 file:mr-4 file:rounded-full file:border-0 file:bg-espresso file:px-4 file:py-2 file:text-sm file:text-softwhite hover:file:bg-terracotta"
              />
            </Field>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModal(null)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete portfolio piece">
        <p className="text-sm text-espresso/70">
          Delete <strong>{confirmDelete?.title}</strong>? Its images will also be removed from Cloudinary.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button variant="danger" onClick={remove}>Delete</Button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
