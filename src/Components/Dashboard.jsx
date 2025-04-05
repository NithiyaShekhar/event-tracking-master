import React, { useEffect, useState } from "react";
import { Table, Card, Spin } from "antd";

const EventDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) => {
        // Mock data transformation
        const transformedData = data.map((item) => ({
          key: item.id,
          event_id: item.id,
          event_type: "Click",
          event_timestamp: new Date().toISOString(),
          page_url: "https://example.com",
          device_type: "Desktop",
          browser: "Chrome",
          location_country: "USA",
          location_city: "New York",
        }));
        setEvents(transformedData);
      })
      .catch((error) => console.error("Error fetching events:", error))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { title: "Event ID", dataIndex: "event_id", key: "event_id" },
    { title: "Event Type", dataIndex: "event_type", key: "event_type" },
    { title: "Timestamp", dataIndex: "event_timestamp", key: "event_timestamp" },
    { title: "Page URL", dataIndex: "page_url", key: "page_url" },
    { title: "Device Type", dataIndex: "device_type", key: "device_type" },
    { title: "Browser", dataIndex: "browser", key: "browser" },
    { title: "Country", dataIndex: "location_country", key: "location_country" },
    { title: "City", dataIndex: "location_city", key: "location_city" },
  ];

  return (
    <Card title="Event Dashboard" style={{ margin: 20 }}>
      {loading ? <Spin size="large" /> : <Table columns={columns} dataSource={events} pagination={{ pageSize: 5 }} />}
    </Card>
  );
};

export default EventDashboard;
