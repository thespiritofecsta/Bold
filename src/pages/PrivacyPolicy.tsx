import React from 'react';
import { Link } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const PrivacyPolicy: React.FC = () => {
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
          <h1 className="text-4xl font-bold mb-8 text-white">Privacy Policy for Bold</h1>

          <p className="mb-6 text-lg">
            <strong>Last Updated: October 26, 2023</strong>
          </p>

          <p className="mb-6 text-lg">
            Welcome to Bold, a decentralized prediction market platform operating on the Solana blockchain. At Bold, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>

          <h2 className="text-3xl font-semibold mb-5 text-white">1. Information We Collect</h2>
          <p className="mb-4 text-lg">Given the decentralized nature of Bold, our direct collection of personal information is minimal. However, certain information is inherently part of using a blockchain-based application:</p>
          <ul className="list-disc list-inside ml-6 mb-6 text-lg">
            <li className="mb-2"><strong>Wallet Public Key:</strong> When you connect your Solana wallet to Bold, we access your public key. This is essential for identifying your account on the blockchain, facilitating transactions, and displaying your market activities (e.g., bets placed, markets created). We do not have access to your private keys.</li>
            <li className="mb-2"><strong>Transaction Data:</strong> All transactions (e.g., placing bets, creating markets, resolving markets) are recorded on the Solana blockchain. This data is public and immutable. We do not store this transaction data on our servers beyond what is necessary for displaying market information on the platform.</li>
            <li className="mb-2"><strong>Market Data:</strong> Information related to markets you create (e.g., market title, description, image URL, end date, resolution date) is stored in our database to facilitate platform functionality and display. This data is associated with your public key.</li>
            <li className="mb-2"><strong>Usage Data:</strong> We may collect anonymous usage data through analytics tools (e.g., Google Analytics, if implemented) to understand how users interact with our platform, identify trends, and improve user experience. This data does not identify individual users.</li>
          </ul>

          <h2 className="text-3xl font-semibold mb-5 text-white">2. How We Use Your Information</h2>
          <p className="mb-4 text-lg">We use the limited information we collect for the following purposes:</p>
          <ul className="list-disc list-inside ml-6 mb-6 text-lg">
            <li className="mb-2">To operate and maintain the Bold platform.</li>
            <li className="mb-2">To display your market activities and profile information.</li>
            <li className="mb-2">To facilitate the creation, management, and resolution of prediction markets.</li>
            <li className="mb-2">To improve our platform's functionality, user experience, and security.</li>
            <li className="mb-2">To comply with legal obligations (if any apply to our operations).</li>
          </ul>

          <h2 className="text-3xl font-semibold mb-5 text-white">3. Disclosure of Your Information</h2>
          <p className="mb-4 text-lg">We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. However, please be aware of the following:</p>
          <ul className="list-disc list-inside ml-6 mb-6 text-lg">
            <li className="mb-2"><strong>Blockchain Transparency:</strong> All transactions and associated public keys on the Solana blockchain are public and accessible to anyone.</li>
            <li className="mb-2"><strong>Service Providers:</strong> We may share anonymized or aggregated data with third-party service providers who assist us in operating our platform, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.</li>
            <li className="mb-2"><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court order or government agency).</li>
          </ul>

          <h2 className="text-3xl font-semibold mb-5 text-white">4. Data Security</h2>
          <p className="mb-6 text-lg">
            We implement a variety of security measures to maintain the safety of your information. However, remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security. You are responsible for maintaining the security of your wallet and private keys.
          </p>

          <h2 className="text-3xl font-semibold mb-5 text-white">5. Third-Party Links</h2>
          <p className="mb-6 text-lg">
            Our platform may contain links to third-party websites or services that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
          </p>

          <h2 className="text-3xl font-semibold mb-5 text-white">6. Children's Privacy</h2>
          <p className="mb-6 text-lg">
            Bold is not intended for use by anyone under the age of 18. We do not knowingly collect personally identifiable information from anyone under 18. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us. If we become aware that we have collected personal data from children without verification of parental consent, we take steps to remove that information from our servers.
          </p>

          <h2 className="text-3xl font-semibold mb-5 text-white">7. Changes to This Privacy Policy</h2>
          <p className="mb-6 text-lg">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>

          <h2 className="text-3xl font-semibold mb-5 text-white">8. Contact Us</h2>
          <p className="mb-6 text-lg">
            If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:support@predictwithbold.com" className="text-primary hover:underline">support@predictwithbold.com</a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
