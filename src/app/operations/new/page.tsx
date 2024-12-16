"use client";

import { fetchApiGet, fetchApiPost } from "@/common/services/fetch-api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Operation } from "@/app/operations/common/types/Operation.type";
import OperationForm from "@/app/operations/common/components/operation-form";
import FillWithAiModal from "@/app/operations/common/components/fill-with-ai-modal";

export default function OperationNewLayout() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [availableTransports, setAvailableTransports] = useState([]);
  const [operation, setOperation] = useState<any>(null);

  const router = useRouter();

  const [openFillWithAiModal, setOpenFillWithAiModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const transportsEndpoint = `/transports`;
        const transportData = await fetchApiGet({
          endpoint: transportsEndpoint,
        });
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

      const endpoint = `/operations`;

      const formData = {
        name: operationsUpdatePayload.name,
        description: operationsUpdatePayload.description,
        date: operationsUpdatePayload.date,
        type: operationsUpdatePayload.type,
        status: operationsUpdatePayload.status,
        photoUrl: operationsUpdatePayload.photoUrl,
        transports: (operationsUpdatePayload.transports || []).map(
          ({ id }) => id,
        ),
        ...(operationsUpdatePayload.latitude && {
          latitude: Number(operationsUpdatePayload.latitude),
        }),
        ...(operationsUpdatePayload.longitude && {
          longitude: Number(operationsUpdatePayload.longitude),
        }),
      };

      await fetchApiPost({
        endpoint,
        body: formData,
      });

      router.back();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return "Завантаження...";
  }

  if (errorMessage) {
    return (
      <div>
        <p>Error: ${errorMessage}</p>
      </div>
    );
  }

  return (
    <>
      {openFillWithAiModal && (
        <FillWithAiModal
          setOpenFillWithAiModal={setOpenFillWithAiModal}
          setOperation={setOperation}
        />
      )}
      <OperationForm
        isNew
        onSubmit={onSubmit}
        submitButtonText={"Створити"}
        availableTransports={availableTransports}
        setOpenFillWithAiModal={setOpenFillWithAiModal}
        operationData={operation}
      />
    </>
  );
}
