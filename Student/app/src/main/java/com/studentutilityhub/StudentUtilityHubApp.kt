package com.studentutilityhub

import android.app.Application
import com.google.android.gms.ads.MobileAds
import com.google.firebase.auth.ktx.auth
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import com.studentutilityhub.data.local.AppDatabase
import com.studentutilityhub.data.local.PreferenceStore
import com.studentutilityhub.data.remote.AuthRepository
import com.studentutilityhub.data.remote.CloudSyncRepository
import com.studentutilityhub.data.remote.PremiumRepository
import com.studentutilityhub.domain.StudentCalculatorEngine

class StudentUtilityHubApp : Application() {
    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        MobileAds.initialize(this)
        container = DefaultAppContainer(this)
    }
}

interface AppContainer {
    val database: AppDatabase
    val preferenceStore: PreferenceStore
    val calculatorEngine: StudentCalculatorEngine
    val authRepository: AuthRepository
    val cloudSyncRepository: CloudSyncRepository
    val premiumRepository: PremiumRepository
}

class DefaultAppContainer(application: Application) : AppContainer {
    override val database: AppDatabase by lazy { AppDatabase.create(application) }
    override val preferenceStore: PreferenceStore by lazy { PreferenceStore(application) }
    override val calculatorEngine: StudentCalculatorEngine by lazy { StudentCalculatorEngine() }
    override val authRepository: AuthRepository by lazy { AuthRepository() }
    override val cloudSyncRepository: CloudSyncRepository by lazy {
        CloudSyncRepository(
            firestore = Firebase.firestore,
            auth = Firebase.auth
        )
    }
    override val premiumRepository: PremiumRepository by lazy { PremiumRepository(preferenceStore) }
}
