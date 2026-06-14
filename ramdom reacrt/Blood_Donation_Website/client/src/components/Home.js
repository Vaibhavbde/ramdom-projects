import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

function Home() {
  const statsRef = useRef(null);
  const isInView = useInView(statsRef, { once: true }); // Trigger animation only once

  return (
    <div>
      <header
        className="relative w-full"
        style={{
          backgroundImage: "url('/blood_theme.jpg')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "rgb(15, 23, 42)" /* fallback behind image */,
        }}
      >
        <div className="absolute inset-0 bg-black/30" aria-hidden="true"></div>
        <div className="container-app relative flex flex-col items-center justify-center text-center" style={{ minHeight: "60vh" }}>
          <h1 className="text-white">Donate Blood, Save Lives</h1>
          <p className="mt-2" style={{ color: "rgba(255,255,255,0.85)" }}>
            Your donation can make a difference in someone's life today.
          </p>
          <div className="mt-6">
            <a href="/donate" className="btn btn-primary">Become a Donor</a>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container-app">
          <div className="card card-hover p-6">
            <h2>Why Donate Blood?</h2>
            <p className="muted mt-2">
              Blood donation is a simple act that saves millions of lives. By donating blood,
              you help those in need during surgeries, accidents, and medical conditions that
              require transfusions.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section with Framer Motion */}
      <motion.section
        className="section"
        initial={{ opacity: 0, x: -100 }} // Start off-screen to the left
        whileInView={{ opacity: 1, x: 0 }} // Animate when in view
        viewport={{ once: true }} // Trigger animation only once
        transition={{ duration: 0.8, ease: "easeOut" }} // Smooth transition
      >
        <div className="container-app">
          <h2>Donation Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="card p-6 text-center">
              <h3 className="text-2xl font-semibold">1200+</h3>
              <p className="muted">Successful Donations</p>
            </div>
            <div className="card p-6 text-center">
              <h3 className="text-2xl font-semibold">900+</h3>
              <p className="muted">Registered Donors</p>
            </div>
            <div className="card p-6 text-center">
              <h3 className="text-2xl font-semibold">500+</h3>
              <p className="muted">Patients Helped</p>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="section">
        <div className="container-app">
          <div className="card p-6">
            <h2>How to Donate</h2>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>Check the eligibility requirements for donating blood.</li>
              <li>Book an appointment at your nearest blood donation camp.</li>
              <li>Come prepared, stay hydrated, and donate!</li>
            </ol>
            <a href="/donate" className="btn btn-outline mt-4">Learn More About the Process</a>
          </div>
        </div>
      </section>

      {/* Upcoming Camps */}
      <section id="camps" className="section">
        <div className="container-app">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2>Upcoming Camps</h2>
              <p className="muted">Find a blood donation camp near you</p>
            </div>
            <div className="w-full max-w-sm">
              <label htmlFor="campSearch" className="sr-only">Search by city or venue</label>
              <input id="campSearch" type="text" placeholder="Search by city or venue" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div className="card card-hover p-5">
              <h3 className="text-lg font-semibold">City Hospital, Pune</h3>
              <p className="muted">Sat, Oct 18 • 10:00 AM - 4:00 PM</p>
              <button className="btn btn-primary mt-3">Register</button>
            </div>
            <div className="card card-hover p-5">
              <h3 className="text-lg font-semibold">Community Hall, Mumbai</h3>
              <p className="muted">Sun, Oct 19 • 9:00 AM - 3:00 PM</p>
              <button className="btn btn-primary mt-3">Register</button>
            </div>
            <div className="card card-hover p-5">
              <h3 className="text-lg font-semibold">Red Cross Center, Delhi</h3>
              <p className="muted">Wed, Oct 22 • 11:00 AM - 5:00 PM</p>
              <button className="btn btn-primary mt-3">Register</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer section">
        <div className="container-app">
          <p>
            Join our community of life-savers. Follow us on social media or
            contact us for more information.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
