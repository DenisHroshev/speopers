import React, { useState } from "react";
import { fetchApiGet } from "@/common/services/fetch-api";

export default function FillWithAiModal({
  setOpenFillWithAiModal,
  setOperation,
}) {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClickOutside = (event) => {
    if (event.target.id === "modal-overlay") {
      setOpenFillWithAiModal(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!prompt) return setError("Prompt can't be empty");
    try {
      setIsLoading(true);

      const endpoint = "/operations/fill-with-ai";
      const endpointWithParam = `${endpoint}?prompt=${prompt}`;

      const operationData = await fetchApiGet({ endpoint: endpointWithParam });

      setOperation(operationData);
      setOpenFillWithAiModal(false);
    } catch (error) {
      setError(error.message as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="modal-overlay"
      onClick={handleClickOutside}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(5px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
          position: "relative",
        }}
      >
        <button
          onClick={() => setOpenFillWithAiModal(false)}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "transparent",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          ×
        </button>
        <h2>Fill with AI</h2>
        <input
          type="text"
          placeholder="Enter text"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        {error && (
          <div style={{ color: "red" }}>
            {Array.isArray(error) ? (
              <ul>
                {error.map((message) => (
                  <li>{message}</li>
                ))}
              </ul>
            ) : (
              error
            )}
          </div>
        )}

        <button
          onClick={onSubmit}
          disabled={isLoading}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer",
          }}
        >
          {isLoading ? "Loading..." : "Create"}
        </button>
      </div>
    </div>
  );
}
