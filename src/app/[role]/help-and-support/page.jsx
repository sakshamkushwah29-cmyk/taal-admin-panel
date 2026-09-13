"use client";

import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Building2,
  HelpingHand,
  MessageCircleQuestion,
} from "lucide-react";

export default function HelpSupportPage() {
  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-2xl p-8 space-y-6">
        <div className="flex items-center gap-4">
          <HelpingHand className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Help & Support - Medlivurr
          </h1>
        </div>
    
        <div className="grid md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-200">
          {/* Phone */}
          <div className="flex items-start gap-4">
            <Phone className="w-6 h-6 text-blue-500 mt-1" />
            <div>
              <h3 className="font-semibold text-lg">Phone</h3>
              <p>+91 9876543210</p>
              <p>Mon - Sat | 9 AM - 6 PM</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-blue-500 mt-1" />
            <div>
              <h3 className="font-semibold text-lg">Email</h3>
              <p>support@medlivurr.com</p>
              <p>Drop us a message anytime</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-blue-500 mt-1" />
            <div>
              <h3 className="font-semibold text-lg">Address</h3>
              <p>Medlivurr Pvt. Ltd.</p>
              <p>2nd Floor, Medicorp Tower, Sector 45</p>
              <p>Gurugram, Haryana - 122003</p>
            </div>
          </div>

          {/* Company Info */}
          <div className="flex items-start gap-4">
            <Building2 className="w-6 h-6 text-blue-500 mt-1" />
            <div>
              <h3 className="font-semibold text-lg">Company Info</h3>
              <p>Name: Medlivurr Healthcare Solutions</p>
              <p>CIN: U12345HR2021PTC012345</p>
              <p>GSTIN: 06ABCDE1234F1Z5</p>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-300 pt-6">
          <div className="flex items-start gap-4">
            <MessageCircleQuestion className="w-6 h-6 text-blue-500 mt-1" />
            <div>
              <h3 className="text-lg font-semibold">Need More Help?</h3>
              <p>
                We're here to assist with admin support, pharmacy-related issues, or general platform help.
              </p>
              <p>
                You can also reach out from the in-app chat or contact our support team anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
