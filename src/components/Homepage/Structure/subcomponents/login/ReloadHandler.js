// ReloadHandler.js

import React, { useEffect } from "react";

const ReloadHandler = () => {
  const handlePutRequest = async () => {
    try {
      // Replace with your logic to get userId and formData
      const user = JSON.parse(localStorage.getItem("user"));
      const formData = {}; // Replace with your actual form data
      const userId = user.Userid;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/enduser/${userId}`,
        {
          method: "PUT",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      const responseData = await response.json();

      // Format response as per your requirements
      const updatedUser = {
        ...responseData.data,
        Userid: responseData.data._id,
      };

      delete updatedUser._id;

      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error:", error);
      // Handle error scenario
    }
  };

  useEffect(() => {
    handlePutRequest(); // Call handlePutRequest on component mount (site open or reload)
  }, []); // Empty dependency array ensures it runs once on mount (site open or reload)

  return null; // ReloadHandler doesn't render anything visible
};

export default ReloadHandler;
