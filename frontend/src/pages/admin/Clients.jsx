import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import { Field, Input, Textarea, Button } from "../../components/Field";
import ErrorBanner from "../../components/ErrorBanner";
import * as clientApi from "../../api/client";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
};

export default function Clients() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [viewClient, setViewClient] = useState(null);
  const [search, setSearch] = useState("");

  // =========================
  // GET ALL CLIENTS
  // =========================
  const loadClients = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await clientApi.getAllClients();

      console.log("GET CLIENTS RESPONSE:", res.data);

      // IMPORTANT:
      // Backend returns `clients`, NOT `data`
      setItems(res.data.clients || []);
    } catch (err) {
      console.error("GET CLIENTS ERROR:", err);

      setError(
        err.response?.data?.message ||
        "Failed to load clients."
      );

      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  // =========================
  // OPEN CREATE MODAL
  // =========================
  const openCreate = () => {
    setForm(emptyForm);
    setError("");

    setModal({
      mode: "create",
    });
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================
  const openEdit = (client) => {
    setForm({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
      address: client.address || "",
      notes: client.notes || "",
    });

    setError("");

    setModal({
      mode: "edit",
      id: client._id,
    });
  };

  // =========================
  // INPUT CHANGE
  // =========================
  const update = (key) => (e) => {
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  // =========================
  // CREATE / UPDATE
  // =========================
  const submit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      console.log("CLIENT BODY:", form);

      if (modal.mode === "create") {
        const res = await clientApi.createClient(form);

        console.log("CREATE CLIENT RESPONSE:", res.data);
      } else {
        const res = await clientApi.updateClient(
          modal.id,
          form
        );

        console.log("UPDATE CLIENT RESPONSE:", res.data);
      }

      // Close modal
      setModal(null);

      // Clear form
      setForm(emptyForm);

      // Reload clients
      await loadClients();

    } catch (err) {
      console.error("SAVE CLIENT ERROR:", err);

      setError(
        err.response?.data?.message ||
        "Couldn't save client."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE CLIENT
  // =========================
  const remove = async () => {
    if (!confirmDelete?._id) return;

    try {
      setError("");

      const res = await clientApi.deleteClient(
        confirmDelete._id
      );

      console.log("DELETE CLIENT RESPONSE:", res.data);

      setConfirmDelete(null);

      await loadClients();

    } catch (err) {
      console.error("DELETE CLIENT ERROR:", err);

      setError(
        err.response?.data?.message ||
        "Failed to delete client."
      );
    }
  };

  // =========================
  // SEARCH
  // =========================
  const filtered = items.filter((client) => {
    const text = [
      client.name,
      client.email,
      client.phone,
      client.address,
    ]
      .join(" ")
      .toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <AdminLayout title="Clients">

      {/* =========================
          TOP BAR
      ========================= */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients..."
          className="max-w-xs"
        />

        <Button onClick={openCreate}>
          + Add client
        </Button>

      </div>

      {/* =========================
          ERROR
      ========================= */}
      {error && !modal && (
        <div className="mb-4">
          <ErrorBanner message={error} />
        </div>
      )}

      {/* =========================
          CLIENT LIST
      ========================= */}
      {loading ? (
        <Loader />

      ) : filtered.length === 0 ? (

        <EmptyState
          title={
            search
              ? "No clients found"
              : "No clients yet"
          }
          subtitle={
            search
              ? "Try another search."
              : "Add your first client to start booking events for them."
          }
        />

      ) : (

        <div className="overflow-hidden rounded-2xl bg-softwhite shadow-sm ring-1 ring-espresso/5">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px] text-left text-sm">

              <thead className="bg-beige/40 text-xs uppercase tracking-wide text-espresso/60">

                <tr>

                  <th className="px-5 py-3">
                    Name
                  </th>

                  <th className="px-5 py-3">
                    Contact
                  </th>

                  <th className="px-5 py-3">
                    Address
                  </th>

                  <th className="px-5 py-3">
                    Notes
                  </th>

                  <th className="px-5 py-3 text-right">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-espresso/10">

                {filtered.map((client) => (

                  <tr
                    key={client._id}
                    className="hover:bg-beige/20"
                  >

                    <td className="px-5 py-4 font-medium text-espresso">
                      {client.name}
                    </td>

                    <td className="px-5 py-4 text-espresso/80">

                      <p>
                        {client.email}
                      </p>

                      <p className="text-xs text-espresso/50">
                        {client.phone}
                      </p>

                    </td>

                    <td className="px-5 py-4 text-espresso/70">
                      {client.address || "—"}
                    </td>

                    <td className="px-5 py-4 text-espresso/70">
                      {client.notes || "—"}
                    </td>

                    <td className="px-5 py-4 text-right">

                      <button
                        onClick={() =>
                          setViewClient(client)
                        }
                        className="mr-4 text-espresso/70 hover:underline"
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          openEdit(client)
                        }
                        className="mr-4 text-terracotta hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          setConfirmDelete(client)
                        }
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

      {/* =========================
          CREATE / EDIT MODAL
      ========================= */}
      <Modal
        open={!!modal}
        onClose={() => {
          if (!saving) {
            setModal(null);
            setError("");
          }
        }}
        title={
          modal?.mode === "create"
            ? "Add client"
            : "Edit client"
        }
      >

        <form
          onSubmit={submit}
          className="space-y-4"
        >

          <ErrorBanner message={error} />

          {/* NAME */}
          <Field label="Name">

            <Input
              required
              value={form.name}
              onChange={update("name")}
              placeholder="Client name"
            />

          </Field>

          {/* EMAIL */}
          <Field label="Email">

            <Input
              type="email"
              required
              value={form.email}
              onChange={update("email")}
              placeholder="client@gmail.com"
            />

          </Field>

          {/* PHONE */}
          <Field label="Phone">

            <Input
              required
              value={form.phone}
              onChange={update("phone")}
              placeholder="9876543210"
            />

          </Field>

          {/* ADDRESS */}
          <Field label="Address">

            <Input
              value={form.address}
              onChange={update("address")}
              placeholder="Client address"
            />

          </Field>

          {/* NOTES */}
          <Field label="Notes">

            <Textarea
              rows={3}
              value={form.notes}
              onChange={update("notes")}
              placeholder="Notes about client"
            />

          </Field>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-2">

            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => setModal(null)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : modal?.mode === "create"
                  ? "Save client"
                  : "Update client"}
            </Button>

          </div>

        </form>

      </Modal>

      {/* =========================
          VIEW CLIENT MODAL
      ========================= */}
      <Modal
        open={!!viewClient}
        onClose={() => setViewClient(null)}
        title="Client details"
      >

        <div className="space-y-4 text-sm">

          <div>
            <p className="text-xs uppercase tracking-wide text-espresso/50">
              Name
            </p>
            <p className="mt-1 text-espresso">
              {viewClient?.name || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-espresso/50">
              Email
            </p>
            <p className="mt-1 text-espresso">
              {viewClient?.email || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-espresso/50">
              Phone
            </p>
            <p className="mt-1 text-espresso">
              {viewClient?.phone || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-espresso/50">
              Address
            </p>
            <p className="mt-1 text-espresso">
              {viewClient?.address || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-espresso/50">
              Notes
            </p>
            <p className="mt-1 whitespace-pre-wrap text-espresso">
              {viewClient?.notes || "—"}
            </p>
          </div>

        </div>

        <div className="mt-6 flex justify-end gap-3">

          <Button
            variant="outline"
            onClick={() => setViewClient(null)}
          >
            Close
          </Button>

          <Button
            onClick={() => {
              openEdit(viewClient);
              setViewClient(null);
            }}
          >
            Edit
          </Button>

        </div>

      </Modal>

      {/* =========================
          DELETE CONFIRMATION
      ========================= */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete client"
      >

        <p className="text-sm text-espresso/70">

          Delete{" "}

          <strong>
            {confirmDelete?.name}
          </strong>

          ? This can't be undone.

        </p>

        <div className="mt-6 flex justify-end gap-3">

          <Button
            variant="outline"
            onClick={() =>
              setConfirmDelete(null)
            }
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