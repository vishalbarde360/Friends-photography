import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import { Field, Select, Button } from "../../components/Field";
import ErrorBanner from "../../components/ErrorBanner";
import * as photoApi from "../../api/photo";
import * as eventApi from "../../api/event";
import * as albumApi from "../../api/album";

export default function Photos() {
  const [items, setItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEvent, setFilterEvent] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadEvent, setUploadEvent] = useState("");
  const [uploadAlbum, setUploadAlbum] = useState("");
  const [uploadAlbums, setUploadAlbums] = useState([]);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([photoApi.getAllPhotos(), eventApi.getAllEvents()])
      .then(([p, e]) => {
        setItems(p.data.data || []);
        setEvents(e.data.data || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openUpload = () => {
    setUploadEvent(events[0]?._id || "");
    setFiles([]);
    setError("");
    setUploadOpen(true);
  };

  useEffect(() => {
    if (!uploadEvent) {
      setUploadAlbums([]);
      return;
    }
    albumApi.getEventAlbums(uploadEvent).then((res) => {
      const list = res.data.data || [];
      setUploadAlbums(list);
      setUploadAlbum(list[0]?._id || "");
    });
  }, [uploadEvent]);

  const submitUpload = async (e) => {
    e.preventDefault();
    if (!uploadAlbum) {
      setError("Create an album for this event first.");
      return;
    }
    if (files.length === 0) {
      setError("Choose at least one photo.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("eventId", uploadEvent);
      fd.append("albumId", uploadAlbum);
      files.forEach((f) => fd.append("photos", f));
      await photoApi.uploadPhotos(fd);
      setUploadOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const remove = async () => {
    await photoApi.deletePhoto(confirmDelete._id);
    setConfirmDelete(null);
    load();
  };

  const filtered = filterEvent ? items.filter((p) => (p.eventId?._id || p.eventId) === filterEvent) : items;

  return (
    <AdminLayout title="Photos">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Select value={filterEvent} onChange={(e) => setFilterEvent(e.target.value)} className="max-w-xs">
          <option value="">All events</option>
          {events.map((e) => (
            <option key={e._id} value={e._id}>{e.title}</option>
          ))}
        </Select>
        <Button onClick={openUpload} disabled={events.length === 0}>+ Upload photos</Button>
      </div>
      {events.length === 0 && !loading && (
        <p className="mb-4 text-sm text-espresso/60">Create an event and album first before uploading photos.</p>
      )}

      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <EmptyState title="No photos yet" subtitle="Upload photos to an event's album to populate the client gallery." />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((p) => (
            <div key={p._id} className="group relative aspect-square overflow-hidden rounded-xl bg-beige">
              <img
                src={p.thumbnailUrl || p.imageUrl}
                alt={p.originalFilename || ""}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => setConfirmDelete(p)}
                className="absolute right-2 top-2 rounded-full bg-espresso/70 px-2.5 py-1 text-xs text-softwhite opacity-0 transition group-hover:opacity-100"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload photos" wide>
        <form onSubmit={submitUpload} className="space-y-4">
          <ErrorBanner message={error} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Event">
              <Select required value={uploadEvent} onChange={(e) => setUploadEvent(e.target.value)}>
                {events.map((e) => (
                  <option key={e._id} value={e._id}>{e.title}</option>
                ))}
              </Select>
            </Field>
            <Field label="Album">
              <Select required value={uploadAlbum} onChange={(e) => setUploadAlbum(e.target.value)}>
                {uploadAlbums.length === 0 && <option value="">No albums for this event</option>}
                {uploadAlbums.map((a) => (
                  <option key={a._id} value={a._id}>{a.name}</option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Photos">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="block w-full text-sm text-espresso/70 file:mr-4 file:rounded-full file:border-0 file:bg-espresso file:px-4 file:py-2 file:text-sm file:text-softwhite hover:file:bg-terracotta"
            />
            {files.length > 0 && (
              <p className="mt-2 text-xs text-espresso/50">{files.length} file(s) selected</p>
            )}
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={uploading}>{uploading ? "Uploading…" : "Upload"}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete photo">
        <p className="text-sm text-espresso/70">
          Delete this photo? It will also be removed from Cloudinary and the client gallery.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button variant="danger" onClick={remove}>Delete</Button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
