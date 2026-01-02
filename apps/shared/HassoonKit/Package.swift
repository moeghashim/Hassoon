// swift-tools-version: 6.2

import PackageDescription

let package = Package(
    name: "HassoonKit",
    platforms: [
        .iOS(.v17),
        .macOS(.v15),
    ],
    products: [
        .library(name: "HassoonKit", targets: ["HassoonKit"]),
        .library(name: "HassoonChatUI", targets: ["HassoonChatUI"]),
    ],
    dependencies: [
        .package(url: "https://github.com.moeghashim/ElevenLabsKit", exact: "0.1.0"),
    ],
    targets: [
        .target(
            name: "HassoonKit",
            dependencies: [
                .product(name: "ElevenLabsKit", package: "ElevenLabsKit"),
            ],
            resources: [
                .process("Resources"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "HassoonChatUI",
            dependencies: ["HassoonKit"],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "HassoonKitTests",
            dependencies: ["HassoonKit", "HassoonChatUI"],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
