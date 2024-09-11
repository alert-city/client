// app/privacy-policy/page.tsx
import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

      <p className="mb-4">
        <strong>Effective Date</strong>: September 12, 2024
      </p>

      <p className="mb-4">
        Alert City ("we," "our," or "the website") respects your privacy and is committed to protecting the personal information you provide when using our platform. This Privacy Policy outlines how we collect, use, store, and protect your personal information.
      </p>

      <h2 className="text-2xl font-bold mb-2">1. Information We Collect</h2>
      <p className="mb-4">
        We may collect the following information when you use the Alert City platform:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>Personal Information</strong>: This includes your first name, last name, username, display name, organization name, and phone number.</li>
        <li><strong>Login Information</strong>: This includes your username, password, Google ID, and Facebook ID.</li>
        <li><strong>Account Information</strong>: This includes your account type, roles, organization details, and staff details.</li>
        <li><strong>Security Information</strong>: This includes whether two-factor authentication (2FA) is enabled, your 2FA secret, account activation status, and first login status.</li>
        <li><strong>Authentication Tokens</strong>: We store your access token and refresh token to ensure secure access after login.</li>
        <li><strong>Other Information</strong>: This includes your avatar URL and the number of failed code attempts.</li>
      </ul>

      <h2 className="text-2xl font-bold mb-2">2. How We Use Your Information</h2>
      <p className="mb-4">
        We use your information to provide and improve our services, including but not limited to the following purposes:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>To verify your identity and secure your account.</li>
        <li>To manage the submission and response to emergency events.</li>
        <li>To provide personalized services, such as displaying your account information and roles.</li>
        <li>To send you account-related notifications and security alerts.</li>
        <li>To enable two-factor authentication for your account.</li>
        <li>To process event information related to your organization and staff.</li>
      </ul>

      <h2 className="text-2xl font-bold mb-2">3. Sharing and Disclosure of Information</h2>
      <p className="mb-4">
        We do not sell, rent, or otherwise disclose your personal information to third parties without your consent, except in the following circumstances:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>Legal Requirements</strong>: We may disclose your information if we believe it is necessary to comply with a legal obligation, court order, or other legal process.</li>
        <li><strong>Service Providers</strong>: We may share your information with trusted third-party service providers who assist us in delivering our services.</li>
      </ul>

      <h2 className="text-2xl font-bold mb-2">4. Information Storage and Security</h2>
      <p className="mb-4">
        We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. Your data is stored on encrypted servers, and we employ various security measures, including data encryption, access controls, and regular security audits.
      </p>

      <h2 className="text-2xl font-bold mb-2">5. Your Rights</h2>
      <p className="mb-4">
        Under applicable laws, you have the right to access, correct, or delete your personal information that we hold. You can also choose to opt out of receiving email notifications or other communications from us. If you wish to exercise these rights, please contact us using the information below.
      </p>

      <h2 className="text-2xl font-bold mb-2">6. Changes to the Privacy Policy</h2>
      <p className="mb-4">
        We reserve the right to modify this Privacy Policy at any time. Any changes will take effect immediately and will be posted on this page. We encourage you to review this Privacy Policy regularly to stay informed about how we protect your information.
      </p>

      <h2 className="text-2xl font-bold mb-2">7. Contact Us</h2>
      <p className="mb-4">
        If you have any questions or need further information about this Privacy Policy, please contact us at:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Email: jinyuanzhang1992@gmail.com</li>
        <li>Phone: +61 466 666 603</li>
        <li>Address: 6 Dripstone Road, Casuarina, Northern Territory, AU 0810</li>
      </ul>
    </div>
  );
};

export default PrivacyPolicyPage;