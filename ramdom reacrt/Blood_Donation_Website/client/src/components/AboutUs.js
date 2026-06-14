import React from "react";

function AboutUs() {
  const team = [
    { name: "Jane Doe", role: "Founder & CEO" },
    { name: "John Smith", role: "Co-Founder & Operations Lead" },
    { name: "Emily Davis", role: "Head of Marketing" },
  ];

  const getInitials = (fullName) => {
    return fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n.charAt(0).toUpperCase())
      .join("");
  };

  return (
    <div>
      <section className="section">
        <div className="container-app text-center max-w-3xl">
          <h1>About Us</h1>
          <p className="muted mt-2">
            Saving lives, one drop at a time. Our mission is to make blood
            donation easy, accessible, and impactful.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-app grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2>Our Mission</h2>
            <p className="muted mt-2">
              We are dedicated to bridging the gap between blood donors and those in need. Our platform connects donors with blood banks and hospitals, ensuring that every donation makes a difference. By providing reliable information, convenient scheduling, and real-time tracking, we aim to make the donation process smooth and transparent.
            </p>
          </div>
          <div className="card p-6">
            <h2>Our Vision</h2>
            <p className="muted mt-2">
              Our vision is a world where no life is lost due to a shortage of blood. We strive to build a community of regular donors and ensure that blood is always available for those who need it the most. Through awareness campaigns, community events, and partnerships with healthcare organizations, we work tirelessly to achieve this goal.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-app">
          <div className="card p-6">
            <h2>Meet Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              {team.map((member, idx) => (
                <div key={member.name} className="text-center">
                  <div
                    className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-white text-xl font-semibold"
                    style={{
                      background:
                        idx % 3 === 0
                          ? "linear-gradient(135deg, rgb(225,29,72), rgb(244,63,94))"
                          : idx % 3 === 1
                          ? "linear-gradient(135deg, rgb(124,58,237), rgb(139,92,246))"
                          : "linear-gradient(135deg, rgb(16,185,129), rgb(52,211,153))",
                    }}
                    aria-label={`${member.name} avatar`}
                  >
                    {getInitials(member.name)}
                  </div>
                  <h3 className="mt-2 font-semibold">{member.name}</h3>
                  <p className="muted">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-app text-center">
          <div className="card p-6">
            <h2>Join Us in Saving Lives</h2>
            <p className="muted mt-2">
              Whether you're a donor, volunteer, or advocate, you can help us achieve our mission. Together, we can make sure that no one has to wait for the blood they need. Become a part of our community today.
            </p>
            <a href="/donate" className="btn btn-primary mt-4">Become a Donor</a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
