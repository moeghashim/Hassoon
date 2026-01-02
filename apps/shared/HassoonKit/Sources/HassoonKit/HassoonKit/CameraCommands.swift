import Foundation

public enum HassoonCameraCommand: String, Codable, Sendable {
    case list = "camera.list"
    case snap = "camera.snap"
    case clip = "camera.clip"
}

public enum HassoonCameraFacing: String, Codable, Sendable {
    case back
    case front
}

public enum HassoonCameraImageFormat: String, Codable, Sendable {
    case jpg
    case jpeg
}

public enum HassoonCameraVideoFormat: String, Codable, Sendable {
    case mp4
}

public struct HassoonCameraSnapParams: Codable, Sendable, Equatable {
    public var facing: HassoonCameraFacing?
    public var maxWidth: Int?
    public var quality: Double?
    public var format: HassoonCameraImageFormat?
    public var deviceId: String?
    public var delayMs: Int?

    public init(
        facing: HassoonCameraFacing? = nil,
        maxWidth: Int? = nil,
        quality: Double? = nil,
        format: HassoonCameraImageFormat? = nil,
        deviceId: String? = nil,
        delayMs: Int? = nil)
    {
        self.facing = facing
        self.maxWidth = maxWidth
        self.quality = quality
        self.format = format
        self.deviceId = deviceId
        self.delayMs = delayMs
    }
}

public struct HassoonCameraClipParams: Codable, Sendable, Equatable {
    public var facing: HassoonCameraFacing?
    public var durationMs: Int?
    public var includeAudio: Bool?
    public var format: HassoonCameraVideoFormat?
    public var deviceId: String?

    public init(
        facing: HassoonCameraFacing? = nil,
        durationMs: Int? = nil,
        includeAudio: Bool? = nil,
        format: HassoonCameraVideoFormat? = nil,
        deviceId: String? = nil)
    {
        self.facing = facing
        self.durationMs = durationMs
        self.includeAudio = includeAudio
        self.format = format
        self.deviceId = deviceId
    }
}
