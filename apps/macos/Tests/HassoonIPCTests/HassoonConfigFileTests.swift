import Foundation
import Testing
@testable import Hassoon

@Suite
struct HassoonConfigFileTests {
    @Test
    func configPathRespectsEnvOverride() {
        let override = FileManager.default.temporaryDirectory
            .appendingPathComponent("hassoon-config-\(UUID().uuidString)")
            .appendingPathComponent("hassoon.json")
            .path

        self.withEnv("HASSOON_CONFIG_PATH", value: override) {
            #expect(HassoonConfigFile.url().path == override)
        }
    }

    @Test
    func stateDirOverrideSetsConfigPath() {
        let dir = FileManager.default.temporaryDirectory
            .appendingPathComponent("hassoon-state-\(UUID().uuidString)", isDirectory: true)
            .path

        self.withEnv("HASSOON_CONFIG_PATH", value: nil) {
            self.withEnv("HASSOON_STATE_DIR", value: dir) {
                #expect(HassoonConfigFile.stateDirURL().path == dir)
                #expect(HassoonConfigFile.url().path == "\(dir)/hassoon.json")
            }
        }
    }

    private func withEnv(_ key: String, value: String?, _ body: () -> Void) {
        let previous = ProcessInfo.processInfo.environment[key]
        if let value {
            setenv(key, value, 1)
        } else {
            unsetenv(key)
        }
        defer {
            if let previous {
                setenv(key, previous, 1)
            } else {
                unsetenv(key)
            }
        }
        body()
    }
}
