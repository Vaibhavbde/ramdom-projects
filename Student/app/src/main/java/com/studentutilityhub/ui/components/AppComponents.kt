package com.studentutilityhub.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.studentutilityhub.data.model.HomeTile
import com.studentutilityhub.data.model.NoteEntity
import com.studentutilityhub.data.model.StudyTaskEntity
import com.studentutilityhub.data.model.toReadableDate

@Composable
fun FeatureCard(tile: HomeTile, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(24.dp))
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(tile.feature.icon, contentDescription = tile.feature.title, modifier = Modifier.size(28.dp))
                if (tile.locked) Icon(Icons.Default.Lock, contentDescription = "Premium locked")
            }
            Text(tile.feature.title, style = MaterialTheme.typography.titleLarge)
            Text(tile.feature.subtitle, style = MaterialTheme.typography.bodyMedium)
        }
    }
}

@Composable
fun InsightCard(title: String, value: String) {
    Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.08f))) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(title, style = MaterialTheme.typography.labelLarge)
            Text(value, style = MaterialTheme.typography.bodyLarge)
        }
    }
}

@Composable
fun NoteCard(note: NoteEntity, onDelete: () -> Unit) {
    Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(note.title, style = MaterialTheme.typography.titleMedium)
            Text(note.body, style = MaterialTheme.typography.bodyMedium)
            Text("Updated ${note.updatedAt.toReadableDate()}", style = MaterialTheme.typography.labelMedium)
            Text(
                "Delete",
                modifier = Modifier
                    .clip(RoundedCornerShape(10.dp))
                    .background(MaterialTheme.colorScheme.secondary.copy(alpha = 0.28f))
                    .clickable(onClick = onDelete)
                    .padding(horizontal = 10.dp, vertical = 6.dp)
            )
        }
    }
}

@Composable
fun TaskCard(task: StudyTaskEntity, onToggle: () -> Unit, onDelete: () -> Unit) {
    Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(task.title, style = MaterialTheme.typography.titleMedium)
            Text(task.goal, style = MaterialTheme.typography.bodyMedium)
            Text("Due ${task.dueDate}", style = MaterialTheme.typography.labelMedium)
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(if (task.isCompleted) "Mark pending" else "Mark done", modifier = Modifier.clickable(onClick = onToggle))
                Text("Delete", modifier = Modifier.clickable(onClick = onDelete))
            }
        }
    }
}
