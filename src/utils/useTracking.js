import { useEffect } from "react";
import { trackEvent } from "../utils/trackEvent"; 

const useTracking = () => {
  // ✅ Track Page View
  useEffect(() => {
    trackEvent("page_view", { description: "User visited a page" });
  }, []);

  // ✅ Track Exit Page
  useEffect(() => {
    const handleExit = () => {
      trackEvent("exit_page", { description: "User left the website" });
    };

    window.addEventListener("beforeunload", handleExit);
    return () => window.removeEventListener("beforeunload", handleExit);
  }, []);

  // ✅ Track Scroll Depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      if (scrollDepth > 0) {
        trackEvent("scroll", { scroll_depth: `${scrollDepth}%` });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
};

export default useTracking;
