package com.studentutilityhub.data.model

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Assignment
import androidx.compose.material.icons.filled.AutoGraph
import androidx.compose.material.icons.filled.Calculate
import androidx.compose.material.icons.filled.CloudSync
import androidx.compose.material.icons.filled.EventAvailable
import androidx.compose.material.icons.filled.NoteAlt
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.SwapHoriz
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.room.Entity
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

enum class FeatureCategory {
    Core,
    Premium
}

enum class UtilityFeature(
    val title: String,
    val subtitle: String,
    val icon: ImageVector,
    val category: FeatureCategory
) {
    Percentage("Percentage", "Marks to percentage in one tap", Icons.Default.Calculate, FeatureCategory.Core),
    Gpa("GPA / SGPA", "Flexible credits for MSBTE-style grading", Icons.Default.School, FeatureCategory.Core),
    Attendance("Attendance", "Track 75% target and leave margin", Icons.Default.EventAvailable, FeatureCategory.Core),
    Converter("Unit Converter", "Length, weight, and temperature", Icons.Default.SwapHoriz, FeatureCategory.Core),
    Notes("Notes", "Quick offline notes for class and exams", Icons.Default.NoteAlt, FeatureCategory.Core),
    Planner("Study Planner", "Goal tracking with daily checklist", Icons.Default.Assignment, FeatureCategory.Premium),
    Cloud("Cloud Backup", "Sync notes and planner to Firebase", Icons.Default.CloudSync, FeatureCategory.Premium),
    Insights("Smart Snapshot", "Daily academic health summary", Icons.Default.AutoGraph, FeatureCategory.Premium)
}

@Entity(tableName = "notes")
data class NoteEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String,
    val body: String,
    val updatedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "study_tasks")
data class StudyTaskEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String,
    val goal: String,
    val dueDate: String,
    val isCompleted: Boolean = false,
    val updatedAt: Long = System.currentTimeMillis()
)

@Serializable
data class SubjectGradeInput(
    val subject: String,
    val credits: Float,
    val gradePoint: Float
)

@Serializable
data class PlannerGoal(
    val title: String,
    val targetDate: String,
    val progress: Int
)

data class HomeTile(
    val feature: UtilityFeature,
    val locked: Boolean
)

data class PercentageResult(
    val percentage: Double,
    val summary: String
)

data class GpaResult(
    val sgpa: Double,
    val totalCredits: Float,
    val weightedPoints: Float,
    val summary: String
)

data class AttendanceResult(
    val currentPercentage: Double,
    val classesNeededForTarget: Int,
    val safeBunks: Int,
    val summary: String
)

enum class ConverterType(val label: String) {
    Length("Length"),
    Weight("Weight"),
    Temperature("Temperature")
}

data class ConversionOption(
    val type: ConverterType,
    val fromUnit: String,
    val toUnit: String
)

data class ConversionResult(
    val output: Double,
    val formulaHint: String
)

data class DashboardSnapshot(
    val attendanceHealth: String,
    val plannerHealth: String,
    val suggestion: String
)

fun Long.toReadableDate(): String =
    SimpleDateFormat("dd MMM, hh:mm a", Locale.getDefault()).format(Date(this))
