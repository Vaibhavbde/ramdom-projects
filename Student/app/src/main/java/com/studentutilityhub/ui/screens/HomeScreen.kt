package com.studentutilityhub.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.studentutilityhub.ads.AdBanner
import com.studentutilityhub.data.model.UtilityFeature
import com.studentutilityhub.ui.components.FeatureCard
import com.studentutilityhub.ui.components.InsightCard
import com.studentutilityhub.ui.navigation.AppRoute
import com.studentutilityhub.viewmodel.MainUiState

@Composable
fun HomeScreen(
    state: MainUiState,
    onTileClick: (String) -> Unit,
    onPremiumClick: () -> Unit
) {
    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("Student Utility Hub", style = MaterialTheme.typography.headlineMedium)
        Text("One clean dashboard for marks, attendance, notes, and planning.")

        SectionCard(title = "Smart Snapshot", subtitle = state.snapshot.suggestion) {
            InsightCard("Attendance", state.snapshot.attendanceHealth)
            InsightCard("Planner", state.snapshot.plannerHealth)
            if (!state.premiumUnlocked) {
                Button(onClick = onPremiumClick, modifier = Modifier.fillMaxWidth()) {
                    Text("Unlock Premium")
                }
            }
        }

        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            contentPadding = PaddingValues(bottom = 12.dp),
            modifier = Modifier.weight(1f)
        ) {
            items(state.homeTiles) { tile ->
                FeatureCard(tile = tile) {
                    val route = when (tile.feature) {
                        UtilityFeature.Percentage -> AppRoute.Percentage.route
                        UtilityFeature.Gpa -> AppRoute.Gpa.route
                        UtilityFeature.Attendance -> AppRoute.Attendance.route
                        UtilityFeature.Converter -> AppRoute.Converter.route
                        UtilityFeature.Notes -> AppRoute.Notes.route
                        else -> if (tile.locked) AppRoute.Premium.route else AppRoute.Planner.route
                    }
                    onTileClick(route)
                }
            }
        }

        if (!state.premiumUnlocked) AdBanner()
    }
}
