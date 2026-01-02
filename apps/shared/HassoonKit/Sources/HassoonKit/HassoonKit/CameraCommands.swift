import Foundation

public enum HassoonCameraCommand: String, Codable, Sendable {
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

    public init(
        facing: HassoonCameraFacing? = nil,
        maxWidth: Int? = nil,
        quality: Double? = nil,
        format: HassoonCameraImageFormat? = nil)
    {
        self.facing = facing
        self.maxWidth = maxWidth
        self.quality = quality
        self.format = format
    }
}

public struct HassoonCameraClipParams: Codable, Sendable, Equatable {
    public var facing: HassoonCameraFacing?
    public var durationMs: Int?
    public var includeAudio: Bool?
    public var format: HassoonCameraVideoFormat?

    public init(
        facing: HassoonCameraFacing? = nil,
        durationMs: Int? = nil,
        includeAudio: Bool? = nil,
        format: HassoonCameraVideoFormat? = nil)
    {
        self.facing = facing
        self.durationMs = durationMs
        self.includeAudio = includeAudio
        self.format = format
    }
}
