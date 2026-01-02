import HassoonKit
import Network
import Testing
@testable import Hassoon

@Suite struct BridgeEndpointIDTests {
    @Test func stableIDForServiceDecodesAndNormalizesName() {
        let endpoint = NWEndpoint.service(
            name: "Hassoon\\032Bridge   \\032  Node\n",
            type: "_hassoon-bridge._tcp",
            domain: "local.",
            interface: nil)

        #expect(BridgeEndpointID.stableID(endpoint) == "_hassoon-bridge._tcp|local.|Hassoon Bridge Node")
    }

    @Test func stableIDForNonServiceUsesEndpointDescription() {
        let endpoint = NWEndpoint.hostPort(host: NWEndpoint.Host("127.0.0.1"), port: 4242)
        #expect(BridgeEndpointID.stableID(endpoint) == String(describing: endpoint))
    }

    @Test func prettyDescriptionDecodesBonjourEscapes() {
        let endpoint = NWEndpoint.service(
            name: "Hassoon\\032Bridge",
            type: "_hassoon-bridge._tcp",
            domain: "local.",
            interface: nil)

        let pretty = BridgeEndpointID.prettyDescription(endpoint)
        #expect(pretty == BonjourEscapes.decode(String(describing: endpoint)))
        #expect(!pretty.localizedCaseInsensitiveContains("\\032"))
    }
}
