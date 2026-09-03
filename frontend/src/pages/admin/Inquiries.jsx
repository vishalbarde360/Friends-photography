import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import StatusPill from "../../components/StatusPill";
import { Field, Select, Button } from "../../components/Field";
import * as inquiryApi from "../../api/inquiry";

const statuses = ["New", "Contacted", "Discussion", "Confirmed", "Rejected", "Completed"];

export default function Inquiries() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [status, setStatus] = useState("New");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = () => {
    setLoading(true);
    inquiryApi
      .getAllInquiries()
      .then((res) => setItems(res.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openDetail = (item) => {
    setActive(item);
    setStatus(item.status);
  };

  const saveStatus = async () => {
    setSaving(true);
    try {
      await inquiryApi.updateInquiry(active._id, { status });
      setActive(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    await inquiryApi.deleteInquiry(confirmDelete._id);
    setConfirmDelete(null);
    load();
  };

  return (
    <AdminLayout title="Inquiries">
      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState title="No enquiries yet" subtitle="New enquiries submitted from the contact form will appear here." />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-softwhite shadow-sm ring-1 ring-espresso/5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-beige/40 text-xs uppercase tracking-wide text-espresso/60">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Event</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/10">
                {items.map((i) => (
                  <tr key={i._id} className="hover:bg-beige/20">
                    <td className="cursor-pointer px-5 py-3.5" onClick={() => openDetail(i)}>
                      <p className="font-medium text-espresso">{i.name}</p>
                      <p className="text-xs text-espresso/50">{i.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-espresso/80">{i.eventType}</td>
                    <td className="px-5 py-3.5 text-espresso/80">
                      {i.eventDate ? new Date(i.eventDate).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-espresso/80">{i.location}</td>
                    <td className="px-5 py-3.5">
                      <StatusPill status={i.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => openDetail(i)} className="mr-3 text-terracotta hover:underline">
                        View
                      </button>
                      <button onClick={() => setConfirmDelete(i)} className="text-red-500 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.name} wide>
        {active && (
          <div className="space-y-4">
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <p><span className="text-espresso/50">Email:</span> {active.email}</p>
              <p><span className="text-espresso/50">Phone:</span> {active.phone}</p>
              <p><span className="text-espresso/50">Event type:</span> {active.eventType}</p>
              <p><span className="text-espresso/50">Event date:</span> {active.eventDate ? new Date(active.eventDate).toLocaleDateString("en-IN") : "—"}</p>
              <p><span className="text-espresso/50">Location:</span> {active.location}</p>
              <p><span className="text-espresso/50">Budget:</span> {active.budget}</p>
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide2 text-espresso/50">Message</p>
              <p className="rounded-lg bg-beige/30 p-3 text-sm text-espresso/80">{active.message}</p>
            </div>
            <Field label="Update status">
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </Field>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setActive(null)}>Cancel</Button>
              <Button onClick={saveStatus} disabled={saving}>{saving ? "Saving…" : "Save status"}</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete enquiry">
        <p className="text-sm text-espresso/70">
          Delete the enquiry from <strong>{confirmDelete?.name}</strong>? This can't be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button variant="danger" onClick={remove}>Delete</Button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
