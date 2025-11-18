import React from 'react';
import { Link } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const TermsOfService: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-6xl">
        <header className="flex justify-between items-center py-4">
          <Link to="/">
            <img src="https://i.ibb.co/G45wT806/boldlogotransparent.png" alt="Bold Logo" className="h-12" />
          </Link>
          <WalletMultiButton />
        </header>

        <div className="mt-10 p-8 bg-gray-800 rounded-lg shadow-lg text-gray-200">
          <h1 className="text-4xl font-bold mb-8 text-white">Terms of Service for Bold</h1>

          <p className="mb-6 text-lg">
            <strong>Last Updated: October 26, 2023</strong>
          </p>

          <p className="mb-6 text-lg">
            Welcome to Bold, a decentralized prediction market platform operating on the Solana blockchain. These Terms of Service ("Terms") govern your access to and use of the Bold website, applications, and services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Service.
          </p>

          <h2 className="text-3xl font-semibold mb-5 text-white">1. Acceptance of Terms</h2>
          <p className="mb-6 text-lg">
            By using Bold, you affirm that you are at least 18 years of age, or the legal age of majority in your jurisdiction, and are legally competent to enter into these Terms. You also acknowledge that you have read, understood, and agree to be bound by these Terms, as well as our Privacy Policy.
          </p>

          <h2 className="text-3xl font-semibold mb-5 text-white">2. The Service</h2>
          <p className="mb-4 text-lg">Bold provides a platform for users to create, participate in, and resolve prediction markets on various real-world events. The Service operates on the Solana blockchain, leveraging smart contracts for market creation, betting, and resolution. Bold itself does not act as a counterparty to any bets or predictions.</p>
          <ul className="list-disc list-inside ml-6 mb-6 text-lg">
            <li className="mb-2"><strong>Decentralized Nature:</strong> Bold is a decentralized application. All transactions are executed on the Solana blockchain and are irreversible. You are solely responsible for your interactions with the smart contracts.</li>
            <li className="mb-2"><strong>No Custody:</strong> Bold does not take custody of any user funds. All funds are held in smart contracts on the Solana blockchain.</li>
            <li className="mb-2"><strong>Leverage:</strong> Bold may offer features that allow for leveraged positions in prediction markets. Engaging in leveraged trading carries a high level of risk and can result in significant losses, including the total loss of your initial capital. You acknowledge and agree that you understand these risks and are solely responsible for any losses incurred.</li>
          </ul>

          <h2 className="text-3xl font-semibold mb-5 text-white">3. Risks of Using Bold</h2>
          <p className="mb-4 text-lg">You acknowledge and agree that using Bold involves significant risks, including but not limited to:</p>
          <ul className="list-disc list-inside ml-6 mb-6 text-lg">
            <li className="mb-2"><strong>Financial Risk:</strong> Prediction markets are speculative. You may lose all funds you bet.</li>
            <li className="mb-2"><strong>Leverage Risk:</strong> Using leverage significantly amplifies both potential gains and losses. Even small market movements can have a substantial impact on your account balance. You could lose more than your initial investment.</li>
            <li className="mb-2"><strong>Smart Contract Risk:</strong> Smart contracts are experimental technology. Bugs, vulnerabilities, or exploits could lead to loss of funds.</li>
            <li className="mb-2"><strong>Blockchain Risk:</strong> Risks associated with the Solana blockchain, including network congestion, transaction failures, or changes to the protocol.</li>
            <li className="mb-2"><strong>Market Resolution Risk:</strong> The accuracy and fairness of market resolution depend on the designated oracle or resolution mechanism. Disputes may arise.</li>
            <li className="mb-2"><strong>Regulatory Risk:</strong> The legal and regulatory landscape for cryptocurrencies and decentralized applications is uncertain and evolving. New regulations could impact the Service.</li>
            <li className="mb-2"><strong>Security Risk:</strong> Your wallet security is your responsibility. Loss of private keys or unauthorized access to your wallet can result in irreversible loss of funds.</li>
          </ul>
          <p className="mb-6 text-lg">
            By using Bold, you expressly agree to assume all these risks.
          </p>

          <h2 className="text-3xl font-semibold mb-5 text-white">4. User Responsibilities</h2>
          <p className="mb-4 text-lg">As a user of Bold, you agree to:</p>
          <ul className="list-disc list-inside ml-6 mb-6 text-lg">
            <li className="mb-2">Comply with all applicable laws and regulations in your jurisdiction.</li>
            <li className="mb-2">Ensure the security of your Solana wallet and private keys. Bold is not responsible for lost or stolen private keys.</li>
            <li className="mb-2">Provide accurate and truthful information when creating markets.</li>
            <li className="mb-2">Understand the terms and conditions of each market before placing a bet, especially those involving leverage.</li>
            <li className="mb-2">Not use the Service for any illegal or unauthorized purpose, including but not limited to money laundering, terrorist financing, or fraud.</li>
            <li className="mb-2">Not engage in any activity that interferes with or disrupts the Service.</li>
          </ul>

          <h2 className="text-3xl font-semibold mb-5 text-white">5. Intellectual Property</h2>
          <p className="mb-6 text-lg">
            All content, trademarks, service marks, trade names, logos, and intellectual property displayed on Bold are the property of Bold or its licensors. You may not use, copy, reproduce, modify, distribute, or display any of these without prior written consent.
          </p>

          <h2 className="text-3xl font-semibold mb-5 text-white">6. Disclaimers</h2>
          <p className="mb-4 text-lg">THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. BOLD DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.</p>
          <p className="mb-6 text-lg">
            BOLD IS NOT A FINANCIAL ADVISOR, BROKER, OR EXCHANGE. THE INFORMATION PROVIDED ON THE PLATFORM IS FOR INFORMATIONAL PURPOSES ONLY AND DOES NOT CONSTITUTE FINANCIAL, INVESTMENT, OR LEGAL ADVICE. YOU SHOULD CONSULT WITH A QUALIFIED PROFESSIONAL BEFORE MAKING ANY FINANCIAL DECISIONS.
          </p>

          <h2 className="text-3xl font-semibold mb-5 text-white">7. Limitation of Liability</h2>
          <p className="mb-6 text-lg">
            TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL BOLD, ITS AFFILIATES, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO THE USE OF, OR INABILITY TO USE, THE SERVICE.
          </p>

          <h2 className="text-3xl font-semibold mb-5 text-white">8. Indemnification</h2>
          <p className="mb-6 text-lg">
            You agree to indemnify, defend, and hold harmless Bold, its affiliates, officers, directors, employees, and agents from and against any and all claims, liabilities, damages, losses, costs, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with your access to or use of the Service, your violation of these Terms, or your infringement of any intellectual property or other right of any person or entity.
          </p>

          <h2 className="text-3xl font-semibold mb-5 text-white">9. Governing Law</h2>
          <p className="mb-6 text-lg">
            These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction of Bold's operation, e.g., Delaware, without regard to its conflict of law principles.
          </p>

          <h2 className="text-3xl font-semibold mb-5 text-white">10. Changes to Terms</h2>
          <p className="mb-6 text-lg">
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>

          <h2 className="text-3xl font-semibold mb-5 text-white">11. Contact Us</h2>
          <p className="mb-6 text-lg">
            If you have any questions about these Terms, please contact us at: <a href="mailto:support@predictwithbold.com" className="text-primary hover:underline">support@predictwithbold.com</a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default TermsOfService;
