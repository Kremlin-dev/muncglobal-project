import React from 'react';
import PaymentTest from '../components/Payment/PaymentTest';
import { Helmet } from 'react-helmet-async';

const PaymentTestPage = () => {
  return (
    <>
      <Helmet>
        <title>Payment Test | MUNCGLOBAL Conference 2025</title>
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Payment System Test</h1>
        <PaymentTest />
      </div>
    </>
  );
};

export default PaymentTestPage;
