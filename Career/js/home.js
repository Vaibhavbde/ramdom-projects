// home.js - small renderer for homepage preview
document.addEventListener('DOMContentLoaded', () => {
  loadFeaturedColleges();
  loadFeaturedScholarships();
});

function loadFeaturedColleges() {
  const container = document.getElementById('featured-colleges');
  if (!container) return;
  fetch('/data/colleges.json')
    .then(r => r.json())
    .then(list => {
      container.innerHTML = '';
      const top = list.slice(0, 3);
      top.forEach(c => {
        const d = document.createElement('div');
        d.className = 'preview-card';
        d.innerHTML = `<h4>${c.name}</h4><p>${c.programs.slice(0,2).join(', ')} - ${c.location}</p>`;
        d.addEventListener('click', () => window.location.href = `colleges.html#${c.id}`);
        container.appendChild(d);
      });
    }).catch(err => {
      container.innerHTML = '<div class="card-placeholder">Failed to load</div>';
      console.error(err);
    });
}

function loadFeaturedScholarships() {
  const container = document.getElementById('featured-scholarships');
  if (!container) return;
  fetch('/data/scholarships.json')
    .then(r => r.json())
    .then(list => {
      container.innerHTML = '';
      const top = list.slice(0, 3);
      top.forEach(s => {
        const d = document.createElement('div');
        d.className = 'preview-card';
        d.innerHTML = `<h4>${s.name}</h4><p>${(s.eligibility || '').slice(0,80)}...</p>`;
        container.appendChild(d);
      });
    }).catch(err => {
      container.innerHTML = '<div class="card-placeholder">Failed to load</div>';
      console.error(err);
    });
}
