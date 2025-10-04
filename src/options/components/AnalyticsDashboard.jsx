import React from "react";

const AnalyticsDashboard = ({ analytics }) => {
  const { sessions = [], readingProgress = {} } = analytics || {};

  const totalFocusTime = sessions.reduce(
    (sum, s) => sum + (s.duration || 0),
    0
  );
  const totalSessions = sessions.length;

  return (
    <div className="analytics-dashboard">
      <h4>Focus Session Analytics</h4>
      <div className="analytics-summary">
        <div>
          <strong>Total Sessions:</strong> {totalSessions}
        </div>
        <div>
          <strong>Total Focus Time:</strong> {Math.round(totalFocusTime / 60)}{" "}
          min
        </div>
        <div>
          <strong>Average Session:</strong>{" "}
          {totalSessions ? Math.round(totalFocusTime / totalSessions / 60) : 0}{" "}
          min
        </div>
      </div>
      <h4>Recent Sessions</h4>
      <table className="analytics-table">
        <thead>
          <tr>
            <th>Start</th>
            <th>End</th>
            <th>Duration</th>
            <th>Domain</th>
          </tr>
        </thead>
        <tbody>
          {sessions
            .slice(-10)
            .reverse()
            .map((s, i) => (
              <tr key={i}>
                <td>{new Date(s.start).toLocaleString()}</td>
                <td>{new Date(s.end).toLocaleString()}</td>
                <td>{Math.round((s.duration || 0) / 60)} min</td>
                <td>{s.domain}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <h4>Reading Progress</h4>
      <table className="analytics-table">
        <thead>
          <tr>
            <th>Domain</th>
            <th>Words Read</th>
            <th>Time Spent</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(readingProgress).map(([domain, data]) => (
            <tr key={domain}>
              <td>{domain}</td>
              <td>{data.wordsRead}</td>
              <td>{Math.round((data.timeSpent || 0) / 60)} min</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnalyticsDashboard;
