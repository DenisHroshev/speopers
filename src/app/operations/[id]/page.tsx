"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import {
  fetchApiDelete,
  fetchApiGet,
  fetchApiPatch,
} from "@/common/services/fetch-api";
import OperationForm from "@/app/operations/common/components/operation-form";
import { Operation } from "@/app/operations/common/types/Operation.type";

export default function OperationByIdLayout() {
  const params = useParams();
  const router = useRouter();
  const operationId = params.id;
  const [operation, setOperation] = useState({});
  const [availableTransports, setAvailableTransports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!operation || !Number(operationId)) {
          setErrorMessage("invalid transport ID");
        }

        setLoading(true);
        const operationEndpoint = `/operations/${operationId}`;
        const transportsEndpoint = `/transports`;

        const [operationData, transportData] = await Promise.all([
          fetchApiGet({ endpoint: operationEndpoint }),
          fetchApiGet({ endpoint: transportsEndpoint }),
        ]);

        setOperation(operationData);
        setAvailableTransports(
          transportData.map(({ id, name }) => ({ id, name })),
        );
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSubmit = async (operationsUpdatePayload: Partial<Operation>) => {
    try {
      setLoading(true);

      const endpoint = `/operations/${operationId}`;

      const formData = {
        name: operationsUpdatePayload.name,
        description: operationsUpdatePayload.description,
        date: operationsUpdatePayload.date,
        ...(operationsUpdatePayload.latitude && {
          latitude: operationsUpdatePayload.latitude,
        }),
        ...(operationsUpdatePayload.longitude && {
          latitude: operationsUpdatePayload.longitude,
        }),
        type: operationsUpdatePayload.type,
        status: operationsUpdatePayload.status,
        photoUrl: operationsUpdatePayload.photoUrl,
        transports: (operationsUpdatePayload.transports || []).map(
          ({ id }) => id,
        ),
      };

      const data = await fetchApiPatch({
        endpoint,
        body: formData,
      });

      setOperation(data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (operationId: number) => {
    try {
      setLoading(true);

      const endpoint = `/operations/${operationId}`;

      await fetchApiDelete({ endpoint });

      router.back();
    } catch (error) {
      setErrorMessage(error.message as string);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return "Завантаження...";
  }

  if (errorMessage || !operation) {
    return (
      <div>
        <p>Error: {errorMessage}</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Operation</h1>
        <OperationForm
          operationData={operation}
          onSubmit={onSubmit}
          submitButtonText={"Оновити дані"}
          onDelete={onDelete}
          availableTransports={availableTransports}
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
