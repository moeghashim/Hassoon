package com.moeghashim.hassoon.node.protocol

import org.junit.Assert.assertEquals
import org.junit.Test

class HassoonProtocolConstantsTest {
  @Test
  fun canvasCommandsUseStableStrings() {
    assertEquals("canvas.present", HassoonCanvasCommand.Present.rawValue)
    assertEquals("canvas.hide", HassoonCanvasCommand.Hide.rawValue)
    assertEquals("canvas.navigate", HassoonCanvasCommand.Navigate.rawValue)
    assertEquals("canvas.eval", HassoonCanvasCommand.Eval.rawValue)
    assertEquals("canvas.snapshot", HassoonCanvasCommand.Snapshot.rawValue)
  }

  @Test
  fun a2uiCommandsUseStableStrings() {
    assertEquals("canvas.a2ui.push", HassoonCanvasA2UICommand.Push.rawValue)
    assertEquals("canvas.a2ui.pushJSONL", HassoonCanvasA2UICommand.PushJSONL.rawValue)
    assertEquals("canvas.a2ui.reset", HassoonCanvasA2UICommand.Reset.rawValue)
  }

  @Test
  fun capabilitiesUseStableStrings() {
    assertEquals("canvas", HassoonCapability.Canvas.rawValue)
    assertEquals("camera", HassoonCapability.Camera.rawValue)
    assertEquals("screen", HassoonCapability.Screen.rawValue)
    assertEquals("voiceWake", HassoonCapability.VoiceWake.rawValue)
  }

  @Test
  fun screenCommandsUseStableStrings() {
    assertEquals("screen.record", HassoonScreenCommand.Record.rawValue)
  }
}
