import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, CreditCard, ExternalLink, CheckCircle, XCircle, Clock, Plus, Receipt } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { MOCK_INSTITUTIONS } from '../config/constants';
import { Institution, Department, PaymentRecord } from '../types';
import { PaymentReceipt } from './PaymentReceipt';

export const TuitionPayment: React.FC = () => {
  const { walletState, sendTransaction, updateBalance, signMessage } = useWallet();
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [currentTransaction, setCurrentTransaction] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);
  
  // Custom form states
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customInstitution, setCustomInstitution] = useState('');
  const [customDepartment, setCustomDepartment] = useState('');
  const [customSemester, setCustomSemester] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  
  // Student information
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');

  // Generate random Ethereum address for payment
  const generateRandomAddress = (): string => {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
  };

  const handleInstitutionChange = (institutionId: string) => {
    if (institutionId === 'custom') {
      setIsCustomMode(true);
      setSelectedInstitution(null);
      setSelectedDepartment(null);
    } else {
      setIsCustomMode(false);
      const institution = MOCK_INSTITUTIONS.find(inst => inst.id === institutionId);
      setSelectedInstitution(institution || null);
      setSelectedDepartment(null);
    }
  };

  const handleDepartmentChange = (departmentId: string) => {
    if (!selectedInstitution) return;
    const department = selectedInstitution.departments.find(dept => dept.id === departmentId);
    setSelectedDepartment(department || null);
  };

  const isFormValid = () => {
    const hasStudentInfo = studentId.trim() && studentName.trim();
    if (isCustomMode) {
      return hasStudentInfo && customInstitution.trim() && customDepartment.trim() && 
             customSemester.trim() && customAmount.trim() && parseFloat(customAmount) > 0;
    }
    return hasStudentInfo && selectedInstitution && selectedDepartment && selectedSemester;
  };

  const getPaymentDetails = () => {
    if (isCustomMode) {
      return {
        institution: customInstitution,
        department: customDepartment,
        semester: customSemester,
        amount: customAmount,
        address: generateRandomAddress() // Random address for each payment
      };
    }
    return {
      institution: selectedInstitution!.name,
      department: selectedDepartment!.name,
      semester: selectedSemester,
      amount: selectedDepartment!.tuitionFee,
      address: generateRandomAddress() // Random address for each payment
    };
  };

  const handlePayment = async () => {
    if (!isFormValid() || !walletState.address) {
      alert('Please fill in all fields');
      return;
    }

    setIsProcessing(true);
    setCurrentTransaction(null);

    try {
      const paymentDetails = getPaymentDetails();
      
      // Sign authentication message
      const authMessage = `Sign to authenticate payment for ${paymentDetails.institution} - ${paymentDetails.department} - ${paymentDetails.semester}`;
      await signMessage(authMessage);

      // Send transaction
      const tx = await sendTransaction(paymentDetails.address, paymentDetails.amount);
      setCurrentTransaction(tx.hash);

      // Create payment record
      const paymentRecord: PaymentRecord = {
        id: `PAY-${Date.now()}`,
        studentAddress: walletState.address,
        studentId: studentId,
        studentName: studentName,
        institution: paymentDetails.institution,
        department: paymentDetails.department,
        semester: paymentDetails.semester,
        amount: paymentDetails.amount,
        transactionHash: tx.hash,
        timestamp: Date.now(),
        status: 'pending',
        isCustom: isCustomMode,
        customInstitution: isCustomMode ? customInstitution : undefined,
        customDepartment: isCustomMode ? customDepartment : undefined,
        customSemester: isCustomMode ? customSemester : undefined
      };

      setPaymentRecords(prev => [paymentRecord, ...prev]);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        setPaymentRecords(prev => 
          prev.map(record => 
            record.transactionHash === tx.hash 
              ? { ...record, status: 'confirmed' as const }
              : record
          )
        );
        await updateBalance();
        
        // Reset form
        if (isCustomMode) {
          setStudentId('');
          setStudentName('');
          setCustomInstitution('');
          setCustomDepartment('');
          setCustomSemester('');
          setCustomAmount('');
        } else {
          setStudentId('');
          setStudentName('');
          setSelectedInstitution(null);
          setSelectedDepartment(null);
          setSelectedSemester('');
        }
        
        alert('Payment successful!');
      } else {
        setPaymentRecords(prev => 
          prev.map(record => 
            record.transactionHash === tx.hash 
              ? { ...record, status: 'failed' as const }
              : record
          )
        );
        alert('Payment failed!');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.message || 'Payment failed');
      
      if (currentTransaction) {
        setPaymentRecords(prev => 
          prev.map(record => 
            record.transactionHash === currentTransaction 
              ? { ...record, status: 'failed' as const }
              : record
          )
        );
      }
    } finally {
      setIsProcessing(false);
      setCurrentTransaction(null);
    }
  };

  const downloadReceipt = (payment: PaymentRecord) => {
    const receiptContent = document.getElementById('receipt-content');
    if (receiptContent) {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Payment Receipt - ${payment.id}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
                .content { line-height: 1.6; }
                .amount { font-size: 24px; font-weight: bold; color: #059669; }
                .details { margin: 20px 0; }
                .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Payment Receipt</h1>
                <p>Helios Tuition Payment System</p>
                <p>Receipt ID: ${payment.id}</p>
              </div>
              <div class="content">
                <div class="details">
                  <p><strong>Institution:</strong> ${payment.isCustom ? payment.customInstitution : payment.institution}</p>
                  <p><strong>Department:</strong> ${payment.isCustom ? payment.customDepartment : payment.department}</p>
                  <p><strong>Semester:</strong> ${payment.isCustom ? payment.customSemester : payment.semester}</p>
                  <p><strong>Student Wallet:</strong> ${payment.studentAddress}</p>
                  <p><strong>Payment Date:</strong> ${new Date(payment.timestamp).toLocaleString()}</p>
                  <p><strong>Transaction Hash:</strong> ${payment.transactionHash}</p>
                </div>
                <div class="amount">
                  <p>Amount Paid: ${payment.amount} tHELIOS</p>
                </div>
                <div class="footer">
                  <p>This receipt serves as proof of payment for tuition fees.</p>
                  <p>Generated via Helios Tuition Payment System</p>
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const getStatusIcon = (status: PaymentRecord['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: PaymentRecord['status']) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Pay your tuition fees securely on Helios Testnet</p>
          <div className="mt-4 inline-flex items-center bg-white rounded-lg px-4 py-2 shadow-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">
              {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
            </span>
            <span className="ml-4 text-sm font-medium text-gray-900">
              {parseFloat(walletState.balance).toFixed(4)} tHELIOS
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <GraduationCap className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Make Payment</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCustomMode(!isCustomMode)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  isCustomMode 
                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Plus className="w-4 h-4 mr-2" />
                {isCustomMode ? 'Use Preset' : 'Custom'}
              </motion.button>
            </div>

            <div className="space-y-6">
              {/* Student Information */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-green-600" />
                  Student Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student ID
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="Enter your student ID"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {!isCustomMode ? (
                <>
                  {/* Institution Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Institution
                    </label>
                    <select
                      value={selectedInstitution?.id || ''}
                      onChange={(e) => handleInstitutionChange(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Choose an institution...</option>
                      {MOCK_INSTITUTIONS.map(institution => (
                        <option key={institution.id} value={institution.id}>
                          {institution.name}
                        </option>
                      ))}
                      <option value="custom">+ Add Custom Institution</option>
                    </select>
                  </div>

                  {/* Department Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Department
                    </label>
                    <select
                      value={selectedDepartment?.id || ''}
                      onChange={(e) => handleDepartmentChange(e.target.value)}
                      disabled={!selectedInstitution}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">Choose a department...</option>
                      {selectedInstitution?.departments.map(department => (
                        <option key={department.id} value={department.id}>
                          {department.name} - {department.tuitionFee} tHELIOS
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Semester Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Semester
                    </label>
                    <input
                      type="text"
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      placeholder="e.g., Fall 2024, Spring 2025"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Custom Institution */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institution Name
                    </label>
                    <input
                      type="text"
                      value={customInstitution}
                      onChange={(e) => setCustomInstitution(e.target.value)}
                      placeholder="Enter institution name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Custom Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department/Program
                    </label>
                    <input
                      type="text"
                      value={customDepartment}
                      onChange={(e) => setCustomDepartment(e.target.value)}
                      placeholder="Enter department or program name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Custom Semester */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Academic Period
                    </label>
                    <input
                      type="text"
                      value={customSemester}
                      onChange={(e) => setCustomSemester(e.target.value)}
                      placeholder="e.g., Fall 2024, Spring 2025"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Amount (tHELIOS)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter amount in tHELIOS"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {/* Payment Summary */}
              {isFormValid() && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">Payment Summary</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    {(() => {
                      const details = getPaymentDetails();
                      return (
                        <>
                          <p><span className="font-medium">Institution:</span> {details.institution}</p>
                          <p><span className="font-medium">Department:</span> {details.department}</p>
                          <p><span className="font-medium">Semester:</span> {details.semester}</p>
                          <p><span className="font-medium">Amount:</span> {details.amount} tHELIOS</p>
                          <p><span className="font-medium">Recipient:</span> {details.address.slice(0, 10)}...</p>
                        </>
                      );
                    })()}
                  </div>
                </motion.div>
              )}

              {/* Pay Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                disabled={!isFormValid() || isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pay Now
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Payment History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h2>
            
            {paymentRecords.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No payments yet</p>
                <p className="text-sm text-gray-400">Your payment history will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentRecords.map((record) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {record.isCustom ? record.customInstitution : record.institution}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {record.isCustom ? record.customDepartment : record.department} - {record.isCustom ? record.customSemester : record.semester}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {getStatusIcon(record.status)}
                          <span className="ml-1 capitalize">{record.status}</span>
                        </div>
                        {record.status === 'confirmed' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedReceipt(record)}
                            className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                            title="View Receipt"
                          >
                            <Receipt className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="font-medium">{record.amount} tHELIOS</span>
                      <a
                        href={`https://explorer.helioschainlabs.org/tx/${record.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-700"
                      >
                        View Transaction <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(record.timestamp).toLocaleString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Receipt Modal */}
      <AnimatePresence>
        {selectedReceipt && (
          <PaymentReceipt
            payment={selectedReceipt}
            onClose={() => setSelectedReceipt(null)}
            onDownload={() => downloadReceipt(selectedReceipt)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};