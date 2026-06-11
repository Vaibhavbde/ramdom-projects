package com.studentutilityhub.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColors = lightColorScheme(
    primary = Color(0xFF0D5C63),
    onPrimary = Color(0xFFF7FBFC),
    secondary = Color(0xFFF4D35E),
    background = Color(0xFFF6F4EF),
    surface = Color(0xFFFFFFFF),
    onSurface = Color(0xFF102A43)
)

private val DarkColors = darkColorScheme(
    primary = Color(0xFF5BC0BE),
    secondary = Color(0xFFF4D35E),
    background = Color(0xFF0B132B),
    surface = Color(0xFF1C2541),
    onSurface = Color(0xFFF8F9FA)
)

@Composable
fun StudentUtilityHubTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = if (darkTheme) DarkColors else LightColors,
        typography = AppTypography,
        content = content
    )
}
