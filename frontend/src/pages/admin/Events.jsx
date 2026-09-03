import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import StatusPill from "../../components/StatusPill";
import { Field, Input, Select, Button } from "../../components/Field";
import ErrorBanner from "../../components/ErrorBanner";
import * as eventApi from "../../api/event";
import * as clientApi from "../../api/client";

const eventTypes = [
  "Wedding",
  "Pre-Wedding",
  "Birthday",
  "Corporate",
  "Events",
  "Other",
];

const statuses = [
  "Upcoming",
  "Ongoing",
  "Completed",
  "Cancelled",
];

const empty = {
  clientId: "",
  title: "",
  eventType: "Wedding",
  eventDate: "",
  location: "",
  package: "",
  status: "Upcoming",
};

export default function Events() {
  const [items, setItems] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const [eventResponse, clientResponse] = await Promise.all([
        eventApi.getAllEvents(),
        clientApi.getAllClients(),
      ]);

      setItems(eventResponse.data?.data || []);
      setClients(clientResponse.data?.clients || []);
    } catch (err) {
      console.error("LOAD EVENTS ERROR:", err);

      setError(
        err.response?.data?.message ||
        "Couldn't load events/clients."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm({
      ...empty,
      clientId: clients[0]?._id || "",
    });

    setError("");
    setModal({ mode: "create" });
  };

  const openEdit = (item) => {
    setForm({
      clientId: item.clientId?._id || item.clientId || "",
      title: item.title || "",
      eventType: item.eventType || "Wedding",
      eventDate: item.eventDate
        ? item.eventDate.slice(0, 10)
        : "",
      location: item.location || "",
      package: item.package || "",
      status: item.status || "Upcoming",
    });

    setError("");
    setModal({
      mode: "edit",
      id: item._id,
    });
  };

  const update = (key) => (e) => {
    setForm((f) => ({
      ...f,
      [key]: e.target.value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      if (!form.clientId) {
        setError("Please select a client.");
        setSaving(false);
        return;
      }

      if (!form.title.trim()) {
        setError("Event title is required.");
        setSaving(false);
        return;
      }

      if (!form.eventDate) {
        setError("Event date is required.");
        setSaving(false);
        return;
      }

      if (!form.location.trim()) {
        setError("Event location is required.");
        setSaving(false);
        return;
      }

      if (modal.mode === "create") {
        await eventApi.createEvent(form);
      } else {
        await eventApi.updateEvent(modal.id, form);
      }

      setModal(null);
      setForm(empty);

      await load();
    } catch (err) {
      console.error("SAVE EVENT ERROR:", err);

      setError(
        err.response?.data?.message ||
        "Couldn't save event."
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirmDelete?._id) return;

    try {
      setError("");

      await eventApi.deleteEvent(confirmDelete._id);

      setConfirmDelete(null);

      await load();
    } catch (err) {
      console.error("DELETE EVENT ERROR:", err);

      setError(
        err.response?.data?.message ||
        "Couldn't delete event."
      );

      setConfirmDelete(null);
    }
  };

  return (
    <AdminLayout title="Events">

      <div className="mb-5 flex justify-end">
        <Button
          onClick={openCreate}
          disabled={clients.length === 0}
        >
          + Add event
        </Button>
      </div>

      {!loading && error && (
        <ErrorBanner message={error} />
      )}

      {clients.length === 0 &&
        !loading &&
        !error && (
          <p className="mb-4 text-sm text-espresso/60">
            Add a client first before creating an event.
          </p>
        )}

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState
          title="No events yet"
          subtitle="Create an event to start organising albums and photos for a client."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-softwhite shadow-sm ring-1 ring-espresso/5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">

              <thead className="bg-beige/40 text-xs uppercase tracking-wide text-espresso/60">
                <tr>
                  <th className="px-5 py-3">Event</th>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Gallery</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-espresso/10">
                {items.map((ev) => (
                  <tr
                    key={ev._id}
                    className="hover:bg-beige/20"
                  >

                    <td className="px-5 py-3.5">
                      <p className="font-medium text-espresso">
                        {ev.title}
                      </p>

                      <p className="text-xs text-espresso/50">
                        {ev.eventType} · {ev.location}
                      </p>
                    </td>

                    <td className="px-5 py-3.5 text-espresso/80">
                      {ev.clientId?.name || "—"}
                    </td>

                    <td className="px-5 py-3.5 text-espresso/80">
                      {ev.eventDate
                        ? new Date(
                          ev.eventDate
                        ).toLocaleDateString("en-IN")
                        : "—"}
                    </td>

                    <td className="px-5 py-3.5">
                      <StatusPill
                        status={ev.status || "Upcoming"}
                      />
                    </td>

                    <td className="px-5 py-3.5">
                      <StatusPill
                        status={ev.galleryStatus || "Draft"}
                      />
                    </td>

                    <td className="px-5 py-3.5 text-right">

                      <Link
                        to="/admin/galleries"
                        className="mr-3 text-mocha hover:underline"
                      >
                        Gallery
                      </Link>

                      <button
                        onClick={() => openEdit(ev)}
                        className="mr-3 text-terracotta hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setConfirmDelete(ev)}
                        className="text-red-500 hover:underline"
                      >
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

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={
          modal?.mode === "create"
            ? "Add event"
            : "Edit event"
        }
        wide
      >

        <form
          onSubmit={submit}
          className="space-y-4"
        >

          <ErrorBanner message={error} />

          <div className="grid gap-4 sm:grid-cols-2">

            <Field label="Client">
              <Select
                required
                value={form.clientId}
                onChange={update("clientId")}
              >
                <option value="">
                  Select client
                </option>

                {clients.map((c) => (
                  <option
                    key={c._id}
                    value={c._id}
                  >
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Event type">
              <Select
                required
                value={form.eventType}
                onChange={update("eventType")}
              >
                {eventTypes.map((t) => (
                  <option
                    key={t}
                    value={t}
                  >
                    {t}
                  </option>
                ))}
              </Select>
            </Field>

          </div>

          <Field label="Title">
            <Input
              required
              value={form.title}
              onChange={update("title")}
              placeholder="e.g. Rhea & Arjun's Wedding"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">

            <Field label="Event date">
              <Input
                type="date"
                required
                value={form.eventDate}
                onChange={update("eventDate")}
              />
            </Field>

            <Field label="Location">
              <Input
                required
                value={form.location}
                onChange={update("location")}
              />
            </Field>

          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <Field label="Package">
              <Input
                value={form.package}
                onChange={update("package")}
                placeholder="e.g. Premium — 2 day coverage"
              />
            </Field>

            <Field label="Status">
              <Select
                value={form.status}
                onChange={update("status")}
              >
                {statuses.map((s) => (
                  <option
                    key={s}
                    value={s}
                  >
                    {s}
                  </option>
                ))}
              </Select>
            </Field>

          </div>

          <div className="flex justify-end gap-3 pt-2">

            <Button
              type="button"
              variant="outline"
              onClick={() => setModal(null)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save"}
            </Button>

          </div>

        </form>

      </Modal>

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete event"
      >

        <p className="text-sm text-espresso/70">
          Delete{" "}
          <strong>{confirmDelete?.title}</strong>?
          Albums and photos linked to it may become orphaned.
        </p>

        <div className="mt-6 flex justify-end gap-3">

          <Button
            variant="outline"
            onClick={() => setConfirmDelete(null)}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={remove}
          >
            Delete
          </Button>

        </div>

      </Modal>

    </AdminLayout>
  );
}