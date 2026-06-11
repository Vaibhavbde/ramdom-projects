package com.studentutilityhub.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.studentutilityhub.data.model.PlannerGoal
import com.studentutilityhub.data.model.StudyTaskEntity
import com.studentutilityhub.ui.components.TaskCard
import com.studentutilityhub.viewmodel.MainUiState

@Composable
fun PlannerScreen(
    state: MainUiState,
    onBack: () -> Unit,
    onAddTask: (String, String, String) -> Unit,
    onToggleTask: (StudyTaskEntity) -> Unit,
    onDeleteTask: (Long) -> Unit,
    onSaveGoals: (List<PlannerGoal>) -> Unit,
    onBackup: () -> Unit
) {
    val title = remember { mutableStateOf("") }
    val goal = remember { mutableStateOf("") }
    val dueDate = remember { mutableStateOf("") }
    val goalTitle = remember { mutableStateOf("") }
    val goalDate = remember { mutableStateOf("") }
    val progress = remember { mutableStateOf("0") }
    val goals = remember { mutableStateListOf<PlannerGoal>() }

    LaunchedEffect(state.plannerGoals) {
        goals.clear()
        goals.addAll(state.plannerGoals)
    }

    AppScreen(title = "Study Planner", onBack = onBack) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            SectionCard("Goal tracker", "Premium feature for exam prep and backlog recovery") {
                LabelledField(goalTitle.value, "Goal", onValueChange = { goalTitle.value = it })
                LabelledField(goalDate.value, "Target Date", onValueChange = { goalDate.value = it })
                LabelledField(progress.value, "Progress %", onValueChange = { progress.value = it })
                Button(
                    onClick = {
                        val item = PlannerGoal(goalTitle.value, goalDate.value, progress.value.toIntOrNull() ?: 0)
                        goals += item
                        onSaveGoals(goals.toList())
                        goalTitle.value = ""
                        goalDate.value = ""
                        progress.value = "0"
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Save Goal") }
                goals.forEach {
                    Text("${it.title} - ${it.progress}% by ${it.targetDate}")
                    LinearProgressIndicator(progress = { it.progress.coerceIn(0, 100) / 100f }, modifier = Modifier.fillMaxWidth())
                }
            }
            SectionCard("Daily checklist") {
                LabelledField(title.value, "Task", onValueChange = { title.value = it })
                LabelledField(goal.value, "Goal / Subject", onValueChange = { goal.value = it })
                LabelledField(dueDate.value, "Due Date", onValueChange = { dueDate.value = it })
                Button(
                    onClick = {
                        onAddTask(title.value, goal.value, dueDate.value)
                        title.value = ""
                        goal.value = ""
                        dueDate.value = ""
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Add Task") }
            }
            SectionCard("Checklist items") {
                if (state.tasks.isEmpty()) {
                    EmptyState("No planner items yet. Start with one study block for today.")
                } else {
                    LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        items(state.tasks, key = { it.id }) { task ->
                            TaskCard(
                                task = task,
                                onToggle = { onToggleTask(task) },
                                onDelete = { onDeleteTask(task.id) }
                            )
                        }
                    }
                }
            }
            Button(onClick = onBackup, modifier = Modifier.fillMaxWidth()) {
                Text("Back Up To Firebase")
            }
            Text(state.syncStatus)
        }
    }
}
