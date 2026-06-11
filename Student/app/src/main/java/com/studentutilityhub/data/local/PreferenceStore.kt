package com.studentutilityhub.data.local

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.studentutilityhub.data.model.PlannerGoal
import com.studentutilityhub.data.model.SubjectGradeInput
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

private val Context.preferences by preferencesDataStore(name = "student_utility_hub_prefs")

class PreferenceStore(private val context: Context) {
    private val json = Json { ignoreUnknownKeys = true }

    companion object {
        private val SGPA_TEMPLATE = stringPreferencesKey("sgpa_template")
        private val PLANNER_GOALS = stringPreferencesKey("planner_goals")
        private val PREMIUM_UNLOCKED = booleanPreferencesKey("premium_unlocked")
        private val DARK_THEME = booleanPreferencesKey("dark_theme")
    }

    val premiumUnlocked: Flow<Boolean> = context.preferences.data.map { it[PREMIUM_UNLOCKED] ?: false }
    val darkThemeEnabled: Flow<Boolean> = context.preferences.data.map { it[DARK_THEME] ?: false }
    val sgpaTemplate: Flow<List<SubjectGradeInput>> = context.preferences.data.map {
        decodeList(it[SGPA_TEMPLATE] ?: "[]")
    }
    val plannerGoals: Flow<List<PlannerGoal>> = context.preferences.data.map {
        decodeGoals(it[PLANNER_GOALS] ?: "[]")
    }

    suspend fun savePremiumUnlocked(value: Boolean) {
        context.preferences.edit { it[PREMIUM_UNLOCKED] = value }
    }

    suspend fun toggleDarkTheme(value: Boolean) {
        context.preferences.edit { it[DARK_THEME] = value }
    }

    suspend fun saveSgpaTemplate(subjects: List<SubjectGradeInput>) {
        context.preferences.edit { it[SGPA_TEMPLATE] = json.encodeToString(subjects) }
    }

    suspend fun savePlannerGoals(goals: List<PlannerGoal>) {
        context.preferences.edit { it[PLANNER_GOALS] = json.encodeToString(goals) }
    }

    private fun decodeList(raw: String): List<SubjectGradeInput> =
        runCatching { json.decodeFromString<List<SubjectGradeInput>>(raw) }.getOrDefault(emptyList())

    private fun decodeGoals(raw: String): List<PlannerGoal> =
        runCatching { json.decodeFromString<List<PlannerGoal>>(raw) }.getOrDefault(emptyList())
}
