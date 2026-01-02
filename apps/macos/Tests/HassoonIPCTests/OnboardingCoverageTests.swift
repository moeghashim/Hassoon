import Testing
@testable import Hassoon

@Suite(.serialized)
@MainActor
struct OnboardingCoverageTests {
    @Test func exerciseOnboardingPages() {
        OnboardingView.exerciseForTesting()
    }
}
