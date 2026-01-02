import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

async function withTempHome<T>(fn: (home: string) => Promise<T>): Promise<T> {
  const base = await fs.mkdtemp(path.join(os.tmpdir(), "hassoon-config-"));
  const previousHome = process.env.HOME;
  process.env.HOME = base;
  try {
    return await fn(base);
  } finally {
    process.env.HOME = previousHome;
    await fs.rm(base, { recursive: true, force: true });
  }
}

/**
 * Helper to test env var overrides. Saves/restores env vars and resets modules.
 */
async function withEnvOverride<T>(
  overrides: Record<string, string | undefined>,
  fn: () => Promise<T>,
): Promise<T> {
  const saved: Record<string, string | undefined> = {};
  for (const key of Object.keys(overrides)) {
    saved[key] = process.env[key];
    if (overrides[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = overrides[key];
    }
  }
  vi.resetModules();
  try {
    return await fn();
  } finally {
    for (const key of Object.keys(saved)) {
      if (saved[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = saved[key];
      }
    }
    vi.resetModules();
  }
}

describe("config identity defaults", () => {
  let previousHome: string | undefined;

  beforeEach(() => {
    previousHome = process.env.HOME;
  });

  afterEach(() => {
    process.env.HOME = previousHome;
  });

  it("derives mentionPatterns when identity is set", async () => {
    await withTempHome(async (home) => {
      const configDir = path.join(home, ".hassoon");
      await fs.mkdir(configDir, { recursive: true });
      await fs.writeFile(
        path.join(configDir, "hassoon.json"),
        JSON.stringify(
          {
            identity: { name: "Samantha", theme: "helpful sloth", emoji: "🦥" },
            messages: {},
            routing: {},
          },
          null,
          2,
        ),
        "utf-8",
      );

      vi.resetModules();
      const { loadConfig } = await import("./config.js");
      const cfg = loadConfig();

      expect(cfg.messages?.responsePrefix).toBeUndefined();
      expect(cfg.routing?.groupChat?.mentionPatterns).toEqual([
        "\\b@?Samantha\\b",
      ]);
    });
  });

  it("does not override explicit values", async () => {
    await withTempHome(async (home) => {
      const configDir = path.join(home, ".hassoon");
      await fs.mkdir(configDir, { recursive: true });
      await fs.writeFile(
        path.join(configDir, "hassoon.json"),
        JSON.stringify(
          {
            identity: {
              name: "Samantha Sloth",
              theme: "space lobster",
              emoji: "🦞",
            },
            messages: {
              responsePrefix: "✅",
            },
            routing: {
              groupChat: { mentionPatterns: ["@hassoon"] },
            },
          },
          null,
          2,
        ),
        "utf-8",
      );

      vi.resetModules();
      const { loadConfig } = await import("./config.js");
      const cfg = loadConfig();

      expect(cfg.messages?.responsePrefix).toBe("✅");
      expect(cfg.routing?.groupChat?.mentionPatterns).toEqual(["@hassoon"]);
    });
  });

  it("respects empty responsePrefix to disable identity defaults", async () => {
    await withTempHome(async (home) => {
      const configDir = path.join(home, ".hassoon");
      await fs.mkdir(configDir, { recursive: true });
      await fs.writeFile(
        path.join(configDir, "hassoon.json"),
        JSON.stringify(
          {
            identity: { name: "Samantha", theme: "helpful sloth", emoji: "🦥" },
            messages: { responsePrefix: "" },
            routing: {},
          },
          null,
          2,
        ),
        "utf-8",
      );

      vi.resetModules();
      const { loadConfig } = await import("./config.js");
      const cfg = loadConfig();

      expect(cfg.messages?.responsePrefix).toBe("");
    });
  });

  it("does not synthesize agent/session when absent", async () => {
    await withTempHome(async (home) => {
      const configDir = path.join(home, ".hassoon");
      await fs.mkdir(configDir, { recursive: true });
      await fs.writeFile(
        path.join(configDir, "hassoon.json"),
        JSON.stringify(
          {
            identity: { name: "Samantha", theme: "helpful sloth", emoji: "🦥" },
            messages: {},
            routing: {},
          },
          null,
          2,
        ),
        "utf-8",
      );

      vi.resetModules();
      const { loadConfig } = await import("./config.js");
      const cfg = loadConfig();

      expect(cfg.messages?.responsePrefix).toBeUndefined();
      expect(cfg.routing?.groupChat?.mentionPatterns).toEqual([
        "\\b@?Samantha\\b",
      ]);
      expect(cfg.agent).toBeUndefined();
      expect(cfg.session).toBeUndefined();
    });
  });

  it("does not derive responsePrefix from identity emoji", async () => {
    await withTempHome(async (home) => {
      const configDir = path.join(home, ".hassoon");
      await fs.mkdir(configDir, { recursive: true });
      await fs.writeFile(
        path.join(configDir, "hassoon.json"),
        JSON.stringify(
          {
            identity: { name: "Hassoon", theme: "space lobster", emoji: "🦞" },
            messages: {},
            routing: {},
          },
          null,
          2,
        ),
        "utf-8",
      );

      vi.resetModules();
      const { loadConfig } = await import("./config.js");
      const cfg = loadConfig();

      expect(cfg.messages?.responsePrefix).toBeUndefined();
    });
  });
});

describe("config discord", () => {
  let previousHome: string | undefined;

  beforeEach(() => {
    previousHome = process.env.HOME;
  });

  afterEach(() => {
    process.env.HOME = previousHome;
  });

  it("loads discord guild map + dm group settings", async () => {
    await withTempHome(async (home) => {
      const configDir = path.join(home, ".hassoon");
      await fs.mkdir(configDir, { recursive: true });
      await fs.writeFile(
        path.join(configDir, "hassoon.json"),
        JSON.stringify(
          {
            discord: {
              enabled: true,
              dm: {
                enabled: true,
                allowFrom: ["steipete"],
                groupEnabled: true,
                groupChannels: ["hassoon-dm"],
              },
              guilds: {
                "123": {
                  slug: "friends-of-hassoon",
                  requireMention: false,
                  users: ["steipete"],
                  channels: {
                    general: { allow: true },
                  },
                },
              },
            },
          },
          null,
          2,
        ),
        "utf-8",
      );

      vi.resetModules();
      const { loadConfig } = await import("./config.js");
      const cfg = loadConfig();

      expect(cfg.discord?.enabled).toBe(true);
      expect(cfg.discord?.dm?.groupEnabled).toBe(true);
      expect(cfg.discord?.dm?.groupChannels).toEqual(["hassoon-dm"]);
      expect(cfg.discord?.guilds?.["123"]?.slug).toBe("friends-of-hassoon");
      expect(cfg.discord?.guilds?.["123"]?.channels?.general?.allow).toBe(true);
    });
  });
});

describe("Nix integration (U3, U5, U9)", () => {
  describe("U3: isNixMode env var detection", () => {
    it("isNixMode is false when HASSOON_NIX_MODE is not set", async () => {
      await withEnvOverride({ HASSOON_NIX_MODE: undefined }, async () => {
        const { isNixMode } = await import("./config.js");
        expect(isNixMode).toBe(false);
      });
    });

    it("isNixMode is false when HASSOON_NIX_MODE is empty", async () => {
      await withEnvOverride({ HASSOON_NIX_MODE: "" }, async () => {
        const { isNixMode } = await import("./config.js");
        expect(isNixMode).toBe(false);
      });
    });

    it("isNixMode is false when HASSOON_NIX_MODE is not '1'", async () => {
      await withEnvOverride({ HASSOON_NIX_MODE: "true" }, async () => {
        const { isNixMode } = await import("./config.js");
        expect(isNixMode).toBe(false);
      });
    });

    it("isNixMode is true when HASSOON_NIX_MODE=1", async () => {
      await withEnvOverride({ HASSOON_NIX_MODE: "1" }, async () => {
        const { isNixMode } = await import("./config.js");
        expect(isNixMode).toBe(true);
      });
    });
  });

  describe("U5: CONFIG_PATH and STATE_DIR env var overrides", () => {
    it("STATE_DIR_HASSOON defaults to ~/.hassoon when env not set", async () => {
      await withEnvOverride({ HASSOON_STATE_DIR: undefined }, async () => {
        const { STATE_DIR_HASSOON } = await import("./config.js");
        expect(STATE_DIR_HASSOON).toMatch(/\.hassoon$/);
      });
    });

    it("STATE_DIR_HASSOON respects HASSOON_STATE_DIR override", async () => {
      await withEnvOverride(
        { HASSOON_STATE_DIR: "/custom/state/dir" },
        async () => {
          const { STATE_DIR_HASSOON } = await import("./config.js");
          expect(STATE_DIR_HASSOON).toBe("/custom/state/dir");
        },
      );
    });

    it("CONFIG_PATH_HASSOON defaults to ~/.hassoon/hassoon.json when env not set", async () => {
      await withEnvOverride(
        { HASSOON_CONFIG_PATH: undefined, HASSOON_STATE_DIR: undefined },
        async () => {
          const { CONFIG_PATH_HASSOON } = await import("./config.js");
          expect(CONFIG_PATH_HASSOON).toMatch(/\.hassoon\/hassoon\.json$/);
        },
      );
    });

    it("CONFIG_PATH_HASSOON respects HASSOON_CONFIG_PATH override", async () => {
      await withEnvOverride(
        { HASSOON_CONFIG_PATH: "/nix/store/abc/hassoon.json" },
        async () => {
          const { CONFIG_PATH_HASSOON } = await import("./config.js");
          expect(CONFIG_PATH_HASSOON).toBe("/nix/store/abc/hassoon.json");
        },
      );
    });

    it("CONFIG_PATH_HASSOON uses STATE_DIR_HASSOON when only state dir is overridden", async () => {
      await withEnvOverride(
        {
          HASSOON_CONFIG_PATH: undefined,
          HASSOON_STATE_DIR: "/custom/state",
        },
        async () => {
          const { CONFIG_PATH_HASSOON } = await import("./config.js");
          expect(CONFIG_PATH_HASSOON).toBe("/custom/state/hassoon.json");
        },
      );
    });
  });

  describe("U9: telegram.tokenFile schema validation", () => {
    it("accepts config with only botToken", async () => {
      await withTempHome(async (home) => {
        const configDir = path.join(home, ".hassoon");
        await fs.mkdir(configDir, { recursive: true });
        await fs.writeFile(
          path.join(configDir, "hassoon.json"),
          JSON.stringify({
            telegram: { botToken: "123:ABC" },
          }),
          "utf-8",
        );

        vi.resetModules();
        const { loadConfig } = await import("./config.js");
        const cfg = loadConfig();
        expect(cfg.telegram?.botToken).toBe("123:ABC");
        expect(cfg.telegram?.tokenFile).toBeUndefined();
      });
    });

    it("accepts config with only tokenFile", async () => {
      await withTempHome(async (home) => {
        const configDir = path.join(home, ".hassoon");
        await fs.mkdir(configDir, { recursive: true });
        await fs.writeFile(
          path.join(configDir, "hassoon.json"),
          JSON.stringify({
            telegram: { tokenFile: "/run/agenix/telegram-token" },
          }),
          "utf-8",
        );

        vi.resetModules();
        const { loadConfig } = await import("./config.js");
        const cfg = loadConfig();
        expect(cfg.telegram?.tokenFile).toBe("/run/agenix/telegram-token");
        expect(cfg.telegram?.botToken).toBeUndefined();
      });
    });

    it("accepts config with both botToken and tokenFile", async () => {
      await withTempHome(async (home) => {
        const configDir = path.join(home, ".hassoon");
        await fs.mkdir(configDir, { recursive: true });
        await fs.writeFile(
          path.join(configDir, "hassoon.json"),
          JSON.stringify({
            telegram: {
              botToken: "fallback:token",
              tokenFile: "/run/agenix/telegram-token",
            },
          }),
          "utf-8",
        );

        vi.resetModules();
        const { loadConfig } = await import("./config.js");
        const cfg = loadConfig();
        expect(cfg.telegram?.botToken).toBe("fallback:token");
        expect(cfg.telegram?.tokenFile).toBe("/run/agenix/telegram-token");
      });
    });
  });
});

describe("talk api key fallback", () => {
  let previousEnv: string | undefined;

  beforeEach(() => {
    previousEnv = process.env.ELEVENLABS_API_KEY;
    delete process.env.ELEVENLABS_API_KEY;
  });

  afterEach(() => {
    process.env.ELEVENLABS_API_KEY = previousEnv;
  });

  it("injects talk.apiKey from profile when config is missing", async () => {
    await withTempHome(async (home) => {
      await fs.writeFile(
        path.join(home, ".profile"),
        "export ELEVENLABS_API_KEY=profile-key\n",
        "utf-8",
      );

      vi.resetModules();
      const { readConfigFileSnapshot } = await import("./config.js");
      const snap = await readConfigFileSnapshot();

      expect(snap.config?.talk?.apiKey).toBe("profile-key");
      expect(snap.exists).toBe(false);
    });
  });

  it("prefers ELEVENLABS_API_KEY env over profile", async () => {
    await withTempHome(async (home) => {
      await fs.writeFile(
        path.join(home, ".profile"),
        "export ELEVENLABS_API_KEY=profile-key\n",
        "utf-8",
      );
      process.env.ELEVENLABS_API_KEY = "env-key";

      vi.resetModules();
      const { readConfigFileSnapshot } = await import("./config.js");
      const snap = await readConfigFileSnapshot();

      expect(snap.config?.talk?.apiKey).toBe("env-key");
    });
  });
});

describe("talk.voiceAliases", () => {
  it("accepts a string map of voice aliases", async () => {
    vi.resetModules();
    const { validateConfigObject } = await import("./config.js");
    const res = validateConfigObject({
      talk: {
        voiceAliases: {
          Hassoon: "EXAVITQu4vr4xnSDxMaL",
          Roger: "CwhRBWXzGAHq8TQ4Fs17",
        },
      },
    });
    expect(res.ok).toBe(true);
  });

  it("rejects non-string voice alias values", async () => {
    vi.resetModules();
    const { validateConfigObject } = await import("./config.js");
    const res = validateConfigObject({
      talk: {
        voiceAliases: {
          Hassoon: 123,
        },
      },
    });
    expect(res.ok).toBe(false);
  });
});

describe("legacy config detection", () => {
  it("rejects routing.allowFrom", async () => {
    vi.resetModules();
    const { validateConfigObject } = await import("./config.js");
    const res = validateConfigObject({
      routing: { allowFrom: ["+15555550123"] },
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.issues[0]?.path).toBe("routing.allowFrom");
    }
  });

  it("migrates routing.allowFrom to whatsapp.allowFrom", async () => {
    vi.resetModules();
    const { migrateLegacyConfig } = await import("./config.js");
    const res = migrateLegacyConfig({
      routing: { allowFrom: ["+15555550123"] },
    });
    expect(res.changes).toContain("Moved routing.allowFrom → whatsapp.allowFrom.");
    expect(res.config?.whatsapp?.allowFrom).toEqual(["+15555550123"]);
    expect(res.config?.routing?.allowFrom).toBeUndefined();
  });

  it("surfaces legacy issues in snapshot", async () => {
    await withTempHome(async (home) => {
      const configPath = path.join(home, ".hassoon", "hassoon.json");
      await fs.mkdir(path.dirname(configPath), { recursive: true });
      await fs.writeFile(
        configPath,
        JSON.stringify({ routing: { allowFrom: ["+15555550123"] } }),
        "utf-8",
      );

      vi.resetModules();
      const { readConfigFileSnapshot } = await import("./config.js");
      const snap = await readConfigFileSnapshot();

      expect(snap.valid).toBe(false);
      expect(snap.legacyIssues.length).toBe(1);
      expect(snap.legacyIssues[0]?.path).toBe("routing.allowFrom");
    });
  });
});
