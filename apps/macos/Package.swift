// swift-tools-version: 6.2
// Package manifest for the Hassoon macOS companion (menu bar app + IPC library).

import PackageDescription

let package = Package(
    name: "Hassoon",
    platforms: [
        .macOS(.v15),
    ],
    products: [
        .library(name: "HassoonIPC", targets: ["HassoonIPC"]),
        .executable(name: "Hassoon", targets: ["Hassoon"]),
    ],
    dependencies: [
        .package(url: "https://github.com/orchetect/MenuBarExtraAccess", exact: "1.2.2"),
        .package(url: "https://github.com/swiftlang/swift-subprocess.git", from: "0.1.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.8.0"),
        .package(url: "https://github.com/sparkle-project/Sparkle", from: "2.8.1"),
        .package(path: "../shared/HassoonKit"),
        .package(path: "../../Swabble"),
        .package(path: "../../Peekaboo/Core/PeekabooCore"),
        .package(path: "../../Peekaboo/Core/PeekabooAutomationKit"),
    ],
    targets: [
        .target(
            name: "HassoonProtocol",
            dependencies: [],
            path: "Sources/HassoonProtocol",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "HassoonIPC",
            dependencies: [],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "Hassoon",
            dependencies: [
                "HassoonIPC",
                "HassoonProtocol",
                .product(name: "HassoonKit", package: "HassoonKit"),
                .product(name: "HassoonChatUI", package: "HassoonKit"),
                .product(name: "SwabbleKit", package: "swabble"),
                .product(name: "MenuBarExtraAccess", package: "MenuBarExtraAccess"),
                .product(name: "Subprocess", package: "swift-subprocess"),
                .product(name: "Logging", package: "swift-log"),
                .product(name: "Sparkle", package: "Sparkle"),
                .product(name: "PeekabooBridge", package: "PeekabooCore"),
                .product(name: "PeekabooAutomationKit", package: "PeekabooAutomationKit"),
            ],
            exclude: [
                "Resources/Info.plist",
            ],
            resources: [
                .copy("Resources/Hassoon.icns"),
                .copy("Resources/DeviceModels"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "HassoonIPCTests",
            dependencies: [
                "HassoonIPC",
                "Hassoon",
                "HassoonProtocol",
                .product(name: "SwabbleKit", package: "swabble"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
