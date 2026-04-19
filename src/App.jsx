import React, { useEffect, useState } from 'react'

export default function LeadForm() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    status: "New",
    notes: ""
  })

  const [leads, setLeads] = useState([])

  // handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    fetchLeads();
    setFormData({
      name: "",
      email: "",
      phone: "",
      source: "",
      status: "New",
      notes: ""
    })
  }

  // fetch
  const fetchLeads = async () => {
    const res = await fetch("http://localhost:5000/leads");
    const data = await res.json();
    setLeads(data);
  }

  // delete
  const deleteLead = async (id) => {
    await fetch(`http://localhost:5000/leads/${id}`, {
      method: "DELETE",
    });

    fetchLeads();
  }

  // update status
  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/leads/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    fetchLeads();
  }

  useEffect(() => {
    fetchLeads();
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 sm:p-6">

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md sm:max-w-lg"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Add Lead</h2>

        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange}
          className="w-full mb-3 p-2 border rounded-lg" />

        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange}
          className="w-full mb-3 p-2 border rounded-lg" />

        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange}
          className="w-full mb-3 p-2 border rounded-lg" />

        <input name="source" placeholder="Source"
          value={formData.source}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded-lg" />

        {/* ✅ FIXED STATUS (formData use hoga) */}
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded-lg"
        >
          <option>New</option>
          <option>Contacted</option>
          <option>Converted</option>
        </select>

        <textarea name="notes" placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded-lg" />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg sm:w-auto"
        >
          Submit
        </button>
      </form>

      {/* LIST */}
      <div className="mt-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-3">Leads</h2>

        {leads.map((lead) => (
          <div
            key={lead.id}
            className="bg-white p-4 rounded-lg shadow mb-3 w-full"
          >
            <p><b>Name:</b> {lead.name}</p>
            <p><b>Email:</b> {lead.email}</p>
            <p><b>Phone:</b> {lead.phone}</p>
            <p><b>Source:</b> {lead.source}</p>

            {/* ✅ STATUS UPDATE */}
            <div className='flex justify-between items-center mt-2'>
              <select
                value={lead.status}
                onChange={(e) => updateStatus(lead.id, e.target.value)}
                className="border p-1 mt-2 rounded"
              >
                <option>New</option>
                <option>Contacted</option>
                <option>Converted</option>
              </select>

              <p className='ml-3'><b>Notes:</b> {lead.notes}</p>

              {/* ✅ DELETE */}
              <button
                onClick={() => deleteLead(lead.id)}
                className="bg-red-500 text-white px-2 py-1 rounded mt-2 sm:w-auto"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}