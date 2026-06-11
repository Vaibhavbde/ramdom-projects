package com.studentutilityhub.domain

import com.studentutilityhub.data.model.AttendanceResult
import com.studentutilityhub.data.model.ConversionOption
import com.studentutilityhub.data.model.ConversionResult
import com.studentutilityhub.data.model.ConverterType
import com.studentutilityhub.data.model.DashboardSnapshot
import com.studentutilityhub.data.model.GpaResult
import com.studentutilityhub.data.model.PercentageResult
import com.studentutilityhub.data.model.StudyTaskEntity
import com.studentutilityhub.data.model.SubjectGradeInput
import kotlin.math.ceil
import kotlin.math.roundToInt

class StudentCalculatorEngine {
    fun calculatePercentage(obtained: Double, total: Double): PercentageResult {
        require(total > 0) { "Total marks must be greater than 0" }
        require(obtained >= 0) { "Obtained marks cannot be negative" }
        val percentage = ((obtained / total) * 100).coerceAtMost(100.0)
        return PercentageResult(
            percentage = percentage,
            summary = "%.2f%% scored from %.0f out of %.0f".format(percentage, obtained, total)
        )
    }

    fun calculateSgpa(subjects: List<SubjectGradeInput>): GpaResult {
        require(subjects.isNotEmpty()) { "Add at least one subject" }
        require(subjects.all { it.credits > 0 }) { "Credits must be greater than 0" }
        require(subjects.all { it.gradePoint in 0f..10f }) { "Grade points must be between 0 and 10" }

        val totalCredits = subjects.sumOf { it.credits.toDouble() }.toFloat()
        val weightedPoints = subjects.sumOf { (it.credits * it.gradePoint).toDouble() }.toFloat()
        val sgpa = weightedPoints / totalCredits

        return GpaResult(
            sgpa = sgpa.toDouble(),
            totalCredits = totalCredits,
            weightedPoints = weightedPoints,
            summary = "SGPA %.2f across %.0f credits".format(sgpa, totalCredits)
        )
    }

    fun calculateAttendance(attended: Int, total: Int, target: Int = 75): AttendanceResult {
        require(total >= 0) { "Total classes cannot be negative" }
        require(attended >= 0) { "Attended classes cannot be negative" }
        require(attended <= total) { "Attended classes cannot exceed total classes" }
        require(target in 1..100) { "Target should be between 1 and 100" }

        val currentPercentage = if (total == 0) 0.0 else attended.toDouble() / total * 100
        val targetRatio = target / 100.0

        val needed = if (currentPercentage >= target) {
            0
        } else {
            ceil(((targetRatio * total) - attended) / (1 - targetRatio)).toInt().coerceAtLeast(0)
        }

        val safeBunks = if (total == 0 || currentPercentage < target) {
            0
        } else {
            ((attended - targetRatio * total) / targetRatio).toInt().coerceAtLeast(0)
        }

        val summary = when {
            total == 0 -> "Start tracking classes to estimate your safe margin"
            currentPercentage < target -> "Attend next $needed classes continuously to reach $target%"
            else -> "You can miss $safeBunks class(es) and still stay above $target%"
        }

        return AttendanceResult(currentPercentage, needed, safeBunks, summary)
    }

    fun convert(value: Double, option: ConversionOption): ConversionResult {
        val output = when (option.type) {
            ConverterType.Length -> convertLength(value, option.fromUnit, option.toUnit)
            ConverterType.Weight -> convertWeight(value, option.fromUnit, option.toUnit)
            ConverterType.Temperature -> convertTemperature(value, option.fromUnit, option.toUnit)
        }
        return ConversionResult(output = output, formulaHint = "${option.fromUnit} -> ${option.toUnit}")
    }

    fun generateSnapshot(attendance: AttendanceResult?, tasks: List<StudyTaskEntity>): DashboardSnapshot {
        val pendingTasks = tasks.count { !it.isCompleted }
        val attendanceHealth = when {
            attendance == null -> "Attendance not calculated yet"
            attendance.currentPercentage >= 85 -> "Attendance is strong"
            attendance.currentPercentage >= 75 -> "Attendance is safe"
            else -> "Attendance needs recovery"
        }
        val plannerHealth = when {
            pendingTasks == 0 -> "Planner clear for today"
            pendingTasks <= 3 -> "Planner is manageable"
            else -> "Planner is overloaded"
        }
        val suggestion = when {
            attendance?.currentPercentage ?: 0.0 < 75 -> "Prioritize classes before taking extra leave."
            pendingTasks > 3 -> "Break the biggest goal into 25-minute tasks."
            else -> "Keep notes updated after every lecture."
        }
        return DashboardSnapshot(attendanceHealth, plannerHealth, suggestion)
    }

    private fun convertLength(value: Double, from: String, to: String): Double {
        val meters = when (from) {
            "m" -> value
            "km" -> value * 1000
            "cm" -> value / 100
            "mm" -> value / 1000
            else -> value
        }
        return when (to) {
            "m" -> meters
            "km" -> meters / 1000
            "cm" -> meters * 100
            "mm" -> meters * 1000
            else -> meters
        }
    }

    private fun convertWeight(value: Double, from: String, to: String): Double {
        val grams = when (from) {
            "kg" -> value * 1000
            "g" -> value
            "lb" -> value * 453.592
            else -> value
        }
        return when (to) {
            "kg" -> grams / 1000
            "g" -> grams
            "lb" -> grams / 453.592
            else -> grams
        }
    }

    private fun convertTemperature(value: Double, from: String, to: String): Double {
        val celsius = when (from) {
            "C" -> value
            "F" -> (value - 32) * 5 / 9
            "K" -> value - 273.15
            else -> value
        }
        return when (to) {
            "C" -> celsius
            "F" -> celsius * 9 / 5 + 32
            "K" -> celsius + 273.15
            else -> celsius
        }
    }
}

fun Double.pretty(decimals: Int = 2): String = "%.${decimals}f".format(this)
fun Double.toPercentInt(): Int = roundToInt().coerceIn(0, 100)
