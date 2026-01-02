package com.moeghashim.hassoon.node

import android.app.Application

class NodeApp : Application() {
  val runtime: NodeRuntime by lazy { NodeRuntime(this) }
}

