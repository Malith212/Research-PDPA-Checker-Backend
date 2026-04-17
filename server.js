const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("PDPA Hybrid Backend is running 🚀");
});

const rules = {
  consent: ["consent", "agree", "permission"],
  withdrawal: ["withdraw", "unsubscribe", "opt-out"],
  erasure: ["delete", "erase", "remove"],
  access: ["access", "view data", "request data"],
  retention: ["retain", "store", "period", "keep data"],
  security: ["encrypt", "security", "protect", "safeguard"],
  transfer: ["third party", "outside", "international", "cross-border"]
};

function extractSentences(text) {
  return text
    .split(/[.?!]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function matchRule(sentence) {
  const lower = sentence.toLowerCase();

  for (const label in rules) {
    const matched = rules[label].some((word) => lower.includes(word));
    if (matched) {
      return {
        label,
        source: "rule",
        confidence: 0.95,
        evidence: sentence
      };
    }
  }

  return null;
}

async function getMLPrediction(sentence) {
  try {
    const response = await axios.post("http://localhost:6000/predict", {
      text: sentence
    });

    return response.data;
  } catch (error) {
    console.error("ML API error:", error.message);
    return null;
  }
}

async function analyzePolicy(text) {
  const sentences = extractSentences(text);

  const results = {
    consent: null,
    withdrawal: null,
    erasure: null,
    access: null,
    retention: null,
    security: null,
    transfer: null
  };

  for (const sentence of sentences) {
    const ruleResult = matchRule(sentence);

    if (ruleResult && !results[ruleResult.label]) {
      results[ruleResult.label] = ruleResult;
      continue;
    }

    const mlResult = await getMLPrediction(sentence);

    if (
      mlResult &&
      mlResult.label &&
      results[mlResult.label] === null &&
      mlResult.confidence >= 0.35
    ) {
      results[mlResult.label] = {
        label: mlResult.label,
        source: "ml",
        confidence: mlResult.confidence,
        evidence: sentence
      };
    }
  }

  return {
    totalSentences: sentences.length,
    results
  };
}

function createSection(section, data) {
  return {
    section,
    status: data ? "✅ Compliant" : "❌ Missing",
    confidence: data ? data.confidence : 0,
    source: data ? data.source : "none",
    evidence: data ? data.evidence : "No relevant sentence found"
  };
}

function generateReport(results) {
  return [
    createSection("Section 11 - Transparency", results.consent),
    createSection("Section 14 - Withdrawal of Consent", results.withdrawal),
    createSection("Section 16 - Right to Erasure", results.erasure),
    createSection("Section 13 - Right to Access", results.access),
    createSection("Section 9 - Data Retention", results.retention),
    createSection("Section 10 - Security", results.security),
    createSection("Section 26 - Cross-border Transfer", results.transfer)
  ];
}

app.post("/analyze", async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    const analysis = await analyzePolicy(text);
    const report = generateReport(analysis.results);

    res.json({
      totalSentences: analysis.totalSentences,
      report
    });
  } catch (error) {
    console.error("Analyze error:", error.message);
    res.status(500).json({ error: "Failed to analyze policy" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});