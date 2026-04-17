const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  access: ["access", "view data"],
  retention: ["retain", "store", "period"],
  security: ["encrypt", "security", "protect"],
  transfer: ["third party", "outside", "international"]
};


// 🧠 Check Compliance
function checkCompliance(text) {
  text = text.toLowerCase();

  return {
    consent: rules.consent.some(word => text.includes(word)),
    withdraw: rules.withdraw.some(word => text.includes(word)),
    erasure: rules.erasure.some(word => text.includes(word)),
    access: rules.access.some(word => text.includes(word)),
    retention: rules.retention.some(word => text.includes(word)),
    security: rules.security.some(word => text.includes(word)),
    transfer: rules.transfer.some(word => text.includes(word))
  };
}


// 📊 Generate Report
function generateReport(result) {
  return [
    {
      section: "Section 11 - Transparency",
      status: result.consent ? "✅ Compliant" : "❌ Missing",
      message: result.consent
        ? "Policy explains consent or data usage"
        : "No clear mention of user consent"
    },
    {
      section: "Section 14 - Withdrawal of Consent",
      status: result.withdraw ? "✅ Compliant" : "❌ Missing",
      message: result.withdraw
        ? "Users can withdraw consent"
        : "No option to withdraw consent"
    },
    {
      section: "Section 16 - Right to Erasure",
      status: result.erasure ? "✅ Compliant" : "❌ Missing",
      message: result.erasure
        ? "Users can delete their data"
        : "No mention of deleting user data"
    },
    {
      section: "Section 13 - Right to Access",
      status: result.access ? "✅ Compliant" : "❌ Missing",
      message: result.access
        ? "Users can access their data"
        : "No mention of accessing user data"
    },
    {
      section: "Section 9 - Data Retention",
      status: result.retention ? "✅ Compliant" : "❌ Missing",
      message: result.retention
        ? "Policy mentions data storage period"
        : "No info about how long data is stored"
    },
    {
      section: "Section 10 - Security",
      status: result.security ? "✅ Compliant" : "❌ Missing",
      message: result.security
        ? "Security measures are mentioned"
        : "No mention of data protection methods"
    },
    {
      section: "Section 26 - Cross-border Transfer",
      status: result.transfer ? "✅ Compliant" : "❌ Missing",
      message: result.transfer
        ? "Mentions international or third-party data transfer"
        : "No info about data transfer outside the country"
    }
  ];
}


// 🚀 Analyze API
app.post("/analyze", (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "No text provided" });
  }

  const result = checkCompliance(text);
  const report = generateReport(result);

  res.json(report);
});


// ▶️ Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});