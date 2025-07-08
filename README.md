# 🎓 Helios Tuition Payment DApp

A modern, secure, and user-friendly Decentralized Application (DApp) that allows students to pay their tuition fees to schools or universities using the Helios blockchain testnet.

![Helios Tuition DApp](https://images.pexels.com/photos/5940721/pexels-photo-5940721.jpeg?auto=compress&cs=tinysrgb&w=1200)

## 🌟 Features

### 🔐 Wallet Integration & Security
- **MetaMask Integration**: Seamless wallet connection with automatic network detection
- **Network Auto-Switch**: Automatically switches to Helios Testnet or adds it if not present
- **Message Signing**: Secure authentication through wallet signature verification
- **Balance Monitoring**: Real-time balance updates and low balance warnings

### 💳 Payment System
- **Multi-Institution Support**: Choose from various universities and departments
- **Semester Selection**: Pay for specific academic terms
- **Real-time Transaction Tracking**: Monitor payment status with live updates
- **Transaction History**: Complete payment records with explorer links
- **Error Handling**: Comprehensive error management and user feedback

### 🎨 User Experience
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Mobile Responsive**: Optimized for all device sizes
- **Intuitive Navigation**: Step-by-step guided payment process

## 🚀 Live Demo

**Deployed Application**: [https://jazzy-croquembouche-c514ea.netlify.app/](https://jazzy-croquembouche-c514ea.netlify.app/)

## 🛠 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Blockchain**: Ethers.js v6
- **Network**: Helios Testnet (Chain ID: 42000)
- **Deployment**: Vercel

## 📋 Prerequisites

Before running this application, ensure you have:

1. **MetaMask Extension** installed in your browser
2. **Helios Testnet** added to your MetaMask (the app will help you add it)
3. **Test Tokens** from the [Helios Faucet](https://faucet.helioschainlabs.org)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/MrTimonM/tuitionpay-helios-dapp.git
cd tuitionpay-helios-dapp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open in Browser
Navigate to `http://localhost:5173` to view the application.

## 🌐 Network Configuration

The DApp automatically configures the Helios Testnet with these parameters:

```javascript
{
  chainId: '0xa410', // 42000 in decimal
  chainName: 'Helios Testnet',
  nativeCurrency: {
    name: 'tHELIOS',
    symbol: 'tHELIOS',
    decimals: 18
  },
  rpcUrls: ['https://testnet1.helioschainlabs.org'],
  blockExplorerUrls: ['https://explorer.helioschainlabs.org']
}
```

## 💰 Getting Test Tokens

1. Visit the [Helios Faucet](https://faucet.helioschainlabs.org)
2. Connect your MetaMask wallet
3. Request test tHELIOS tokens
4. Wait for the transaction to confirm

## 🏫 Supported Institutions

The DApp currently supports these mock institutions for testing:

### Harvard University
- Computer Science: 50.0 tHELIOS
- Business Administration: 45.0 tHELIOS
- Medicine: 60.0 tHELIOS
- Law: 55.0 tHELIOS

### MIT
- Engineering: 52.0 tHELIOS
- Physics: 48.0 tHELIOS
- Mathematics: 46.0 tHELIOS

### Stanford University
- Artificial Intelligence: 58.0 tHELIOS
- Biotechnology: 54.0 tHELIOS
- Economics: 47.0 tHELIOS

## 📱 How to Use

### Step 1: Connect Wallet
1. Click "Get Started" on the homepage
2. Click "Connect MetaMask"
3. Approve the connection in MetaMask
4. The app will automatically switch to Helios Testnet

### Step 2: Make Payment
1. Select your institution from the dropdown
2. Choose your department
3. Select the semester
4. Review the payment summary
5. Click "Pay Now"
6. Sign the authentication message
7. Confirm the transaction in MetaMask

### Step 3: Track Payment
1. Monitor the transaction status in real-time
2. View transaction details on the Helios Explorer
3. Check your payment history in the dashboard

## 🔍 Smart Contract Integration

The DApp leverages the Helios ecosystem's smart contracts:

- **ERC20 Tokens**: Standard token transfers for payments
- **Bridge Contracts**: Cross-chain functionality (future feature)
- **Staking Contracts**: Potential rewards system integration
- **Governance**: Community-driven improvements

## 🚀 Deployment

### Deploy to Vercel

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npx vercel --prod
   ```

3. **Configure Environment**
   - No environment variables needed for basic functionality
   - All configuration is handled client-side

### Deploy to Netlify

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   npx netlify deploy --prod --dir=dist
   ```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Wallet connection works
- [ ] Network switching functions properly
- [ ] Payment form validation works
- [ ] Transaction processing completes
- [ ] Payment history updates correctly
- [ ] Error handling displays appropriate messages
- [ ] Responsive design works on mobile

### Test Scenarios

1. **Happy Path**: Complete payment flow with sufficient balance
2. **Low Balance**: Test with insufficient funds
3. **Network Issues**: Test with wrong network
4. **Transaction Failure**: Test failed transaction handling

## 🔒 Security Considerations

- **No Private Keys Stored**: All wallet interactions through MetaMask
- **Message Signing**: Authentication without exposing sensitive data
- **Input Validation**: All user inputs are validated
- **Error Handling**: Comprehensive error management
- **Network Verification**: Ensures correct network before transactions

## 🛣 Roadmap

### Phase 1 (Current)
- [x] Basic payment functionality
- [x] Wallet integration
- [x] Transaction tracking
- [x] Payment history

### Phase 2 (Planned)
- [ ] Smart contract deployment for tuition management
- [ ] Multi-token support (USDC, USDT)
- [ ] Payment scheduling
- [ ] Email notifications

### Phase 3 (Future)
- [ ] Admin dashboard for institutions
- [ ] Student verification system
- [ ] Scholarship token distribution
- [ ] Cross-chain payments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

**Q: MetaMask not connecting?**
A: Ensure MetaMask is installed and unlocked. Refresh the page and try again.

**Q: Transaction failing?**
A: Check your tHELIOS balance and ensure you're on the Helios Testnet.

**Q: Network not switching?**
A: Manually add Helios Testnet to MetaMask using the network configuration above.

### Get Help

- **GitHub Issues**: [Report bugs or request features](https://github.com/MrTimonM/tuitionpay-helios-dapp/issues)
- **Helios Documentation**: [Official Helios Docs](https://docs.helioschainlabs.org)
- **Community Discord**: [Join the Helios Community](https://discord.gg/helios)

### 📞 Contact Me

- **Discord**: earunboofan1971

## 🙏 Acknowledgments

- **Helios Chain Labs** for providing the testnet infrastructure
- **MetaMask** for wallet integration capabilities
- **Ethers.js** for blockchain interaction library
- **Tailwind CSS** for the styling framework
- **Framer Motion** for smooth animations

---

**Built with ❤️ for the future of decentralized education payments**

*This project is for educational and demonstration purposes on the Helios Testnet. Not for production use with real funds.*