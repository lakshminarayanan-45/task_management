import React, { useState, useRef } from "react";
import { User, Mail, Phone, Building, Save, Upload, X, Edit2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";

export default function Settings() {
  const { currentUser, updateUser, theme, toggleTheme } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    department: currentUser?.department || "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSave = () => {
    updateUser(currentUser.id, {
      ...formData,
      file: selectedFile,
    });
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile({
          name: file.name,
          size: file.size,
          type: file.type,
          data: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Please log in to view settings</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings</p>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-3xl text-primary-foreground font-semibold">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{currentUser.name}</h2>
            <p className="text-muted-foreground capitalize">{currentUser.role}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
              <User className="w-4 h-4" />
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />
            ) : (
              <p className="px-4 py-2.5 rounded-lg bg-accent/50 text-foreground">{currentUser.name}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
              <Mail className="w-4 h-4" />
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
              />
            ) : (
              <p className="px-4 py-2.5 rounded-lg bg-accent/50 text-foreground">{currentUser.email}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
              <Phone className="w-4 h-4" />
              Phone
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field"
              />
            ) : (
              <p className="px-4 py-2.5 rounded-lg bg-accent/50 text-foreground">
                {currentUser.phone || "Not set"}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
              <Building className="w-4 h-4" />
              Department
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="input-field"
              />
            ) : (
              <p className="px-4 py-2.5 rounded-lg bg-accent/50 text-foreground">
                {currentUser.department || "Not set"}
              </p>
            )}
          </div>

          {isEditing && currentUser.role === "employee" && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
                <Upload className="w-4 h-4" />
                Upload File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-4 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors text-center"
                >
                  <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload a file</p>
                </button>
              )}
            </div>
          )}

          {isEditing && (
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: currentUser.name,
                    email: currentUser.email,
                    phone: currentUser.phone || "",
                    department: currentUser.department || "",
                  });
                  setSelectedFile(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Preferences</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">Theme</p>
            <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg bg-accent text-foreground font-medium hover:bg-accent/80 transition-colors"
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
      </div>
    </div>
  );
}
