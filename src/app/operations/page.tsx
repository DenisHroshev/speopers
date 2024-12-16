"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchApiGet } from "@/common/services/fetch-api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Operation } from "@/app/operations/common/types/Operation.type";

export default function OperationsLayout() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  const isDispatcher = useMemo(() => {
    const isDispatcher = localStorage.getItem("isDispatcher");

    return isDispatcher && JSON.parse(isDispatcher);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const endpoint = `/operations`;
        const data = await fetchApiGet({ endpoint });
        if (!data) setErrorMessage("No data found");

        setOperations(data);
      } catch (error) {
        // @ts-ignore
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleRowClick = (id: string) => {
    router.push(`/operations/${id}`);
  };

  if (loading) {
    return "Завантаження...";
  }

  if (errorMessage) {
    return (
      <div style={errorContainerStyle}>
        <p>Error: {errorMessage}</p>
      </div>
    );
  }

  return (
    <div style={layoutStyle}>
      <h1 style={titleStyle}>Список операццій</h1>
      {isDispatcher && (
        <div style={buttonContainerStyle}>
          <Link href="/operations/new">
            <button style={buttonStyle}>Створити операцію</button>
          </Link>
        </div>
      )}

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerCellStyle}>Фото</th>
            <th style={headerCellStyle}>Назва</th>
            <th style={headerCellStyle}>Опис операції</th>
            <th style={headerCellStyle}>Дата</th>
            <th style={headerCellStyle}>Локація</th>
            <th style={headerCellStyle}>Тип</th>
            <th style={headerCellStyle}>Статус</th>
          </tr>
        </thead>
        <tbody>
          {operations.map((operation) => (
            <tr
              key={operation.id}
              onClick={() => handleRowClick(operation.id)}
              style={rowStyle}
            >
              <td style={cellStyle}>
                {operation.photoUrl ? (
                  <img
                    src={operation.photoUrl}
                    alt={operation.name}
                    style={imageStyle}
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td style={cellStyle}>{operation.name}</td>
              <td style={cellStyle}>{operation.description}</td>
              <td style={cellStyle}>
                {operation.date
                  ? new Date(operation.date).toLocaleDateString()
                  : "N/A"}
              </td>
              <td style={cellStyle}>
                {operation.latitude && operation.longitude
                  ? `${operation.latitude}, ${operation.longitude}`
                  : "Локацію не знайдено"}
              </td>
              <td style={cellStyle}>{operation.type}</td>
              <td style={cellStyle}>{operation.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Стилі для компонента
const layoutStyle = {
  padding: "20px 50px",
  backgroundColor: "#1A1A1D",
  color: "#F0F0F0",
  minHeight: "100vh",
};

const titleStyle = {
  fontSize: "32px",
  marginBottom: "20px",
  color: "#FFA500",
  fontWeight: "bold",
  textAlign: "center",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "20px",
};

const buttonStyle = {
  padding: "12px 24px",
  fontSize: "18px",
  cursor: "pointer",
  backgroundColor: "#FFA500",
  color: "#1A1A1D",
  border: "none",
  borderRadius: "5px",
  fontWeight: "600",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#2E2E2E",
  borderRadius: "8px",
  overflow: "hidden",
  marginTop: "20px",
};

const headerCellStyle = {
  padding: "16px",
  fontWeight: "bold",
  textAlign: "left" as const,
  borderBottom: "2px solid #FFA500",
  color: "#FFA500",
  fontSize: "18px",
};

const rowStyle = {
  cursor: "pointer",
  transition: "background 0.3s",
  backgroundColor: "#333",
  hover: {
    backgroundColor: "#444",
  },
};

const cellStyle = {
  padding: "18px",
  borderBottom: "1px solid #444",
  color: "#F0F0F0",
  fontSize: "16px",
};

const imageStyle = {
  width: "80px",
  height: "auto",
  borderRadius: "8px",
};

const errorContainerStyle = {
  padding: "20px",
  textAlign: "center",
  color: "#FF4C4C",
};
