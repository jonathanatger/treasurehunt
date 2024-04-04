import { useState } from "react";
import IPinfoWrapper, { IPinfo, AsnResponse } from "node-ipinfo";

export const useIpLocation = function () {
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral>({
    lat: 46.227638,
    lng: 1.7191036,
  });

  // some API offer to locate the client - but it necessitates to get the IP and make a round trip to the server

  return userLocation;
};
