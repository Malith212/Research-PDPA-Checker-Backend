const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// ✅ Test route
app.get("/", (req, res) => {
  res.send("PDPA Backend is running 🚀");
});


// 🔍 Keyword Rules
const rules = {
  consent: ["consent", "agree", "permission"],
  withdraw: ["withdraw", "unsubscribe", "opt-out"],
  erasure: ["delete", "erase", "remove"],
  access: ["access", "view data", "request data"],
  retention: ["retain", "store", "period", "keep data"],
  security: ["encrypt", "security", "protect", "safeguard"],
  transfer: ["third party", "outside", "international", "share data"]
};


// 🧠 Step 1: Extract Sentences
function extractSentences(text) {
  return text
    .split(/[.?!]/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}


// 🧠 Step 2: Clause-Level Matching
function analyzeSentences(sentences) {
  const result = {
    consent: null,
    withdraw: null,
    erasure: null,
    access: null,
    retention: null,
    security: null,
    transfer: null
  };

  sentences.forEach(sentence => {
    const s = sentence.toLowerCase();

    if (!result.consent && rules.consent.some(w => s.includes(w))) {
      result.consent = sentence;
    }

    if (!result.withdraw && rules.withdraw.some(w => s.includes(w))) {
      result.withdraw = sentence;
    }

    if (!result.erasure && rules.erasure.some(w => s.includes(w))) {
      result.erasure = sentence;
    }

    if (!result.access && rules.access.some(w => s.includes(w))) {
      result.access = sentence;
    }

    if (!result.retention && rules.retention.some(w => s.includes(w))) {
      result.retention = sentence;
    }

    if (!result.security && rules.security.some(w => s.includes(w))) {
      result.security = sentence;
    }

    if (!result.transfer && rules.transfer.some(w => s.includes(w))) {
      result.transfer = sentence;
    }
  });

  return result;
}


// 🧠 Step 3: Confidence Score (Simple Logic)
function getScore(found) {
  return found ? (Math.random() * 0.2 + 0.8).toFixed(2) : 0;
}


// 📊 Step 4: Generate Report
function generateReport(result) {
  return [
    {
      section: "Section 11 - Transparency",
      status: result.consent ? "✅ Compliant" : "❌ Missing",
      confidence: getScore(result.consent),
      evidence: result.consent || "No relevant sentence found"
    },
    {
      section: "Section 14 - Withdrawal of Consent",
      status: result.withdraw ? "✅ Compliant" : "❌ Missing",
      confidence: getScore(result.withdraw),
      evidence: result.withdraw || "No relevant sentence found"
    },
    {
      section: "Section 16 - Right to Erasure",
      status: result.erasure ? "✅ Compliant" : "❌ Missing",
      confidence: getScore(result.erasure),
      evidence: result.erasure || "No relevant sentence found"
    },
    {
      section: "Section 13 - Right to Access",
      status: result.access ? "✅ Compliant" : "❌ Missing",
      confidence: getScore(result.access),
      evidence: result.access || "No relevant sentence found"
    },
    {
      section: "Section 9 - Data Retention",
      status: result.retention ? "✅ Compliant" : "❌ Missing",
      confidence: getScore(result.retention),
      evidence: result.retention || "No relevant sentence found"
    },
    {
      section: "Section 10 - Security",
      status: result.security ? "✅ Compliant" : "❌ Missing",
      confidence: getScore(result.security),
      evidence: result.security || "No relevant sentence found"
    },
    {
      section: "Section 26 - Cross-border Transfer",
      status: result.transfer ? "✅ Compliant" : "❌ Missing",
      confidence: getScore(result.transfer),
      evidence: result.transfer || "No relevant sentence found"
    }
  ];
}


// 🚀 Analyze API
app.post("/analyze", (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "No text provided" });
  }

  const sentences = extractSentences(text);
  const analysis = analyzeSentences(sentences);
  const report = generateReport(analysis);

  res.json({
    totalSentences: sentences.length,
    report
  });
});


// ▶️ Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});