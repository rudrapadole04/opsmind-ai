import { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  const ask = () => {
    setAnswer("");
    setSources([]);

    const es = new EventSource(
      `http://localhost:3000/ask/stream?q=${encodeURIComponent(question)}`
    );

    es.onmessage = (event) => {
      console.log("TOKEN:", event.data);
      setAnswer((prev) => prev + event.data);
    };

    es.addEventListener("citations", (event) => {
      console.log("SOURCES:", event.data);
      setSources(JSON.parse(event.data));
      es.close();
    });

    es.onerror = (err) => {
      console.error("SSE ERROR", err);
      es.close();
    };
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
      <h1>🧠 OpsMind AI</h1>

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
        style={{ width: "70%", padding: "10px" }}
      />
      <button
        onClick={ask}
        style={{ padding: "10px 20px", marginLeft: "10px" }}
      >
        Ask
      </button>

      {loading && <p>Thinking...</p>}

      {/* ✅ STREAMING ANSWER */}
      <p style={{ whiteSpace: "pre-wrap", marginTop: "20px" }}>{answer}</p>

      {/* ✅ SOURCES */}
      {sources.length > 0 && (
        <>
          <h3>📚 References</h3>
          {sources.map((s, i) => (
            <div key={i} style={{ fontSize: "14px", color: "#aaa" }}>
              {s.document} — page {s.page}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
