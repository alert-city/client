import React from 'react';
import { useTranslations } from 'next-intl';

const PrivacyPolicyPage = () => {
  const t = useTranslations('privacyPolicy');

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>

      <p className="mb-4">
        <strong>{t('effectiveDate')}</strong>
      </p>

      <h2 className="text-2xl font-bold mb-2">{t('section1Title')}</h2>
      <p className="mb-4">{t('section1Content')}</p>
      <ul className="list-disc ml-6 mb-4">
        <li>{t('personalInformation')}</li>
        <li>{t('loginInformation')}</li>
        <li>{t('accountInformation')}</li>
        <li>{t('securityInformation')}</li>
        <li>{t('authenticationTokens')}</li>
        <li>{t('otherInformation')}</li>
      </ul>

      <h2 className="text-2xl font-bold mb-2">{t('section2Title')}</h2>
      <p className="mb-4">{t('section2Content')}</p>

      <h2 className="text-2xl font-bold mb-2">{t('section3Title')}</h2>
      <p className="mb-4">{t('section3Content')}</p>
      <ul className="list-disc ml-6 mb-4">
        <li>{t('legalRequirements')}</li>
        <li>{t('serviceProviders')}</li>
      </ul>

      <h2 className="text-2xl font-bold mb-2">{t('section4Title')}</h2>
      <p className="mb-4">{t('section4Content')}</p>

      <h2 className="text-2xl font-bold mb-2">{t('section5Title')}</h2>
      <p className="mb-4">{t('section5Content')}</p>

      <h2 className="text-2xl font-bold mb-2">{t('section6Title')}</h2>
      <p className="mb-4">{t('section6Content')}</p>

      <h2 className="text-2xl font-bold mb-2">{t('section7Title')}</h2>
      <p className="mb-4">{t('contactUs')}</p>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>{t('email')}</strong>: jinyuanzhang1992@gmail.com</li>
        <li><strong>{t('phone')}</strong>: +61 466 666 603</li>
        <li><strong>{t('address')}</strong>: 6 Dripstone Road, Casuarina, Northern Territory, AU 0810</li>
      </ul>
    </div>
  );
};

export default PrivacyPolicyPage;