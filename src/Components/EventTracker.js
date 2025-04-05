const trackEvent = (eventType, additionalData = {}) => {
    const sessionId = localStorage.getItem("sessionId") || crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
  
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
      location_country: "Fetching...", // Can be fetched from a geolocation API
      location_city: "Fetching...",   // Can be fetched from a geolocation API
      ip_address: "Fetching...",      // Can be fetched from a geolocation API
      utm_source: getUTM("utm_source"),
      utm_medium: getUTM("utm_medium"),
      utm_campaign: getUTM("utm_campaign"),
      utm_term: getUTM("utm_term"),
      utm_content: getUTM("utm_content"),
      ...additionalData,
    };
  
    // Send the data to the backend API
    fetch("https://your-api-endpoint.com/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })
      .then((response) => response.json())
      .then((data) => console.log("Event Tracked:", data))
      .catch((error) => console.error("Tracking Error:", error));
  };
  