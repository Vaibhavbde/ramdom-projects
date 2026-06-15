// DonorRegistrationPage.js
import React from "react";
import DonorForm from "./DonorForm"; // Adjust the path based on your project structure

const DonorRegistrationPage = () => {
  console.log("DonorRegistrationPage rendered");
  const handleDonorRegistration = async (donorData) => {
    try {
      // Send donor data to your backend
      const response = await fetch("http://localhost:3000/donor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donorData),
      });

      if (response.ok) {
        console.log("Donor registered successfully");
        // Optionally, you can redirect or perform other actions after successful registration
      } else {
        console.error("Failed to register donor");
      }
    } catch (error) {
      console.error("Error during donor registration:", error.message);
    }
  };

  return (
    <div className="section">
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h1>Donor Registration</h1>
          <p className="muted mt-1">Join our community of life-savers. Register below to become a donor.</p>
        </div>
        <DonorForm onSubmit={handleDonorRegistration} />
      </div>
    </div>
  );
};

export default DonorRegistrationPage;
