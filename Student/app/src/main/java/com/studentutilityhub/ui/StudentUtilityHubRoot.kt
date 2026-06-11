package com.studentutilityhub.ui

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.studentutilityhub.AppContainer
import com.studentutilityhub.ui.navigation.AppRoute
import com.studentutilityhub.ui.screens.AttendanceScreen
import com.studentutilityhub.ui.screens.ConverterScreen
import com.studentutilityhub.ui.screens.GpaScreen
import com.studentutilityhub.ui.screens.HomeScreen
import com.studentutilityhub.ui.screens.NotesScreen
import com.studentutilityhub.ui.screens.PercentageScreen
import com.studentutilityhub.ui.screens.PlannerScreen
import com.studentutilityhub.ui.screens.PremiumScreen
import com.studentutilityhub.viewmodel.MainViewModel
import com.studentutilityhub.viewmodel.MainViewModelFactory

@Composable
fun StudentUtilityHubRoot(container: AppContainer) {
    val navController = rememberNavController()
    val viewModel: MainViewModel = viewModel(factory = MainViewModelFactory(container))
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    Scaffold(modifier = Modifier.fillMaxSize()) { padding ->
        NavHost(
            navController = navController,
            startDestination = AppRoute.Home.route,
            modifier = Modifier.padding(padding)
        ) {
            composable(AppRoute.Home.route) {
                HomeScreen(
                    state = state,
                    onTileClick = { route -> navController.navigate(route) },
                    onPremiumClick = { navController.navigate(AppRoute.Premium.route) }
                )
            }
            composable(AppRoute.Percentage.route) {
                PercentageScreen(state = state, onBack = { navController.popBackStack() }, onCalculate = viewModel::calculatePercentage)
            }
            composable(AppRoute.Gpa.route) {
                GpaScreen(state = state, onBack = { navController.popBackStack() }, onCalculate = viewModel::calculateSgpa)
            }
            composable(AppRoute.Attendance.route) {
                AttendanceScreen(state = state, onBack = { navController.popBackStack() }, onCalculate = viewModel::calculateAttendance)
            }
            composable(AppRoute.Converter.route) {
                ConverterScreen(state = state, onBack = { navController.popBackStack() }, onConvert = viewModel::convert)
            }
            composable(AppRoute.Notes.route) {
                NotesScreen(
                    state = state,
                    onBack = { navController.popBackStack() },
                    onAddNote = viewModel::addNote,
                    onDelete = viewModel::deleteNote
                )
            }
            composable(AppRoute.Planner.route) {
                PlannerScreen(
                    state = state,
                    onBack = { navController.popBackStack() },
                    onAddTask = viewModel::addTask,
                    onToggleTask = viewModel::toggleTask,
                    onDeleteTask = viewModel::deleteTask,
                    onSaveGoals = viewModel::savePlannerGoals,
                    onBackup = viewModel::signInAndBackup
                )
            }
            composable(AppRoute.Premium.route) {
                PremiumScreen(
                    state = state,
                    onBack = { navController.popBackStack() },
                    onUnlock = viewModel::unlockPremium,
                    onBackup = viewModel::signInAndBackup
                )
            }
        }
    }
}
