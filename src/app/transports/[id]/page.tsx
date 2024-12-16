"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import {
  fetchApiDelete,
  fetchApiGet,
  fetchApiPatch,
} from "@/common/services/fetch-api";
import { Transport } from "@/app/transports/common/types/transport.type";
import TransportForm from "@/app/transports/common/components/transport-form";

export default function TransportByIdLayout() {
  const params = useParams();
  const router = useRouter();
  const transportId = params.id;
  const [transport, setTransport] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!transport || !Number(transportId)) {
          setErrorMessage("invalid transport ID");
        }

        setLoading(true);
        const endpoint = `/transports/${transportId}`;
        const data = await fetchApiGet({ endpoint });

        console.log("FETCHED", data);
        setTransport(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSubmit = async (transportUpdatePayload: Partial<Transport>) => {
    try {
      setLoading(true);

      const endpoint = `/transports/${transportId}`;

      const formData = {
        name: transportUpdatePayload.name,
        description: transportUpdatePayload.description,
        peopleCapacity: transportUpdatePayload.peopleCapacity,
        type: transportUpdatePayload.type,
        photoUrl: transportUpdatePayload.photoUrl,
      };

      const data = await fetchApiPatch({
        endpoint,
        body: formData,
      });

      setTransport(data);
    } catch (error) {
      setErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (transportId: number) => {
    try {
      setLoading(true);

      const endpoint = `/transports/${transportId}`;

      await fetchApiDelete({ endpoint });

      router.back();
    } catch (error) {
      setErrorMessage(error.message as string);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return "VETALIK LOADITSA...";
  }

  if (errorMessage || !transport) {
    return (
      <div>
        <p>Error: {errorMessage}</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Transport</h1>
        <TransportForm
          transportData={transport}
          onSubmit={onSubmit}
          submitButtonText={"Update"}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}

// Стилі для контейнера, форми, полів введення і кнопки
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#1A1A1D",
};

const formContainerStyle = {
  width: "500px", // Ширина форми
  padding: "40px",
  backgroundColor: "#2E2E2E",
  borderRadius: "12px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
  textAlign: "center",
};

const titleStyle = {
  color: "#FFA500",
  fontSize: "36px",
  fontWeight: "bold",
  marginBottom: "20px",
};
