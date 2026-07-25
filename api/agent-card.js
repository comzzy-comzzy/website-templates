const AGENT_NAME = "DesignOnchain AI";

module.exports = function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host || "localhost";
  const baseUrl = `${protocol}://${host}`;

  return res.status(200).json({
    name: AGENT_NAME,
    description:
      "A2A design agent for custom website, brand, template, and onchain product design scoping and delivery.",
    url: `${baseUrl}/api/agent`,
    provider: {
      organization: "DesignOnchain",
    },
    pricing: "Fixed service price: 1 USDT per design task.",
    version: "1.0.0",
    protocolVersion: "0.2.0",
    capabilities: {
      streaming: false,
      pushNotifications: false,
      stateTransitionHistory: false,
    },
    defaultInputModes: ["text/plain", "application/json"],
    defaultOutputModes: ["text/plain", "application/json"],
    skills: [
      {
        id: "design-scoping",
        name: "Design project scoping",
        description:
          "Clarifies website, brand, UI/UX, and onchain product design requests, then returns next steps, delivery format, and quote guidance.",
        tags: ["design", "website", "branding", "onchain", "templates", "uiux"],
        examples: [
          "I need a landing page for an onchain product",
          "Help me choose and customize a website template",
          "Scope a brand identity and website design project",
        ],
      },
    ],
  });
};
