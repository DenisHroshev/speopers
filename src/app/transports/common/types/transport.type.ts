import { TransportTypes } from "@/app/transports/common/constants/transport-types.enum";

export interface Transport {
  id: number;
  name: string;
  description: string;
  peopleCapacity: number;
  type: TransportTypes;
  photoUrl: string;
}
