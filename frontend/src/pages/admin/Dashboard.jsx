// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import Loader from "../../components/Loader";
import * as inquiryApi from "../../api/inquiry";
import * as clientApi from "../../api/client";
import * as eventApi from "../../api/event";
import * as portfolioApi from "../../api/portfolio";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentInquiries, setRecentInquiries] = useState([]);

  useEffect(() => {
    Promise.all([
      inquiryApi.getAllInquiries(),
      clientApi.getAllClients(),
      eventApi.getAllEvents(),
      portfolioApi.getAllPortfolios(),
    ])
      .then(([inquiries, clients, events, portfolios]) => {
        const inq = inquiries.data.data || [];
        setStats({
          inquiries: inq.length,
          newInquiries: inq.filter((i) => i.status === "New").length,
          clients: clients.data.clients?.length ?? 0,
          events: events.data.count ?? events.data.data?.length ?? 0,
          portfolios: portfolios.data.count ?? portfolios.data.data?.length ?? 0,
        });
        setRecentInquiries(inq.slice(0, 5));
      })
      .catch(() => setStats({ inquiries: 0, newInquiries: 0, clients: 0, events: 0, portfolios: 0 }));
  }, []);

  const cards = stats && [
    { label: "New enquiries", value: stats.newInquiries, to: "/admin/inquiries" },
    { label: "Total enquiries", value: stats.inquiries, to: "/admin/inquiries" },
    { label: "Clients", value: stats.clients, to: "/admin/clients" },
    { label: "Events", value: stats.events, to: "/admin/events" },
    { label: "Portfolio pieces", value: stats.portfolios, to: "/admin/portfolio" },
  ];

  return (
    <AdminLayout


    >
      {!stats ? (
        <Loader label="Loading dashboard" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
            {cards.map((c) => (
              <Link
                key={c.label}
                to={c.to}
                className="rounded-2xl bg-softwhite p-5 shadow-sm ring-1 ring-espresso/5 transition hover:ring-terracotta/40"
              >
                <p className="font-display text-3xl text-espresso">{c.value}</p>
                <p className="mt-1 text-xs text-espresso/60">{c.label}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-softwhite p-6 shadow-sm ring-1 ring-espresso/5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg text-espresso">Recent enquiries</h2>
              <Link to="/admin/inquiries" className="text-sm text-terracotta hover:underline">
                View all
              </Link>
            </div>
            {recentInquiries.length === 0 ? (
              <p className="text-sm text-espresso/50">No enquiries yet.</p>
            ) : (
              <div className="divide-y divide-espresso/10">
                {recentInquiries.map((i) => (
                  <div key={i._id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <div>
                      <p className="text-sm font-medium text-espresso">{i.name}</p>
                      <p className="text-xs text-espresso/55">
                        {i.eventType} · {i.location}
                      </p>

                    </div>
                    <span className="text-xs text-espresso/50">{i.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}