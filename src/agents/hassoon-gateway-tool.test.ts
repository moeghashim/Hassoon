import { describe, expect, it, vi } from "vitest";

import { createHassoonTools } from "./hassoon-tools.js";

describe("hassoon_gateway tool", () => {
  it("schedules SIGUSR1 restart", async () => {
    vi.useFakeTimers();
    const kill = vi.spyOn(process, "kill").mockImplementation(() => true);

    try {
      const tool = createHassoonTools().find(
        (candidate) => candidate.name === "hassoon_gateway",
      );
      expect(tool).toBeDefined();
      if (!tool) throw new Error("missing hassoon_gateway tool");

      const result = await tool.execute("call1", {
        action: "restart",
        delayMs: 0,
      });
      expect(result.details).toMatchObject({
        ok: true,
        pid: process.pid,
        signal: "SIGUSR1",
        delayMs: 0,
      });

      expect(kill).not.toHaveBeenCalled();
      await vi.runAllTimersAsync();
      expect(kill).toHaveBeenCalledWith(process.pid, "SIGUSR1");
    } finally {
      kill.mockRestore();
      vi.useRealTimers();
    }
  });
});
