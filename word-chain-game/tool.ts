import { connect as natsConnect } from "@nats-io/transport-node";
import { Agents, loadContextOptions, parseNatsUrl } from "@synadia-ai/agents";

async function main(): Promise<void> {
  const opts = process.env["NATS_CONTEXT"]
    ? await loadContextOptions(process.env["NATS_CONTEXT"])
    : process.env["NATS_URL"]
      ? parseNatsUrl(process.env["NATS_URL"])
      : { servers: "nats://127.0.0.1:4222" };

  //일단 연결만 한다.
  const nc = await natsConnect(opts);
  const agents = new Agents({ nc });

  // 프롬프트를 받아서 다른 에이전트 중 하나에게만 전달.
  try {
    const [agent] = await agents.discover();
    if (!agent) {
      console.error("no agents found — start the reference agent first.");
      process.exit(2);
    }

    for await (const msg of await agent.prompt(text)) {
      switch (msg.type) {
        case "response":
          stdout.write(msg.text);
          break;

        case "status":
          if (msg.status === "done") stdout.write("\n");
          break;
      }
    }
  } finally {
    await agents.close();
    await nc.close();
  }
}

void main().catch((err: unknown) => {
  console.error("discover failed:", err);
  process.exit(1);
});
