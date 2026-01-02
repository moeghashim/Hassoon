import Foundation

enum HassoonEnv {
    static func path(_ key: String) -> String? {
        // Normalize env overrides once so UI + file IO stay consistent.
        guard let value = ProcessInfo.processInfo.environment[key]?
            .trimmingCharacters(in: .whitespacesAndNewlines),
            !value.isEmpty
        else {
            return nil
        }
        return value
    }
}

enum HassoonPaths {
    private static let configPathEnv = "HASSOON_CONFIG_PATH"
    private static let stateDirEnv = "HASSOON_STATE_DIR"

    static var stateDirURL: URL {
        if let override = HassoonEnv.path(self.stateDirEnv) {
            return URL(fileURLWithPath: override, isDirectory: true)
        }
        return FileManager.default.homeDirectoryForCurrentUser
            .appendingPathComponent(".hassoon", isDirectory: true)
    }

    static var configURL: URL {
        if let override = HassoonEnv.path(self.configPathEnv) {
            return URL(fileURLWithPath: override)
        }
        return self.stateDirURL.appendingPathComponent("hassoon.json")
    }

    static var workspaceURL: URL {
        self.stateDirURL.appendingPathComponent("workspace", isDirectory: true)
    }
}
