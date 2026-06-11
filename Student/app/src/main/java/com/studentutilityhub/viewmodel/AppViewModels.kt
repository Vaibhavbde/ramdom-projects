package com.studentutilityhub.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.studentutilityhub.AppContainer
import com.studentutilityhub.data.model.AttendanceResult
import com.studentutilityhub.data.model.ConversionOption
import com.studentutilityhub.data.model.ConversionResult
import com.studentutilityhub.data.model.DashboardSnapshot
import com.studentutilityhub.data.model.GpaResult
import com.studentutilityhub.data.model.HomeTile
import com.studentutilityhub.data.model.NoteEntity
import com.studentutilityhub.data.model.PlannerGoal
import com.studentutilityhub.data.model.StudyTaskEntity
import com.studentutilityhub.data.model.SubjectGradeInput
import com.studentutilityhub.data.model.FeatureCategory
import com.studentutilityhub.data.model.UtilityFeature
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class MainViewModel(private val container: AppContainer) : ViewModel() {
    val premiumUnlocked = container.premiumRepository.premiumUnlocked.stateIn(
        viewModelScope, SharingStarted.WhileSubscribed(5000), false
    )

    val notes = container.database.noteDao().observeAll().stateIn(
        viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList()
    )

    val tasks = container.database.studyTaskDao().observeAll().stateIn(
        viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList()
    )

    val plannerGoals = container.preferenceStore.plannerGoals.stateIn(
        viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList()
    )

    private val attendanceResult = MutableStateFlow<AttendanceResult?>(null)
    private val percentageResult = MutableStateFlow<String?>(null)
    private val sgpaResult = MutableStateFlow<GpaResult?>(null)
    private val conversionResult = MutableStateFlow<ConversionResult?>(null)
    private val syncStatus = container.cloudSyncRepository.syncStatus().stateIn(
        viewModelScope, SharingStarted.WhileSubscribed(5000), "Checking sync"
    )

    val uiState: StateFlow<MainUiState> = combine(
        premiumUnlocked,
        notes,
        tasks,
        plannerGoals,
        attendanceResult,
        percentageResult,
        sgpaResult,
        conversionResult,
        syncStatus
    ) { premium, notesList, taskList, goals, attendance, percentage, sgpa, conversion, sync ->
        MainUiState(
            homeTiles = UtilityFeature.entries.map { feature ->
                HomeTile(feature = feature, locked = feature.category == FeatureCategory.Premium && !premium)
            },
            premiumUnlocked = premium,
            notes = notesList,
            tasks = taskList,
            plannerGoals = goals,
            attendance = attendance,
            percentageSummary = percentage,
            sgpa = sgpa,
            conversion = conversion,
            syncStatus = sync,
            snapshot = container.calculatorEngine.generateSnapshot(attendance, taskList)
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), MainUiState())

    fun calculatePercentage(obtained: String, total: String) = viewModelScope.launch {
        percentageResult.value = runCatching {
            container.calculatorEngine.calculatePercentage(
                obtained = obtained.toDouble(),
                total = total.toDouble()
            ).summary
        }.getOrElse { it.message ?: "Invalid values" }
    }

    fun calculateSgpa(items: List<SubjectGradeInput>) = viewModelScope.launch {
        sgpaResult.value = runCatching {
            container.preferenceStore.saveSgpaTemplate(items)
            container.calculatorEngine.calculateSgpa(items)
        }.getOrElse { GpaResult(0.0, 0f, 0f, it.message ?: "Invalid subjects") }
    }

    fun calculateAttendance(attended: String, total: String, target: Int) = viewModelScope.launch {
        attendanceResult.value = runCatching {
            container.calculatorEngine.calculateAttendance(attended.toInt(), total.toInt(), target)
        }.getOrNull()
    }

    fun convert(value: String, option: ConversionOption) = viewModelScope.launch {
        conversionResult.value = runCatching {
            container.calculatorEngine.convert(value.toDouble(), option)
        }.getOrNull()
    }

    fun addNote(title: String, body: String) = viewModelScope.launch {
        if (title.isBlank() && body.isBlank()) return@launch
        container.database.noteDao().insert(NoteEntity(title = title.ifBlank { "Untitled note" }, body = body))
    }

    fun deleteNote(id: Long) = viewModelScope.launch {
        container.database.noteDao().delete(id)
    }

    fun addTask(title: String, goal: String, dueDate: String) = viewModelScope.launch {
        if (title.isBlank()) return@launch
        container.database.studyTaskDao().insert(
            StudyTaskEntity(title = title, goal = goal, dueDate = dueDate)
        )
    }

    fun toggleTask(task: StudyTaskEntity) = viewModelScope.launch {
        container.database.studyTaskDao().update(task.copy(isCompleted = !task.isCompleted))
    }

    fun deleteTask(id: Long) = viewModelScope.launch {
        container.database.studyTaskDao().delete(id)
    }

    fun savePlannerGoals(goals: List<PlannerGoal>) = viewModelScope.launch {
        container.preferenceStore.savePlannerGoals(goals)
    }

    fun unlockPremium() = viewModelScope.launch {
        container.premiumRepository.unlockPremium()
    }

    fun signInAndBackup() = viewModelScope.launch {
        container.authRepository.signInAnonymously().onSuccess {
            container.cloudSyncRepository.backupNotes(notes.value)
            container.cloudSyncRepository.backupTasks(tasks.value)
        }
    }
}

data class MainUiState(
    val homeTiles: List<HomeTile> = emptyList(),
    val premiumUnlocked: Boolean = false,
    val notes: List<NoteEntity> = emptyList(),
    val tasks: List<StudyTaskEntity> = emptyList(),
    val plannerGoals: List<PlannerGoal> = emptyList(),
    val attendance: AttendanceResult? = null,
    val percentageSummary: String? = null,
    val sgpa: GpaResult? = null,
    val conversion: ConversionResult? = null,
    val syncStatus: String = "Cloud sync disabled",
    val snapshot: DashboardSnapshot = DashboardSnapshot("", "", "")
)

class MainViewModelFactory(private val container: AppContainer) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return MainViewModel(container) as T
    }
}
