// college-details.js

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));

  //  Abhi local JSON, baad me API replace kar dena
  fetch("/data/colleges.json")
    .then(res => res.json())
    .then(data => {
      const college = data.find(c => c.id === id);
      if (!college) {
        document.querySelector(".college-details").innerHTML = "<p>College not found!</p>";
        return;
      }

      document.querySelector(".college-card-detail").innerHTML = `
        <h2>${college.name}</h2>
        <div class="college-info">
          <p> <strong>Address:</strong> ${college.address}</p>
          <p> <strong>Programs:</strong> ${college.programs.join(", ")}</p>
          <p><strong>Type:</strong> ${college.type || "N/A"}</p>
          <p> <strong>Established:</strong> ${college.established || "N/A"}</p>
          <p>ðŸ“ž <strong>Phone:</strong> ${college.phone || "N/A"}</p>
          <p>âœ‰ï¸ <strong>Email:</strong> <a href="mailto:${college.email}">${college.email}</a></p>
          <p><a id="college-website" href="${college.website}" target="_blank"> Visit Website</a></p>
        </div>
      `;
    })
    .catch(err => console.error("Error loading college:", err));
});
