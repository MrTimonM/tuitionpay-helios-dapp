import React from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle, Calendar, Building, GraduationCap, Hash, Clock, User, CreditCard, Car as IdCard } from 'lucide-react';
import { PaymentRecord } from '../types';

interface PaymentReceiptProps {
  payment: PaymentRecord;
  onClose: () => void;
  onDownload: () => void;
}

export const PaymentReceipt: React.FC<PaymentReceiptProps> = ({ payment, onClose, onDownload }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const institutionName = payment.isCustom ? payment.customInstitution : payment.institution;
  const departmentName = payment.isCustom ? payment.customDepartment : payment.department;
  const semesterName = payment.isCustom ? payment.customSemester : payment.semester;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Payment Receipt</h2>
                <p className="text-blue-100">Helios Tuition Payment System</p>
              </div>
            </div>
            <div className="flex items-center bg-green-500 bg-opacity-20 px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Confirmed</span>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <p className="text-sm text-blue-100 mb-1">Receipt ID</p>
            <p className="font-mono text-lg">{payment.id}</p>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-8" id="receipt-content">
          {/* Student Information */}
          <div className="bg-green-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-green-900 mb-4 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" />
              Student Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <IdCard className="w-5 h-5 text-green-600 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-green-700">Student ID</p>
                  <p className="font-semibold text-green-900">{payment.studentId}</p>
                </div>
              </div>
              <div className="flex items-start">
                <User className="w-5 h-5 text-green-600 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-green-700">Full Name</p>
                  <p className="font-semibold text-green-900">{payment.studentName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <Building className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Institution</p>
                  <p className="font-semibold text-gray-900">{institutionName}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <GraduationCap className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Department/Program</p>
                  <p className="font-semibold text-gray-900">{departmentName}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Academic Period</p>
                  <p className="font-semibold text-gray-900">{semesterName}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <CreditCard className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Payment Wallet</p>
                  <p className="font-mono text-sm text-gray-900">
                    {payment.studentAddress.slice(0, 10)}...{payment.studentAddress.slice(-8)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Payment Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(payment.timestamp)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Hash className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Transaction Hash</p>
                  <a
                    href={`https://explorer.helioschainlabs.org/tx/${payment.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-blue-600 hover:text-blue-700 break-all"
                  >
                    {payment.transactionHash}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Amount Section */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">Tuition Fee</span>
              <span className="text-2xl font-bold text-blue-600">{payment.amount} tHELIOS</span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Total Paid</span>
                <span className="text-3xl font-bold text-green-600">{payment.amount} tHELIOS</span>
              </div>
            </div>
          </div>

          {/* Network Info */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-3">Network Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-700">Network: <span className="font-semibold">Helios Testnet</span></p>
                <p className="text-blue-700">Chain ID: <span className="font-semibold">42000</span></p>
              </div>
              <div>
                <p className="text-blue-700">Currency: <span className="font-semibold">tHELIOS</span></p>
                <p className="text-blue-700">Status: <span className="font-semibold text-green-600">Confirmed</span></p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
            <p>This receipt serves as proof of payment for tuition fees.</p>
            <p>Generated on {formatDate(Date.now())} via Helios Tuition Payment System</p>
            <p className="mt-2 font-semibold">Thank you for using our secure blockchain payment system!</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 p-8 pt-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDownload}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Receipt
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};