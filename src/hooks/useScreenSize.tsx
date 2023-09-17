import { useEffect, useState } from "react";

const useScreenSize = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    // TODO - Improve mechanism to detect device type
    setIsMobile(window.innerWidth < 768);
  }, []);
  return { isMobile };
};

export default useScreenSize;
