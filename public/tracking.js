(function () {
    const getUTM = (name) => {
      const params = new URLSearchParams(window.location.search);
      return params.get(name) || null;
    };
  
    window.trackEvent = async function (eventType, additionalData = {}) {
      const sessionId = localStorage.getItem("sessionId") || crypto.randomUUID();
      localStorage.setItem("sessionId", sessionId);
  
      const getDeviceType = () => {
        const userAgent = navigator.userAgent.toLowerCase();
        if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) return "Mobile";
        if (/tablet|ipad/i.test(userAgent)) return "Tablet";
        return "Desktop";
      };
  
      const getBrowserInfo = () => {
        const userAgent = navigator.userAgent;
        if (/chrome|crios|crmo/i.test(userAgent)) return { name: "Chrome", version: userAgent.match(/chrome\/(\d+)/i)?.[1] || "Unknown" };
        if (/firefox|fxios/i.test(userAgent)) return { name: "Firefox", version: userAgent.match(/firefox\/(\d+)/i)?.[1] || "Unknown" };
        if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return { name: "Safari", version: userAgent.match(/version\/(\d+)/i)?.[1] || "Unknown" };
        if (/msie|trident/i.test(userAgent)) return { name: "IE", version: userAgent.match(/(?:msie |rv:)(\d+)/i)?.[1] || "Unknown" };
        if (/edg/i.test(userAgent)) return { name: "Edge", version: userAgent.match(/edg\/(\d+)/i)?.[1] || "Unknown" };
        return { name: "Unknown", version: "Unknown" };
      };
  
      const getOSInfo = () => {
        const userAgent = navigator.userAgent.toLowerCase();
        if (/windows/i.test(userAgent)) return { name: "Windows", version: /windows nt ([\d.]+)/i.exec(userAgent)?.[1] || "Unknown" };
        if (/mac os/i.test(userAgent)) return { name: "macOS", version: /mac os x ([\d._]+)/i.exec(userAgent)?.[1]?.replace(/_/g, ".") || "Unknown" };
        if (/android/i.test(userAgent)) return { name: "Android", version: /android ([\d.]+)/i.exec(userAgent)?.[1] || "Unknown" };
        if (/iphone|ipad|ios/i.test(userAgent)) return { name: "iOS", version: /os ([\d._]+)/i.exec(userAgent)?.[1]?.replace(/_/g, ".") || "Unknown" };
        if (/linux/i.test(userAgent)) return { name: "Linux", version: "Unknown" };
        return { name: "Unknown", version: "Unknown" };
      };
  
      const getPageLoadTime = () => {
        const timing = performance.timing;
        return (timing.loadEventEnd - timing.navigationStart) / 1000;
      };
  
      const isEntryPage = () => window.location.pathname === "/";
      const isExitPage = () => document.visibilityState === "hidden";
  
      const getIpAddress = async () => {
        try {
          const res = await fetch("https://api.ipify.org?format=json");
          const data = await res.json();
          return data.ip;
        } catch {
          return "Unknown";
        }
      };
  
      const ipAddress = await getIpAddress();
  
      const eventData = {
        event_id: crypto.randomUUID(),
        event_type: eventType,
        event_timestamp: new Date().toISOString(),
        session_id: sessionId,
        user_id: localStorage.getItem("userId") || null,
        anonymous_id: localStorage.getItem("anonymousId") || crypto.randomUUID(),
        project_id: "your-project-id",
        page_url: window.location.href,
        page_title: document.title,
        referrer_url: document.referrer || null,
        device_type: getDeviceType(),
        browser: getBrowserInfo().name,
        browser_version: getBrowserInfo().version,
        os: getOSInfo().name,
        os_version: getOSInfo().version,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language,
        ip_address: ipAddress,
        page_load_time: getPageLoadTime(),
        entry_page: isEntryPage(),
        exit_page: isExitPage(),
        utm_source: getUTM("utm_source"),
        utm_medium: getUTM("utm_medium"),
        utm_campaign: getUTM("utm_campaign"),
        utm_term: getUTM("utm_term"),
        utm_content: getUTM("utm_content"),
        ...additionalData,
      };
  
      fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      })
        .then((res) => res.json())
        .then((data) => console.log("Tracked:", data))
        .catch((err) => console.error("Error:", err));
    };
  
    console.log("Tracker loaded.");
  })();
  