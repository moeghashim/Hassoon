import HassoonKit
import Foundation
import Testing
@testable import Hassoon

@Suite(.serialized)
struct MacNodeRuntimeTests {
    @Test func handleInvokeRejectsUnknownCommand() async {
        let runtime = MacNodeRuntime()
        let response = await runtime.handleInvoke(
            BridgeInvokeRequest(id: "req-1", command: "unknown.command"))
        #expect(response.ok == false)
    }

    @Test func handleInvokeRejectsEmptySystemRun() async throws {
        let runtime = MacNodeRuntime()
        let params = HassoonSystemRunParams(command: [])
        let json = String(data: try JSONEncoder().encode(params), encoding: .utf8)
        let response = await runtime.handleInvoke(
            BridgeInvokeRequest(id: "req-2", command: HassoonSystemCommand.run.rawValue, paramsJSON: json))
        #expect(response.ok == false)
    }

    @Test func handleInvokeRejectsEmptyNotification() async throws {
        let runtime = MacNodeRuntime()
        let params = HassoonSystemNotifyParams(title: "", body: "")
        let json = String(data: try JSONEncoder().encode(params), encoding: .utf8)
        let response = await runtime.handleInvoke(
            BridgeInvokeRequest(id: "req-3", command: HassoonSystemCommand.notify.rawValue, paramsJSON: json))
        #expect(response.ok == false)
    }
}
