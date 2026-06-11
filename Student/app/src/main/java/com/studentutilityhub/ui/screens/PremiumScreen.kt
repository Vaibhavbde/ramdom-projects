package com.studentutilityhub.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.studentutilityhub.viewmodel.MainUiState

@Composable
fun PremiumScreen(
    state: MainUiState,
    onBack: () -> Unit,
    onUnlock: () -> Unit,
    onBackup: () -> Unit
) {
    AppScreen(title = "Premium", onBack = onBack) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            SectionCard("Premium unlock", "Suggested one-time price: Rs 79") {
                Text("Includes ad-free app, study planner, and Firebase backup.")
                Button(onClick = onUnlock, modifier = Modifier.fillMaxWidth()) {
                    Text(if (state.premiumUnlocked) "Premium Active" else "Simulate Premium Unlock")
                }
            }
            SectionCard("Real payment wiring") {
                Text("Razorpay checkout manager is included in the project. Replace the test key and connect success callbacks before release.")
            }
            SectionCard("Cloud sync") {
                Text("Anonymous Firebase Auth keeps signup friction low for students.")
                Button(onClick = onBackup, modifier = Modifier.fillMaxWidth()) {
                    Text("Sign In and Backup")
                }
                Text(state.syncStatus)
            }
        }
    }
}
