import { FormEvent, useEffect, useMemo, useState } from "react";
import { TransportTypes } from "@/app/transports/common/constants/transport-types.enum";
import { Transport } from "@/app/transports/common/types/transport.type";

interface TransportsLayoutProps {
  transportData?: Transport;
  submitButtonText: string;
  isNew: boolean;
  onSubmit: (arg1: Transport) => void | Promise<void>;
  onDelete?: (arg1: number) => void | Promise<void>;
}

const defaultFormState = {
  name: "",
  description: "",
  peopleCapacity: "",
  type: "",
  photoUrl: "",
};

export default function TransportForm({
  transportData,
  onSubmit,
  submitButtonText = "Submit",
  isNew = false,
  onDelete = () => {},
}: TransportsLayoutProps) {
  const [formData, setFormData] = useState<Transport>({} as Transport);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const isDispatcher = useMemo(() => {
    const isDispatcher = localStorage.getItem("isDispatcher");
    return isDispatcher && JSON.parse(isDispatcher);
  }, []);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = await getFileAsLink(file);
      setPreviewImage(imageUrl as string); // Set the preview
      setFormData((prevData) => ({
        ...prevData,
        photoUrl: imageUrl as string,
      }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.type) {
      setErrorMessage("Please select a type");
      return;
    }
    onSubmit(formData);
  };

  useEffect(() => {
    if (isNew) {
      setFormData(defaultFormState);
      setPreviewImage(null);
    }
    if (!isNew && transportData) {
      setFormData(transportData);
      setPreviewImage(transportData.photoUrl);
    }
  }, [transportData]);

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            required
            disabled={!isDispatcher}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Description
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            required
            disabled={!isDispatcher}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            People Capacity
          </label>
          <input
            type="number"
            name="peopleCapacity"
            value={formData.peopleCapacity}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            required
            disabled={!isDispatcher}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            disabled={!isDispatcher}
          >
            <option value="">Select a type</option>
            {Object.values(TransportTypes).map((type, idx) => (
              <option value={type} key={idx}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Upload Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            disabled={!isDispatcher}
          />
          {previewImage && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={previewImage}
                alt="Preview"
                style={{ maxWidth: "100%" }}
              />
            </div>
          )}
        </div>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        {isDispatcher && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {submitButtonText}
            </button>
            {!isNew && (
              <button
                onClick={() => onDelete(transportData?.id as number)}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#aa2020",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                delete
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

// Function to get a file as a base64 data URL
export const getFileAsLink = (
  file: File,
): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result);
    reader.readAsDataURL(file);
  });
