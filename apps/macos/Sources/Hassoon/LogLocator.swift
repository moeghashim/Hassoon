import Foundation

enum LogLocator {
    private static let logDir = URL(fileURLWithPath: "/tmp/hassoon")
    private static let stdoutLog = logDir.appendingPathComponent("hassoon-stdout.log")
    private static let gatewayLog = logDir.appendingPathComponent("hassoon-gateway.log")

    private static func modificationDate(for url: URL) -> Date {
        (try? url.resourceValues(forKeys: [.contentModificationDateKey]).contentModificationDate) ?? .distantPast
    }

    /// Returns the newest log file under /tmp/hassoon/ (rolling or stdout), or nil if none exist.
    static func bestLogFile() -> URL? {
        let fm = FileManager.default
        let files = (try? fm.contentsOfDirectory(
            at: self.logDir,
            includingPropertiesForKeys: [.contentModificationDateKey],
            options: [.skipsHiddenFiles])) ?? []

        return files
            .filter { $0.lastPathComponent.hasPrefix("hassoon") && $0.pathExtension == "log" }
            .max { lhs, rhs in
                self.modificationDate(for: lhs) < self.modificationDate(for: rhs)
            }
    }

    /// Path to use for launchd stdout/err.
    static var launchdLogPath: String {
        stdoutLog.path
    }

    /// Path to use for the embedded Gateway launchd job stdout/err.
    static var launchdGatewayLogPath: String {
        gatewayLog.path
    }
}
