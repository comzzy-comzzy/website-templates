const AGENT_NAME = "DesignOnchain AI";

const OFFER = {
  capability:
    "DesignOnchain AI helps users scope and request custom website, brand, and onchain product design deliverables.",
  triggers: ["website design", "landing page", "brand identity", "onchain design", "template", "UI/UX"],
  pricing: "Fixed service price: 1 USDT per design task.",
  delivery:
    "Deliverables can include design briefs, website template recommendations, page structure, copy direction, HTML/CSS template files, and revision notes.",
};

function setHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Cache-Control", "no-store");
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1024 * 1024) {
        req.destroy();
        reject(new Error("Request body is too large"));
      }
    });
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (_) {
        resolve({ text: data });
      }
    });
    req.on("error", reject);
  });
}

function collectText(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(collectText).filter(Boolean).join(" ");
  if (typeof value !== "object") return String(value);

  if (value.text) return collectText(value.text);
  if (value.content) return collectText(value.content);
  if (value.parts) return collectText(value.parts);
  if (value.message) return collectText(value.message);
  if (value.messages) return collectText(value.messages);
  if (value.prompt) return collectText(value.prompt);
  if (value.input) return collectText(value.input);
  if (value.query) return collectText(value.query);
  if (value.params) return collectText(value.params);

  return "";
}

function buildReply(userText) {
  const request = userText && userText.trim() ? userText.trim() : "your design request";

  return [
    `Hello, I am ${AGENT_NAME}. I am online and ready to help with ${request}.`,
    "",
    OFFER.capability,
    "",
    "To scope this correctly, please share: project type, target audience, preferred style, required pages/screens, brand assets, timeline, and whether you need final HTML/CSS files or design direction only.",
    "",
    `Pricing: ${OFFER.pricing}`,
    `Delivery: ${OFFER.delivery}`,
  ].join("\n");
}

function a2aMessage(text) {
  return {
    role: "agent",
    parts: [{ type: "text", text }],
  };
}

function jsonRpcResponse(body, text) {
  const taskId = body?.params?.id || body?.params?.taskId || body?.id || `designonchain-${Date.now()}`;
  const message = a2aMessage(text);

  return {
    jsonrpc: "2.0",
    id: body?.id ?? null,
    result: {
      id: taskId,
      status: {
        state: "completed",
        message,
      },
      artifacts: [
        {
          name: "DesignOnchain AI response",
          parts: message.parts,
        },
      ],
      message,
      response: text,
    },
  };
}

module.exports = async function handler(req, res) {
  setHeaders(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method === "GET") {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(200).json({
      status: "ok",
      name: AGENT_NAME,
      service: "A2A",
      ...OFFER,
      endpoints: {
        agent: "/api/agent",
        a2a: "/a2a",
        card: "/.well-known/agent.json",
      },
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET,POST,OPTIONS");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = await readBody(req);
    const text = buildReply(collectText(body));

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    if (body && body.jsonrpc === "2.0") {
      return res.status(200).json(jsonRpcResponse(body, text));
    }

    return res.status(200).json({
      status: "ok",
      name: AGENT_NAME,
      message: text,
      data: {
        capability: OFFER.capability,
        pricing: OFFER.pricing,
        delivery: OFFER.delivery,
      },
    });
  } catch (error) {
    return res.status(200).json({
      status: "ok",
      name: AGENT_NAME,
      message: buildReply("a new design request"),
      warning: error.message,
    });
  }
};
