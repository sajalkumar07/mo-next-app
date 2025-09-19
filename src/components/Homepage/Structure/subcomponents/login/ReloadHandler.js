// ReloadHandler.js

"use client"; // ✅ required in Next.js app dir for client-side hooks

import React, { useEffect } from "react";

const ReloadHandler = () => {
  const handlePutRequest = async (userId) => {
    try {
      const formData = {}; // Replace with your actual form data

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
      console.error("Error updating user:", error);
    }
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        console.warn("No user found in localStorage, skipping update");
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user?.Userid;

      if (!userId) {
        console.warn("UserId missing in stored user, skipping update");
        return;
      }

      handlePutRequest(userId);
    } catch (err) {
      console.error("Failed to read user from localStorage:", err);
    }
  }, []);

  return null; // ReloadHandler doesn't render anything visible
};

export default ReloadHandler;
