package com.studentutilityhub.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenu
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.studentutilityhub.data.model.ConversionOption
import com.studentutilityhub.data.model.ConverterType
import com.studentutilityhub.domain.pretty
import com.studentutilityhub.viewmodel.MainUiState

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ConverterScreen(state: MainUiState, onBack: () -> Unit, onConvert: (String, ConversionOption) -> Unit) {
    val value = remember { mutableStateOf("") }
    val expanded = remember { mutableStateOf(false) }
    val type = remember { mutableStateOf(ConverterType.Length) }
    val from = remember { mutableStateOf("m") }
    val to = remember { mutableStateOf("km") }

    AppScreen(title = "Unit Converter", onBack = onBack) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            SectionCard("Convert units") {
                OutlinedTextField(value = value.value, onValueChange = { value.value = it }, label = { Text("Value") }, modifier = Modifier.fillMaxWidth())
                ExposedDropdownMenuBox(expanded = expanded.value, onExpandedChange = { expanded.value = !expanded.value }) {
                    OutlinedTextField(
                        modifier = Modifier.menuAnchor().fillMaxWidth(),
                        readOnly = true,
                        value = type.value.label,
                        onValueChange = {},
                        label = { Text("Category") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded.value) }
                    )
                    ExposedDropdownMenu(expanded = expanded.value, onDismissRequest = { expanded.value = false }) {
                        ConverterType.entries.forEach {
                            DropdownMenuItem(
                                text = { Text(it.label) },
                                onClick = {
                                    type.value = it
                                    val defaults = defaultUnits(it)
                                    from.value = defaults.first
                                    to.value = defaults.second
                                    expanded.value = false
                                }
                            )
                        }
                    }
                }
                LabelledField(from.value, "From Unit", onValueChange = { from.value = it })
                LabelledField(to.value, "To Unit", onValueChange = { to.value = it })
                Button(
                    onClick = { onConvert(value.value, ConversionOption(type.value, from.value, to.value)) },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Convert") }
            }
            SectionCard("Result") {
                Text(state.conversion?.output?.pretty() ?: "Converted value will appear here.")
                Text(state.conversion?.formulaHint ?: "Supported: m, km, cm, mm | kg, g, lb | C, F, K")
            }
        }
    }
}

private fun defaultUnits(type: ConverterType): Pair<String, String> = when (type) {
    ConverterType.Length -> "m" to "km"
    ConverterType.Weight -> "kg" to "lb"
    ConverterType.Temperature -> "C" to "F"
}
