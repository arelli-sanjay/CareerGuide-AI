import "./ProfileModal.css";
import { useState, useEffect } from "react";
import API from "../api/api";

function ProfileModal({ isOpen, onClose }) {

  const [name, setName] = useState("User");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (isOpen) {
      const user = JSON.parse(localStorage.getItem("user")) || {};

      setName(user.name || "User");

      const emailName = user.email ? user.email.split("@")[0] : "";
      setUsername(user.username || emailName);
    }
  }, [isOpen]);

  if (!isOpen) return null;

const handleSave = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user")) || {};

    const updatedUser = {
      name: name || "User",
      username: username || (user.email ? user.email.split("@")[0] : "")
    };

    const res = await API.put("/user/update", updatedUser);

    localStorage.setItem("user", JSON.stringify(res.data));

    window.dispatchEvent(new Event("userUpdated"));

    onClose();

  } catch (err) {
    console.error(err);
    alert("Failed to save profile");
  }
};

  const handleOverlayClick = (e) => {
    if (e.target.className === "modal-overlay") {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">

        <h3>Edit profile</h3>

        <div className="avatar">
          <div className="circle">
            {name ? name.slice(0, 2).toUpperCase() : "US"}
          </div>
        </div>

        <div className="field">
          <label>Display name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="actions">
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="save" onClick={handleSave}>
            Save
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProfileModal;