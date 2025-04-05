import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "antd";
import { trackEvent } from "../utils/trackEvent";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [video, setVideo] = useState(null);
  const navigate = useNavigate(); // ✅ Now inside <Router>

  const handleLogin = async (e) => {
    e.preventDefault();

    // Mock API response
    const mockApiResponse = {
      success: true,
      user: { id: "USR-123", name: "John Doe", email },
    };

    if (mockApiResponse.success) {
      localStorage.setItem("userId", mockApiResponse.user.id);
      localStorage.setItem("userEmail", mockApiResponse.user.email);
      localStorage.setItem("userName", mockApiResponse.user.name);

      // Track login event
      trackEvent("User Login", { user_id: mockApiResponse.user.id, email });

      // Navigate to dashboard
      navigate("/dashboard");
    }
  };

  const handlePlay = () => {
    trackEvent("Video Play", { video_id: "your-video-id" });
  };

  const handlePause = () => {
    trackEvent("Video Pause", { video_id: "your-video-id" });
  };

  const handleEnded = () => {
    trackEvent("Video Complete", { video_id: "your-video-id" });
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // You can track search events if needed
    trackEvent("Search", { search_query: e.target.value });
  };
  useEffect(() => {
    const videoElement = document.getElementById("my-video");
    if (videoElement) {
      setVideo(videoElement);
    }
  }, []);

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <Input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="primary" onClick={handleLogin}>
          Login
        </Button>
      </form>
      <div>
        <h3>Search</h3>
        <Input
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for something"
        />
      </div>

      <div>
        <h3>Video</h3>
        <video
          id="my-video"
          controls
          width="600"
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
        >
          <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

    </div>
  );
};

export default Login;
