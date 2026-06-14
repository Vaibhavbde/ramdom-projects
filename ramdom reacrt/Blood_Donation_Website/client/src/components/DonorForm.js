import React, { useState } from "react";

function Donate() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bloodType: "",
    donationDate: "",
    location: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend logic, just console log for demonstration
    console.log("Donation Information:", formData);
    alert("Thank you for registering to donate!");
  };

  return (
    <div className="section">
      <div className="container-app">
        <div className="card p-6 max-w-xl mx-auto">
          <h1>Book Your Blood Donation Slot</h1>
          <p className="muted mt-1">
            Thank you for your interest in donating blood! Please fill out the form
            below to book a slot for your donation.
          </p>

          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="bloodType">Blood Type</label>
              <select
                id="bloodType"
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                required
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label htmlFor="donationDate">Preferred Donation Date</label>
              <input
                type="date"
                id="donationDate"
                name="donationDate"
                value={formData.donationDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="location">Preferred Donation Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
                required
              />
            </div>

            <div className="pt-2">
              <button type="submit" className="btn btn-primary w-full">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Donate;
