import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as galleryApi from "../api/gallery";
import { Field, Input, Button } from "../components/Field";
import Loader from "../components/Loader";
import ErrorBanner from "../components/ErrorBanner";

function TokenEntry() {
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (token.trim()) navigate(`/gallery/${token.trim()}`);
  };

  return (
    <div className="mx-auto max-w-xl px-5 py-20 sm:px-8">
      <p className="text-xs uppercase tracking-wide2 text-terracotta">Client gallery</p>
      <h1 className="mt-3 font-display text-4xl text-espresso">Open your gallery</h1>
      <p className="mt-3 text-sm leading-relaxed text-espresso/65">
        Paste the private link or gallery code your photographer shared with
        you — or scan the QR code they gave you, which opens it directly.
      </p>
      <form onSubmit={submit} className="mt-8 rounded-2xl bg-softwhite p-6 shadow-sm ring-1 ring-espresso/5">
        <Field label="Gallery code / token">
          <Input
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="e.g. 8f21c9a0b6..."
          />
        </Field>
        <Button type="submit" className="mt-5 w-full sm:w-auto">
          View gallery
        </Button>
      </form>
    </div>
  );
}

function GalleryView({ token }) {
  const [data, setData] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photosLoading, setPhotosLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    galleryApi
      .getPublicGallery(token)
      .then((res) => setData(res.data.data))
      .catch(() =>
        setError("This gallery link is invalid, expired, or not published yet.")
      )
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!data) return;
    setPhotosLoading(true);
    galleryApi
      .getPublicGalleryPhotos(token, activeAlbum || undefined)
      .then((res) => setPhotos(res.data.data || []))
      .catch(() => setPhotos([]))
      .finally(() => setPhotosLoading(false));
  }, [data, token, activeAlbum]);

  if (loading) return <Loader label="Opening gallery" />;

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center sm:px-8">
        <ErrorBanner message={error} />
      </div>
    );
  }

  const { event, albums } = data;
  const date = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div>
      <div className="bg-beige/40 px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-wide2 text-terracotta">{event.eventType}</p>
          <h1 className="mt-2 font-display text-4xl text-espresso sm:text-5xl">{event.title}</h1>
          <p className="mt-2 text-sm text-espresso/60">
            {event.location}
            {date ? ` · ${date}` : ""}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        {albums?.length > 0 && (
          <div className="mb-8 -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
            <button
              onClick={() => setActiveAlbum(null)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                !activeAlbum
                  ? "border-espresso bg-espresso text-softwhite"
                  : "border-espresso/15 text-espresso/70 hover:border-terracotta hover:text-terracotta"
              }`}
            >
              All photos
            </button>
            {albums.map((a) => (
              <button
                key={a._id}
                onClick={() => setActiveAlbum(a._id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                  activeAlbum === a._id
                    ? "border-espresso bg-espresso text-softwhite"
                    : "border-espresso/15 text-espresso/70 hover:border-terracotta hover:text-terracotta"
                }`}
              >
                {a.name}
              </button>
            ))}
          </div>
        )}

        {photosLoading ? (
          <Loader label="Loading photos" />
        ) : photos.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-espresso/15 py-16 text-center text-sm text-espresso/50">
            No photos in this album yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((p) => (
              <button
                key={p._id}
                onClick={() => setLightbox(p)}
                className="aspect-square overflow-hidden rounded-xl bg-beige focus-ring"
              >
                <img
                  src={p.thumbnailUrl || p.imageUrl}
                  alt={p.originalFilename || "Event photo"}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-4 bg-espresso/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            aria-label="Close"
            className="absolute right-5 top-5 text-2xl text-softwhite/80 hover:text-softwhite"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          <img
            src={lightbox.imageUrl}
            alt=""
            className="max-h-[80vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <a
            href={lightbox.imageUrl}
            download
            onClick={(e) => e.stopPropagation()}
            className="rounded-full bg-terracotta px-5 py-2.5 text-sm text-softwhite hover:bg-mocha"
          >
            Download photo
          </a>
        </div>
      )}
    </div>
  );
}

export default function ClientGallery() {
  const { token } = useParams();
  return token ? <GalleryView token={token} /> : <TokenEntry />;
}
