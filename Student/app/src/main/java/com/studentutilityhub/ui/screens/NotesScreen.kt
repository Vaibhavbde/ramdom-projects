package com.studentutilityhub.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.studentutilityhub.ui.components.NoteCard
import com.studentutilityhub.viewmodel.MainUiState

@Composable
fun NotesScreen(
    state: MainUiState,
    onBack: () -> Unit,
    onAddNote: (String, String) -> Unit,
    onDelete: (Long) -> Unit
) {
    val title = remember { mutableStateOf("") }
    val body = remember { mutableStateOf("") }

    AppScreen(title = "Notes", onBack = onBack) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            SectionCard("Quick note", "Stored locally for fast offline access") {
                LabelledField(title.value, "Title", onValueChange = { title.value = it })
                LabelledField(body.value, "Body", onValueChange = { body.value = it })
                Button(
                    onClick = {
                        onAddNote(title.value, body.value)
                        title.value = ""
                        body.value = ""
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Save Note") }
            }
            SectionCard("Saved notes") {
                if (state.notes.isEmpty()) {
                    EmptyState("No notes yet. Add lecture points or assignment reminders.")
                } else {
                    LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        items(state.notes, key = { it.id }) { note ->
                            NoteCard(note = note, onDelete = { onDelete(note.id) })
                        }
                    }
                }
            }
        }
    }
}
