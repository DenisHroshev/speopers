import { FormEvent, useEffect, useMemo, useState } from "react";
import { Operation } from "@/app/operations/common/types/Operation.type";
import { OperationTypesEnum } from "@/app/operations/common/constants/operation-types.enum";
import { OperationStatusesEnum } from "@/app/operations/common/constants/operation-statuses.enum";
import Select from "react-select";

interface OperationsLayoutProps {
  operationData?: Operation;
  submitButtonText: string;
  isNew: boolean;
  onSubmit: (arg1: Operation) => void | Promise<void>;
  onDelete?: (arg1: number) => void | Promise<void>;
  availableTransports?: { id: number; name: string }[];
  setOpenFillWithAiModal: (arg1: boolean) => void;
}

const defaultFormState = {
  name: "",
  description: "",
  date: "",
  latitude: null,
  longitude: null,
  type: "",
  status: "",
  photoUrl: "",
  transports: [],
};

export const getFileAsLink = (file: File) =>
  new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result as string);
    reader.readAsDataURL(file);
  });

export default function OperationForm({
  operationData,
  onSubmit,
  submitButtonText = "Submit",
  isNew = false,
  onDelete = () => {},
  availableTransports,
  setOpenFillWithAiModal,
}: OperationsLayoutProps) {
  const [formData, setFormData] = useState<Operation>(
    defaultFormState as Operation,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    operationData?.photoUrl,
  );

  const isDispatcher = useMemo(() => {
    const isDispatcher = localStorage.getItem("isDispatcher");
    return isDispatcher && JSON.parse(isDispatcher);
  }, []);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDateChange = (e: { target: { value: any } }) => {
    setFormData((prevData) => ({ ...prevData, date: e.target.value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileLink = await getFileAsLink(file);
      setFormData((prevData) => ({ ...prevData, photoUrl: fileLink }));
      setPreviewImage(fileLink);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.type || !formData.status) {
      setErrorMessage("Please select a type and status");
      return;
    }
    onSubmit(formData);
  };

  const handleMultiSelectChange = (newValue) => {
    setFormData((prevData) => ({
      ...prevData,
      transports: newValue.map(({ value }) => value),
    }));
  };

  useEffect(() => {
    setFormData(operationData || defaultFormState);
  }, [operationData]);

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
        {/* Existing form inputs */}
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
          <label style={{ display: "block", marginBottom: "5px" }}>Date</label>
          <input
            type="date"
            name="date"
            value={
              formData.date
                ? formData.date.includes("T")
                  ? formData.date.split("T")[0]
                  : formData.date
                : ""
            }
            onChange={handleDateChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            required
            disabled={!isDispatcher}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Latitude
          </label>
          <input
            type="number"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            disabled={!isDispatcher}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Longitude
          </label>
          <input
            type="number"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            disabled={!isDispatcher}
          />
        </div>

        {formData.latitude && formData.longitude && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${formData.latitude},${formData.longitude}`}
            target="_blank"
            style={{
              textAlign: "left",
              color: "#4e6fe7",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Find on maps
          </a>
        )}

        <div style={{ margin: "15px 0" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            disabled={!isDispatcher}
          >
            <option value="">Select a type</option>
            {Object.values(OperationTypesEnum).map((type, idx) => (
              <option value={type} key={idx}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            disabled={!isDispatcher}
          >
            <option value="">Select a status</option>
            {Object.values(OperationStatusesEnum).map((status, idx) => (
              <option value={status} key={idx}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Image Upload
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            disabled={!isDispatcher}
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              style={{ marginTop: "10px", maxWidth: "100%", height: "auto" }}
            />
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Transports</label>
          <Select
            isMulti
            name="transports"
            value={formData.transports.map((transport) => ({
              value: transport,
              label: transport.name,
            }))}
            onChange={handleMultiSelectChange}
            options={availableTransports.map((transport) => ({
              value: transport,
              label: transport.name,
            }))}
            styles={{
              container: (base) => ({ ...base, width: "100%", color: "black" }),
            }}
            isDisabled={!isDispatcher}
          />
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
                onClick={() => onDelete(operationData?.id as number)}
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
                Delete
              </button>
            )}
          </div>
        )}

        {isDispatcher && isNew && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setOpenFillWithAiModal(true);
            }}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#6926f1",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Fill with ai
          </button>
        )}
      </form>
    </div>
  );
}
