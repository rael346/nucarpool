import { Role, Status, User } from "@prisma/client";

type POIData = {
  location: string;
  coordLng: number;
  coordLat: number;
};

// descripes a user's public data along with their IPO's
export type PublicUser = {
  //id: string
  name: string | null;
  email: string | null;
  //emailVerified: Date | null
  image: string | null;
  bio: string;
  preferredName: string;
  pronouns: string;
  role: Role;
  status: Status;
  seatAvail: number;
  companyName: string;
  startLocation: string;
  startPOICoordLng: number;
  startPOICoordLat: number;
  companyPOIAddress: string;
  companyPOICoordLng: number;
  companyPOICoordLat: number;
  daysWorking: string;
  startTime: Date | null;
  endTime: Date | null;
};

export const toPublicUser = (user?: User): PublicUser | null => {
  if (!user) return null;
  return {
    name: user.name,
    email: user.email,
    image: user.image,
    bio: user.bio,
    preferredName: user.preferredName,
    pronouns: user.pronouns,
    role: user.role,
    status: user.status,
    seatAvail: user.seatAvail,
    companyName: user.companyName,
    daysWorking: user.daysWorking,
    startTime: user.startTime,
    endTime: user.endTime,
    startLocation: user.startLocation,
    startPOICoordLng: user.startPOICoordLng,
    startPOICoordLat: user.startPOICoordLat,
    companyPOIAddress: user.companyPOIAddress,
    companyPOICoordLng: user.companyPOICoordLng,
    companyPOICoordLat: user.companyPOICoordLat,
  };
};

const ipoData = (longitude: number, latitude: number): POIData => {
  // TODO: Make API calls to the MapBox here
  return {
    location: "Northeastern University",
    coordLng: 0,
    coordLat: 0,
  };
};
