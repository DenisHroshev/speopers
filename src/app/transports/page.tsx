"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchApiGet } from "@/common/services/fetch-api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Transport } from "@/app/transports/common/types/transport.type";

export default function TransportsLayout() {
  const [transports, setTransports] = useState<Transport[]>([]);
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
        const endpoint = `/transports`;
        const data = await fetchApiGet({ endpoint });
        if (!data) setErrorMessage("No data fount");

        setTransports(data);
      } catch (error) {
        // @ts-ignore
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleRowClick = (id: string) => {
    router.push(`/transports/${id}`);
  };

  if (loading) {
    return "Завантаження...";
  }

  if (errorMessage) {
    return (
      <div>
        <p>Error:{errorMessage}</p>
      </div>
    );
  }

  return (
    <div style={layoutStyle}>
      <h1 style={titleStyle}>Transport List</h1>
      {isDispatcher && (
        <div style={buttonContainerStyle}>
          <Link href="/transports/new">
            <button style={buttonStyle}>Create new</button>
          </Link>
        </div>
      )}

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerCellStyle}>Image</th>
            <th style={headerCellStyle}>Name</th>
            <th style={headerCellStyle}>Description</th>
            <th style={headerCellStyle}>Capacity</th>
            <th style={headerCellStyle}>Type</th>
          </tr>
        </thead>
        <tbody>
          {transports.map((transport) => (
            <tr
              key={transport.id}
              onClick={() => handleRowClick(transport.id)}
              style={rowStyle}
            >
              <td style={cellStyle}>
                {transport.photoUrl ? (
                  <img
                    src={transport.photoUrl}
                    alt={transport.name}
                    style={imageStyle}
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td style={cellStyle}>{transport.name}</td>
              <td style={cellStyle}>{transport.description}</td>
              <td style={cellStyle}>{transport.peopleCapacity}</td>
              <td style={cellStyle}>{transport.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Стилі
const layoutStyle = {
  fontFamily: "'Roboto', sans-serif",
  color: "#F0F0F0",
  backgroundColor: "#1A1A1D",
  padding: "20px 50px",
  minHeight: "100vh",
};

const titleStyle = {
  color: "#FFA500",
  fontSize: "36px",
  fontWeight: "700",
  textAlign: "center",
  margin: "20px 0",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "20px",
};

const buttonStyle = {
  backgroundColor: "#FFA500",
  color: "#1A1A1D",
  padding: "16px 32px",
  fontSize: "20px",
  fontWeight: "600",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
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

const cellStyle = {
  padding: "18px",
  backgroundColor: "#2E2E2E",
  color: "#FFFFFF",
  fontSize: "18px",
  borderBottom: "10px solid transparent",
};

const rowStyle = {
  cursor: "pointer",
  transition: "background 0.3s",
};

const imageStyle = {
  width: "160px",
  height: "auto",
  borderRadius: "8px",
};
