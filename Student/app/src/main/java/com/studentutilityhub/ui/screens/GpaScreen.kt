package com.studentutilityhub.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.studentutilityhub.data.model.SubjectGradeInput
import com.studentutilityhub.domain.pretty
import com.studentutilityhub.viewmodel.MainUiState

@Composable
fun GpaScreen(state: MainUiState, onBack: () -> Unit, onCalculate: (List<SubjectGradeInput>) -> Unit) {
    val subject = remember { mutableStateOf("") }
    val credits = remember { mutableStateOf("") }
    val gradePoint = remember { mutableStateOf("") }
    val items = remember { mutableStateListOf<SubjectGradeInput>() }

    AppScreen(title = "GPA / SGPA", onBack = onBack) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            SectionCard("Add subject", "MSBTE-friendly: use subject credits and grade points") {
                LabelledField(subject.value, "Subject", onValueChange = { subject.value = it })
                LabelledField(credits.value, "Credits", onValueChange = { credits.value = it })
                LabelledField(gradePoint.value, "Grade Point (0-10)", onValueChange = { gradePoint.value = it })
                Button(
                    onClick = {
                        runCatching {
                            items += SubjectGradeInput(subject.value, credits.value.toFloat(), gradePoint.value.toFloat())
                            subject.value = ""
                            credits.value = ""
                            gradePoint.value = ""
                        }
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Add Subject") }
            }
            SectionCard("Subjects") {
                if (items.isEmpty()) {
                    Text("Add at least one subject.")
                } else {
                    items.forEach { Text("${it.subject}: ${it.credits} credits x GP ${it.gradePoint}") }
                    Button(onClick = { onCalculate(items.toList()) }, modifier = Modifier.fillMaxWidth()) {
                        Text("Calculate SGPA")
                    }
                }
            }
            SectionCard("Result") {
                Text(state.sgpa?.summary ?: "SGPA will appear here.")
                state.sgpa?.let { Text("Weighted points: ${it.weightedPoints.toDouble().pretty()}") }
            }
        }
    }
}
