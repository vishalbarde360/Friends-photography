import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import { Field, Input, Textarea, Select, Button } from "../../components/Field";
import ErrorBanner from "../../components/ErrorBanner";
import * as albumApi from "../../api/album";
import * as eventApi from "../../api/event";

const empty = { eventId: "", name: "", description: "" };

export default function Albums() {
  const [items, setItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filterEvent, setFilterEvent] = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([albumApi.getAllAlbums(), eventApi.getAllEvents()])
      .then(([a, e]) => {
        setItems(a.data.data || []);
        setEvents(e.data.data || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setForm({ ...empty, eventId: events[0]?._id || "" });
    setError("");
    setModal({ mode: "create" });
  };

  const openEdit = (item) => {
    setForm({
      eventId: item.eventId?._id || item.eventId || "",
      name: item.name,
      description: item.description || "",
    });
    setError("");
    setModal({ mode: "edit", id: item._id });
  };

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (modal.mode === "create") await albumApi.createAlbum(form);
      else await albumApi.updateAlbum(modal.id, form);
      setModal(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save album.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    await albumApi.deleteAlbum(confirmDelete._id);
    setConfirmDelete(null);
    load();
  };

  const filtered = filterEvent ? items.filter((a) => (a.eventId?._id || a.eventId) === filterEvent) : items;

  return (
    <AdminLayout title="Albums">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Select value={filterEvent} onChange={(e) => setFilterEvent(e.target.value)} className="max-w-xs">
          <option value="">All events</option>
          {events.map((e) => (
            <option key={e._id} value={e._id}>{e.title}</option>
          ))}
        </Select>
        <Button onClick={openCreate} disabled={events.length === 0}>+ Add album</Button>
      </div>
      {events.length === 0 && !loading && (
        <p className="mb-4 text-sm text-espresso/60">Create an event first before adding albums.</p>
      )}

      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <EmptyState title="No albums yet" subtitle="Group an event's photos into albums, e.g. Ceremony, Reception." />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-softwhite shadow-sm ring-1 ring-espresso/5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-beige/40 text-xs uppercase tracking-wide text-espresso/60">
                <tr>
                  <th className="px-5 py-3">Album</th>
                  <th className="px-5 py-3">Event</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/10">
                {filtered.map((a) => (
                  <tr key={a._id} className="hover:bg-beige/20">
                    <td className="px-5 py-3.5 font-medium text-espresso">{a.name}</td>
                    <td className="px-5 py-3.5 text-espresso/80">{a.eventId?.title || "—"}</td>
                    <td className="px-5 py-3.5 text-espresso/70">{a.description || "—"}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => openEdit(a)} className="mr-3 text-terracotta hover:underline">Edit</button>
                      <button onClick={() => setConfirmDelete(a)} className="text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === "create" ? "Add album" : "Edit album"}>
        <form onSubmit={submit} className="space-y-4">
          <ErrorBanner message={error} />
          <Field label="Event">
            <Select required value={form.eventId} onChange={update("eventId")}>
              {events.map((e) => (
                <option key={e._id} value={e._id}>{e.title}</option>
              ))}
            </Select>
          </Field>
          <Field label="Album name">
            <Input required value={form.name} onChange={update("name")} placeholder="e.g. Ceremony" />
          </Field>
          <Field label="Description">
            <Textarea rows={3} value={form.description} onChange={update("description")} />
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModal(null)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete album">
        <p className="text-sm text-espresso/70">
          Delete <strong>{confirmDelete?.name}</strong>? This can't be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button variant="danger" onClick={remove}>Delete</Button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
