package com.studentutilityhub.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.studentutilityhub.viewmodel.MainUiState

@Composable
fun PercentageScreen(state: MainUiState, onBack: () -> Unit, onCalculate: (String, String) -> Unit) {
    val obtained = remember { mutableStateOf("") }
    val total = remember { mutableStateOf("") }

    AppScreen(title = "Percentage Calculator", onBack = onBack) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            SectionCard("Enter marks", "Works for exams, internals, or assignment totals") {
                LabelledField(obtained.value, "Obtained Marks", onValueChange = { obtained.value = it })
                LabelledField(total.value, "Total Marks", onValueChange = { total.value = it })
                Button(onClick = { onCalculate(obtained.value, total.value) }, modifier = Modifier.fillMaxWidth()) {
                    Text("Calculate")
                }
            }
            SectionCard("Result") {
                Text(state.percentageSummary ?: "Your result will appear here.")
            }
        }
    }
}
