import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import StatusPill from "../../components/StatusPill";
import { Button } from "../../components/Field";
import ErrorBanner from "../../components/ErrorBanner";
import * as eventApi from "../../api/event";
import * as galleryApi from "../../api/gallery";

export default function Galleries() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [qr, setQr] = useState(null); // { galleryUrl, qrCode }

  const load = () => {
    setLoading(true);
    eventApi
      .getAllEvents()
      .then((res) => setEvents(res.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const withBusy = async (id, fn) => {
    setBusyId(id);
    setError("");
    try {
      await fn();
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setBusyId(null);
    }
  };

  const generateToken = (ev) => withBusy(ev._id, () => galleryApi.generateGalleryToken(ev._id));
  const publish = (ev) => withBusy(ev._id, () => galleryApi.publishGallery(ev._id));
  const unpublish = (ev) => withBusy(ev._id, () => galleryApi.unpublishGallery(ev._id));

  const showQr = async (ev) => {
    setBusyId(ev._id);
    setError("");
    try {
      const res = await galleryApi.getGalleryQr(ev._id);
      setQr(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Publish the gallery before generating a QR code.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AdminLayout title="Client galleries">
      <ErrorBanner message={error} />

      {loading ? (
        <Loader />
      ) : (
        <div className="mt-4 overflow-hidden rounded-2xl bg-softwhite shadow-sm ring-1 ring-espresso/5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-beige/40 text-xs uppercase tracking-wide text-espresso/60">
                <tr>
                  <th className="px-5 py-3">Event</th>
                  <th className="px-5 py-3">Gallery status</th>
                  <th className="px-5 py-3">Token</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/10">
                {events.map((ev) => (
                  <tr key={ev._id} className="hover:bg-beige/20">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-espresso">{ev.title}</p>
                      <p className="text-xs text-espresso/50">{ev.eventType} · {ev.location}</p>
                    </td>
                    <td className="px-5 py-3.5"><StatusPill status={ev.galleryStatus} /></td>
                    <td className="px-5 py-3.5">
                      {ev.galleryToken ? (
                        <code className="rounded bg-beige/50 px-2 py-1 text-xs text-espresso/70">
                          {ev.galleryToken.slice(0, 10)}…
                        </code>
                      ) : (
                        <span className="text-xs text-espresso/40">Not generated</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap justify-end gap-3 text-sm">
                        {!ev.galleryToken ? (
                          <button disabled={busyId === ev._id} onClick={() => generateToken(ev)} className="text-terracotta hover:underline disabled:opacity-50">
                            Generate token
                          </button>
                        ) : ev.galleryStatus === "Published" ? (
                          <button disabled={busyId === ev._id} onClick={() => unpublish(ev)} className="text-mocha hover:underline disabled:opacity-50">
                            Unpublish
                          </button>
                        ) : (
                          <button disabled={busyId === ev._id} onClick={() => publish(ev)} className="text-terracotta hover:underline disabled:opacity-50">
                            Publish
                          </button>
                        )}
                        {ev.galleryToken && (
                          <button disabled={busyId === ev._id} onClick={() => showQr(ev)} className="text-espresso/70 hover:underline disabled:opacity-50">
                            QR code
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!qr} onClose={() => setQr(null)} title="Gallery QR code">
        {qr && (
          <div className="flex flex-col items-center gap-4 text-center">
            <img src={qr.qrCode} alt="Gallery QR code" className="h-56 w-56 rounded-lg ring-1 ring-espresso/10" />
            <p className="break-all text-xs text-espresso/60">{qr.galleryUrl}</p>
            <Button variant="outline" onClick={() => navigator.clipboard?.writeText(qr.galleryUrl)}>
              Copy link
            </Button>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
