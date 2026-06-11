package com.studentutilityhub.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.studentutilityhub.data.model.NoteEntity
import com.studentutilityhub.data.model.StudyTaskEntity

@Database(
    entities = [NoteEntity::class, StudyTaskEntity::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun noteDao(): NoteDao
    abstract fun studyTaskDao(): StudyTaskDao

    companion object {
        fun create(context: Context): AppDatabase =
            Room.databaseBuilder(
                context,
                AppDatabase::class.java,
                "student_utility_hub.db"
            ).build()
    }
}
