import { getUTM } from "../utils/getUTM";

export const trackEvent = async (eventType, additionalData = {}) => {
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

    // const getScrollDepth = () => {
    //     const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    //     return totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    // };

    const getPageLoadTime = () => {
        const timing = performance.timing;
        return (timing.loadEventEnd - timing.navigationStart) / 1000; 
    };

    const isEntryPage = () => {
        return window.location.pathname === '/'; 
    };

    const isExitPage = () => {
        return document.visibilityState === 'hidden'; 
    };

    const getIpAddress = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip || "Unknown";
        } catch (error) {
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
        location_country: "Fetching...",
        location_city: "Fetching...",
        // scroll_depth: getScrollDepth(), 
        page_load_time: getPageLoadTime(), 
        entry_page: isEntryPage(), 
        exit_page: isExitPage(),
        language: navigator.language,
        ip_address: ipAddress,
        utm_source: getUTM("utm_source"),
        utm_medium: getUTM("utm_medium"),
        utm_campaign: getUTM("utm_campaign"),
        utm_term: getUTM("utm_term"),
        utm_content: getUTM("utm_content"),
        ...additionalData,
    };

    console.log("Tracking Event:", eventData);

    fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
    })
    .then((response) => response.json())
    .then((data) => console.log("Event Tracked:", data))
    .catch((error) => console.error("Tracking Error:", error));
};

// Attach event listeners
document.addEventListener("click", (e) => {
    if (e.target.closest("button, a")) {
        trackEvent("click", { element: e.target.tagName, element_text: e.target.innerText });
    }
});

document.addEventListener("submit", (e) => {
    trackEvent("form_submit", { form_id: e.target.id || "unknown-form" });
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.matches("input[type='search']")) {
        trackEvent("search", { query: e.target.value });
    }
});

// Chat interactions (example: assuming chat window has specific IDs)
document.getElementById("start-chat")?.addEventListener("click", () => {
    trackEvent("chat_start", { chat_with: "support" });
});

document.getElementById("end-chat")?.addEventListener("click", () => {
    trackEvent("chat_end", { chat_duration: 120 });
});
