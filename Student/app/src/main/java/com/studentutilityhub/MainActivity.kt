package com.studentutilityhub

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.remember
import com.studentutilityhub.ui.StudentUtilityHubRoot
import com.studentutilityhub.ui.theme.StudentUtilityHubTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            val container = remember { (application as StudentUtilityHubApp).container }
            StudentUtilityHubTheme {
                StudentUtilityHubRoot(container = container)
            }
        }
    }
}
