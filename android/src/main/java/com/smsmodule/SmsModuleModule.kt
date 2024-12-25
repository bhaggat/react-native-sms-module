package com.smsmodule

import android.util.Log

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import android.content.ContentResolver
import android.database.ContentObserver
import android.database.Cursor
import android.net.Uri
import java.util.*
import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.telephony.SmsMessage
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

@ReactModule(name = SmsModuleModule.NAME)
class SmsModuleModule(reactContext: ReactApplicationContext) :
    NativeSmsModuleSpec(reactContext) {
    private var receiver: BroadcastReceiver? = null

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    override fun getSMSList(offset: Double?, limit: Double?, filters: ReadableMap?, promise: Promise) {
        try {
            val smsList = mutableListOf<Map<String, String>>()
            val resolver: ContentResolver = reactApplicationContext.contentResolver

            val selection = mutableListOf<String>()
            val selectionArgs = mutableListOf<String>()

            filters?.let {
                it.getString("sender")?.let { sender ->
                    selection.add("address = ?")
                    selectionArgs.add(sender)
                }
                it.getString("keyword")?.let { keyword ->
                    selection.add("body LIKE ?")
                    selectionArgs.add("%$keyword%")
                }
                if (it.hasKey("dateFrom")) {
                    selection.add("date >= ?")
                    selectionArgs.add(it.getDouble("dateFrom").toLong().toString())
                }
                if (it.hasKey("dateTo")) {
                    selection.add("date <= ?")
                    selectionArgs.add(it.getDouble("dateTo").toLong().toString())
                }
                if (it.hasKey("readOnly") && it.getBoolean("readOnly")) {
                    selection.add("read = ?")
                    selectionArgs.add("1")
                }
                if (it.hasKey("unreadOnly") && it.getBoolean("unreadOnly")) {
                    selection.add("read = ?")
                    selectionArgs.add("0")
                }
            }

            val whereClause = if (selection.isNotEmpty()) selection.joinToString(" AND ") else null

            val cursor: Cursor? = resolver.query(
                Uri.parse("content://sms/inbox"),
                null,
                whereClause,
                selectionArgs.toTypedArray(),
                "date DESC LIMIT $limit OFFSET $offset"
            )

            cursor?.use {
                val idIndex = it.getColumnIndex("_id")
                val addressIndex = it.getColumnIndex("address")
                val bodyIndex = it.getColumnIndex("body")
                val dateIndex = it.getColumnIndex("date")

                while (it.moveToNext()) {
                    val sms = mapOf(
                        "id" to it.getString(idIndex),
                        "sender" to it.getString(addressIndex),
                        "body" to it.getString(bodyIndex),
                        "timestamp" to it.getString(dateIndex)
                    )
                    smsList.add(sms)
                }
            }

            promise.resolve(Arguments.makeNativeArray(smsList))
        } catch (e: Exception) {
            promise.reject("SMS_ERROR", "Failed to fetch SMS", e)
        }
    }
    
    @ReactMethod
    override fun startSmsListener() {
        if (receiver != null) return

        receiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                if (intent?.action == "android.provider.Telephony.SMS_RECEIVED") {
                    val bundle = intent.extras
                    if (bundle != null) {
                        // Safely retrieve the PDUs
                        val pdus = bundle.get("pdus") as? Array<*>
                        pdus?.forEach { pdu ->
                            try {
                                val message = SmsMessage.createFromPdu(pdu as ByteArray, bundle.getString("format"))
                                val sender = message.originatingAddress
                                val messageBody = message.messageBody
                                val timestamp = message.timestampMillis

                                // Generate a custom message ID using sender and timestamp
                                val messageId = "$sender-$timestamp"

                                // Create params map according to the SmsData type
                                val params = Arguments.createMap().apply {
                                    putString("id", messageId)
                                    putString("sender", sender ?: "Unknown")
                                    putString("body", messageBody ?: "No message")
                                    putDouble("timestamp", timestamp.toDouble())
                                }

                                // Send event with params
                                sendEvent("onSms", params)
                            } catch (e: Exception) {
                                Log.e("SmsModule", "Error parsing SMS PDU: ${e.message}", e)
                            }
                        }
                    }
                }
            }
        }

        val filter = IntentFilter("android.provider.Telephony.SMS_RECEIVED")
        reactApplicationContext.registerReceiver(receiver, filter)
    }

    private fun sendEvent(eventName: String, params: WritableMap) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
    
    @ReactMethod
    override fun stopSmsListener() {
        receiver?.let {
            reactApplicationContext.unregisterReceiver(it)
            receiver = null
        }
    }

    @ReactMethod
    override fun addListener(eventName: String) {}
    
    @ReactMethod
    override fun removeListeners(count: Double) {}

    companion object {
        const val NAME = "SmsModule"
    }
}
