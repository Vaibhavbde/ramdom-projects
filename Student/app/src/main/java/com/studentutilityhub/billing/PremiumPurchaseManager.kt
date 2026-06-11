package com.studentutilityhub.billing

import android.app.Activity
import com.razorpay.Checkout
import com.studentutilityhub.BuildConfig
import org.json.JSONObject

class PremiumPurchaseManager {
    fun startCheckout(activity: Activity, amountInRupees: Int) {
        Checkout.preload(activity)
        val checkout = Checkout().apply { setKeyID(BuildConfig.RAZORPAY_KEY_ID) }
        val options = JSONObject().apply {
            put("name", "Student Utility Hub Premium")
            put("description", "Unlock study planner, backup, and ad-free mode")
            put("currency", "INR")
            put("amount", amountInRupees * 100)
            put("theme.color", "#0D5C63")
        }
        checkout.open(activity, options)
    }
}
