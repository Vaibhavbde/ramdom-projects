package com.studentutilityhub.data.remote

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.ktx.auth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.ktx.Firebase
import com.studentutilityhub.data.model.NoteEntity
import com.studentutilityhub.data.model.StudyTaskEntity
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.tasks.await

class AuthRepository(
    private val auth: FirebaseAuth = Firebase.auth
) {
    fun currentUser(): FirebaseUser? = auth.currentUser

    suspend fun signInAnonymously(): Result<FirebaseUser> = runCatching {
        auth.signInAnonymously().await().user ?: error("Anonymous sign-in failed")
    }

    fun signOut() = auth.signOut()
}

class CloudSyncRepository(
    private val firestore: FirebaseFirestore,
    private val auth: FirebaseAuth
) {
    suspend fun backupNotes(notes: List<NoteEntity>) {
        val uid = auth.currentUser?.uid ?: return
        firestore.collection("students").document(uid).collection("notes_backup")
            .document("latest")
            .set(mapOf("items" to notes, "updatedAt" to System.currentTimeMillis()))
            .await()
    }

    suspend fun backupTasks(tasks: List<StudyTaskEntity>) {
        val uid = auth.currentUser?.uid ?: return
        firestore.collection("students").document(uid).collection("planner_backup")
            .document("latest")
            .set(mapOf("items" to tasks, "updatedAt" to System.currentTimeMillis()))
            .await()
    }

    fun syncStatus(): Flow<String> = flow {
        emit(if (auth.currentUser == null) "Sign in to enable backup" else "Cloud backup ready")
    }
}

class PremiumRepository(
    private val preferenceStore: PreferenceStore
) {
    val premiumUnlocked = preferenceStore.premiumUnlocked

    suspend fun unlockPremium() {
        preferenceStore.savePremiumUnlocked(true)
    }
}
