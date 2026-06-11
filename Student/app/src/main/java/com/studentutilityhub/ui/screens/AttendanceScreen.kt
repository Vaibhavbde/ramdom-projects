package com.studentutilityhub.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.studentutilityhub.domain.pretty
import com.studentutilityhub.viewmodel.MainUiState

@Composable
fun AttendanceScreen(state: MainUiState, onBack: () -> Unit, onCalculate: (String, String, Int) -> Unit) {
    val attended = remember { mutableStateOf("") }
    val total = remember { mutableStateOf("") }
    val target = remember { mutableIntStateOf(75) }

    AppScreen(title = "Attendance Calculator", onBack = onBack) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            SectionCard("Track attendance", "Built around the common 75% requirement") {
                LabelledField(attended.value, "Classes Attended", onValueChange = { attended.value = it })
                LabelledField(total.value, "Total Classes", onValueChange = { total.value = it })
                TargetSlider(target.intValue, onTargetChange = { target.intValue = it })
                Button(onClick = { onCalculate(attended.value, total.value, target.intValue) }, modifier = Modifier.fillMaxWidth()) {
                    Text("Check Status")
                }
            }
            SectionCard("Result") {
                Text(state.attendance?.summary ?: "Attendance guidance will appear here.")
                state.attendance?.let {
                    Text("Current attendance: ${it.currentPercentage.pretty()}%")
                }
            }
        }
    }
}
