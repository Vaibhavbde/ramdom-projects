// career-detail.js
// Robust version: accepts ?id=..., ?career=..., ?careerId=... and shows sample colleges (reads colleges.json)

document.addEventListener("DOMContentLoaded", async () => {
  // read multiple possible param names (backwards compatible)
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id") || params.get("career") || params.get("careerId") || params.get("c");

  console.log("career-detail: param =", idParam);

  try {
    const res = await fetch("/data/careers.json");
    if (!res.ok) throw new Error("Failed to fetch careers.json");
    const careers = await res.json();

    // try to find career by id (string), or by numeric id if data uses numbers
    let career = null;
    if (idParam) {
      career = careers.find(c =>
        String(c.id).toLowerCase() === String(idParam).toLowerCase() ||
        String(c.id) === String(parseInt(idParam)) // handles numeric vs string ids
      );
    }

    // fallback: if there is exactly one career, show it (useful during dev)
    if (!career && careers.length === 1) career = careers[0];

    if (!career) {
      document.querySelector(".career-details").innerHTML = "<p>Career not found!</p>";
      return;
    }

    // Fill simple fields
    document.getElementById("career-title").innerText = career.title || "—";

    fillList("career-after10", career.after_10th || career.after10 || []);
    fillList("career-after12", career.after_12th || career.after12 || []);
    fillList("career-skills", career.skills || []);
    fillList("career-roadmap", career.roadmap || []);
    fillList("career-advantages", career.advantages || []);
    fillList("career-disadvantages", career.disadvantages || []);

    // Sample colleges: map ids to names by loading colleges.json
    if (career.sample_colleges && career.sample_colleges.length) {
      const clgRes = await fetch("/data/colleges.json");
      if (clgRes.ok) {
        const colleges = await clgRes.json();
        const clgListEl = document.getElementById("career-colleges");
        clgListEl.innerHTML = ""; // clear
        career.sample_colleges.forEach(cid => {
          const found = colleges.find(c => String(c.id) === String(cid) || String(c.id).toLowerCase() === String(cid).toLowerCase());
          const li = document.createElement("li");
          if (found) {
            // link to college details page with query param "id" (college-details expects id)
            li.innerHTML = `<a href="college-details.html?id=${found.id}">${escapeHtml(found.name)}</a>`;
          } else {
            li.textContent = String(cid);
          }
          clgListEl.appendChild(li);
        });
      } else {
        console.warn("Could not load colleges.json for sample_colleges");
      }
    }

  } catch (err) {
    console.error("career-detail error:", err);
    document.querySelector(".career-details").innerHTML = "<p>Error loading career data.</p>";
  }
});

// helper to render lists
function fillList(elId, items) {
  const ul = document.getElementById(elId);
  if (!ul) return;
  if (!items || items.length === 0) {
    ul.innerHTML = "<li>Not available</li>";
    return;
  }
  ul.innerHTML = items.map(i => `<li>${escapeHtml(i)}</li>`).join("");
}

// tiny escape to avoid accidental HTML injection from test JSON
function escapeHtml(s) {
  if (s === null || s === undefined) return "";
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
