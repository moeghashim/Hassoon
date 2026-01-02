import Foundation

public enum HassoonChatTransportEvent: Sendable {
    case health(ok: Bool)
    case tick
    case chat(HassoonChatEventPayload)
    case agent(HassoonAgentEventPayload)
    case seqGap
}

public protocol HassoonChatTransport: Sendable {
    func requestHistory(sessionKey: String) async throws -> HassoonChatHistoryPayload
    func sendMessage(
        sessionKey: String,
        message: String,
        thinking: String,
        idempotencyKey: String,
        attachments: [HassoonChatAttachmentPayload]) async throws -> HassoonChatSendResponse

    func abortRun(sessionKey: String, runId: String) async throws
    func listSessions(limit: Int?) async throws -> HassoonChatSessionsListResponse

    func requestHealth(timeoutMs: Int) async throws -> Bool
    func events() -> AsyncStream<HassoonChatTransportEvent>

    func setActiveSessionKey(_ sessionKey: String) async throws
}

extension HassoonChatTransport {
    public func setActiveSessionKey(_: String) async throws {}

    public func abortRun(sessionKey _: String, runId _: String) async throws {
        throw NSError(
            domain: "HassoonChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "chat.abort not supported by this transport"])
    }

    public func listSessions(limit _: Int?) async throws -> HassoonChatSessionsListResponse {
        throw NSError(
            domain: "HassoonChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "sessions.list not supported by this transport"])
    }
}
