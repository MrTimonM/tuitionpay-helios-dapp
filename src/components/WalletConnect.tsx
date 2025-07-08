import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, AlertCircle, ExternalLink } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { FAUCET_URL } from '../config/constants';

interface WalletConnectProps {
  onConnected: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ onConnected }) => {
  const { walletState, isLoading, connectWallet } = useWallet();

  const handleConnect = async () => {
    try {
      await connectWallet();
      onConnected();
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (walletState.isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Connected</h2>
          <p className="text-gray-600 mb-4">
            {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Balance</p>
            <p className="text-2xl font-bold text-gray-900">
              {parseFloat(walletState.balance).toFixed(4)} tHELIOS
            </p>
          </div>
          
          {parseFloat(walletState.balance) < 0.1 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <p className="text-sm text-yellow-800">
                  Low balance detected. Get testnet tokens from the faucet.
                </p>
              </div>
              <a
                href={FAUCET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-2 text-sm text-yellow-700 hover:text-yellow-800"
              >
                Visit Faucet <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConnected}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue to Dashboard
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600 mb-6">
          Connect your MetaMask wallet to start paying tuition fees on Helios Testnet
        </p>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Wallet className="w-5 h-5 mr-2" />
          )}
          {isLoading ? 'Connecting...' : 'Connect MetaMask'}
        </motion.button>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Don't have MetaMask?</p>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
          >
            Download MetaMask <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};