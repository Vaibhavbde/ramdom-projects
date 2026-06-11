package com.studentutilityhub.ui.navigation

sealed class AppRoute(val route: String) {
    data object Home : AppRoute("home")
    data object Percentage : AppRoute("percentage")
    data object Gpa : AppRoute("gpa")
    data object Attendance : AppRoute("attendance")
    data object Converter : AppRoute("converter")
    data object Notes : AppRoute("notes")
    data object Planner : AppRoute("planner")
    data object Premium : AppRoute("premium")
}
