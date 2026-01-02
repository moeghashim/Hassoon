package com.moeghashim.hassoon.node.ui

import androidx.compose.runtime.Composable
import com.moeghashim.hassoon.node.MainViewModel
import com.moeghashim.hassoon.node.ui.chat.ChatSheetContent

@Composable
fun ChatSheet(viewModel: MainViewModel) {
  ChatSheetContent(viewModel = viewModel)
}
