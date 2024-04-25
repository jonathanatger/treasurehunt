import { useState, useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export const useGMapImports = function () {
  const [apiImportsAreLoading, setApiImportsAreLoading] = useState(true);

  useEffect(() => {
    function checkImports() {
      try {
        if (
          typeof google.maps.Map === "function" &&
          typeof google.maps.marker === "object"
        ) {
          return true;
        }
      } catch {}

      return false;
    }

    if (checkImports() === true && apiImportsAreLoading === true)
      setApiImportsAreLoading(false);
    else {
      const loader = new Loader({
        apiKey: "AIzaSyC82zF4kXxbHktiWXC2tAfcb7Wb9mIrNwA",
        version: "quarterly",
      });

      loader
        .importLibrary("maps")
        .then()
        .then((data) => {
          if (checkImports()) setApiImportsAreLoading(false);
        })
        .catch((e) => console.log(e));

      loader
        .importLibrary("marker")
        .then((data) => {
          if (checkImports()) setApiImportsAreLoading(false);
        })
        .catch((e) => console.log(e));
    }
  }, []);

  return apiImportsAreLoading;
};
