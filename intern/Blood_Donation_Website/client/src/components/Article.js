import React from "react";

const Article = () => {
  return (
    <div className="section">
      <div className="container-app">
        <article className="card p-6">
          <h1>The Life-Saving Impact of Donating Blood</h1>
          <p className="muted mt-2">
            Every two seconds, someone in the world needs blood. Whether it's a patient undergoing surgery, a victim of a car accident, or someone living with a chronic illness like sickle cell anemia, donated blood often stands between life and death. But despite the constant need, many blood banks face shortages — and that’s where everyday heroes like you come in.
          </p>

          <h2 className="mt-6">Why Blood Donation Matters</h2>
          <p className="muted mt-2">
            Blood cannot be manufactured; it can only come from generous donors. A single donation can save up to three lives, thanks to how blood is separated into red cells, platelets, and plasma — each used for different treatments.
          </p>
        </article>

        <section className="mt-6">
          <div className="card p-6">
            <h2>Tips for First-Time Donors</h2>
            <ul className="mt-3 space-y-2">
              <li className="card p-3"><span role="img" aria-label="water">💧</span> <strong>Stay Hydrated:</strong> Drink plenty of water before your appointment.</li>
              <li className="card p-3"><span role="img" aria-label="meal">🍽️</span> <strong>Eat a Healthy Meal:</strong> A balanced meal can help maintain your blood sugar levels.</li>
              <li className="card p-3"><span role="img" aria-label="no alcohol">🚫</span> <strong>Avoid Alcohol:</strong> Stay away from alcohol for at least 24 hours before donating.</li>
              <li className="card p-3"><span role="img" aria-label="shirt">👕</span> <strong>Wear Comfortable Clothing:</strong> Opt for short sleeves or loose-fitting clothing to make the process easier.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Article;
