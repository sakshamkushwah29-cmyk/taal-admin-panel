// hooks/useProfilePictureUpload.js
import { useState } from "react";
import axios from "axios";
import { getAuthConfig } from "../services/apiUtils";

const useProfilePictureUpload = () => {
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setAvatarFile(file);
  };

  const uploadProfilePicture = async (file) => {
    if (!file) return "";

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const { data } = await axios.post("/api/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...getAuthConfig().headers,
        },
      });
      setAvatarUrl(data.avatarUrl); // Adjust based on your API response
      return data.avatarUrl;
    } catch (error) {
      console.error("Error Uploading Profile Picture:", error);
      return "";
    }
  };

  return {
    avatarFile,
    avatarUrl,
    handleFileChange,
    uploadProfilePicture,
  };
};

export default useProfilePictureUpload;
