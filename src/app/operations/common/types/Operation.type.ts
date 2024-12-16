import { OperationStatusesEnum } from "@/app/operations/common/constants/operation-statuses.enum";
import { OperationTypesEnum } from "@/app/operations/common/constants/operation-types.enum";
import { Transport } from "@/app/transports/common/types/transport.type";

export interface Operation {
  id: number;
  name: string;
  description: string;
  date: string;
  latitude: number;
  longitude: number;
  type: OperationTypesEnum;
  status: OperationStatusesEnum;
  photoUrl: string;
  transports: Transport[];
}
