'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface ProgramRegistrationFormProps {
  programName: string; // '4-week-starter' or 'master-transformation'
  programTitle: string; // Display name
  programPrice: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function ProgramRegistrationForm({ programName, programTitle, programPrice }: ProgramRegistrationFormProps) {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: '',
    referrer: '',
  });

  useEffect(() => {
    const utmSource = searchParams.get('utm_source') || '';
    const utmMedium = searchParams.get('utm_medium') || '';
    const utmCampaign = searchParams.get('utm_campaign') || '';
    const utmContent = searchParams.get('utm_content') || '';
    const referrer = typeof window !== 'undefined' ? document.referrer : '';

    setFormData((prev) => ({
      ...prev,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_content: utmContent,
      referrer: referrer,
    }));
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadRazorpay = (): Promise<any> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(window.Razorpay);
      script.onerror = () => resolve(null);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Step 1: Create program registration
      const registrationResponse = await fetch('/api/programs/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programName,
          programTitle,
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone,
          city: formData.city || null,
          source: 'website',
          utm_source: formData.utm_source || null,
          utm_medium: formData.utm_medium || null,
          utm_campaign: formData.utm_campaign || null,
          utm_content: formData.utm_content || null,
          referrer: formData.referrer || null,
          amount_in_inr: programPrice,
          payment_mode: programPrice > 0 ? 'razorpay' : null,
        }),
      });

      if (!registrationResponse.ok) {
        let errorData;
        try {
          const text = await registrationResponse.text();
          console.error('[Program Registration] Error response text:', text);
          errorData = JSON.parse(text);
        } catch (e) {
          errorData = { error: `HTTP ${registrationResponse.status}: ${registrationResponse.statusText}` };
        }
        const errorMessage = errorData.error || errorData.message || 'Failed to register';
        const errorDetails = errorData.details ? `${errorMessage}: ${errorData.details}` : errorMessage;
        throw new Error(errorDetails);
      }

      const registrationResponseData = await registrationResponse.json();
      console.log('[Program Registration] Registration response:', registrationResponseData);
      
      const registration = registrationResponseData.data || registrationResponseData;
      
      if (!registration) {
        console.error('[Program Registration] No registration in response:', registrationResponseData);
        throw new Error('Registration created but no registration data received');
      }
      
      if (!registration.id) {
        console.error('[Program Registration] Registration missing ID:', registration);
        throw new Error('Registration created but missing ID');
      }
      
      console.log('[Program Registration] Registration created successfully:', {
        id: registration.id,
        programName: registration.program_name,
        status: registration.status,
      });

      // If free program, mark as confirmed
      if (programPrice === 0) {
        setIsSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          city: '',
          utm_source: '',
          utm_medium: '',
          utm_campaign: '',
          utm_content: '',
          referrer: '',
        });
        return;
      }

      // Step 2: Create payment order
      const amount = Number(programPrice);
      if (isNaN(amount) || amount <= 0) {
        throw new Error(`Invalid program price: ${programPrice}. Amount must be a positive number.`);
      }

      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          program_registration_id: registration.id,
          amount_in_inr: amount,
        }),
      });

      if (!orderResponse.ok) {
        let errorData;
        try {
          const text = await orderResponse.text();
          errorData = JSON.parse(text);
        } catch (e) {
          errorData = { error: `HTTP ${orderResponse.status}: ${orderResponse.statusText}` };
        }
        throw new Error(errorData.error || errorData.message || 'Failed to create payment order');
      }

      const orderData = await orderResponse.json();

      // Step 3: Open Razorpay checkout
      const Razorpay = await loadRazorpay();
      if (!Razorpay) {
        throw new Error('Payment gateway not available');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'KR Fitness',
        description: `${programTitle} - Program Registration`,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                program_registration_id: registration.id,
              }),
            });

            if (verifyResponse.ok) {
              const params = new URLSearchParams({
                registration_id: registration.id,
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                program: programName,
              });
              window.location.href = `/programs/success?${params.toString()}`;
            } else {
              const error = await verifyResponse.json();
              window.location.href = `/programs/failed?registration_id=${registration.id}&error=${encodeURIComponent(error.error || 'Payment verification failed')}`;
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            const params = new URLSearchParams({
              registration_id: registration.id,
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              program: programName,
            });
            window.location.href = `/programs/success?${params.toString()}`;
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#DC2626',
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
      };

      const razorpay = new Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        window.location.href = `/programs/failed?registration_id=${registration.id}&error=${encodeURIComponent(response.error.description)}`;
      });
      razorpay.open();
    } catch (error: any) {
      console.error('[Program Registration] Error:', error);
      const errorMessage = error.message || 'Something went wrong. Please try again.';
      alert(errorMessage);
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
        <p className="text-green-400 font-semibold">
          Registration successful! We'll contact you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
          Phone *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
          placeholder="+91 XXXXX XXXXX"
        />
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
          City
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
          placeholder="Your city"
        />
      </div>

      {programPrice > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-sm text-gray-300">
            <strong className="text-white">Amount to pay:</strong> <span className="text-red-400 font-semibold">₹{programPrice}</span>
          </p>
        </div>
      )}

      <input type="hidden" name="utm_source" value={formData.utm_source} />
      <input type="hidden" name="utm_medium" value={formData.utm_medium} />
      <input type="hidden" name="utm_campaign" value={formData.utm_campaign} />
      <input type="hidden" name="utm_content" value={formData.utm_content} />
      <input type="hidden" name="referrer" value={formData.referrer} />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed premium-glow"
      >
        {isSubmitting
          ? 'Processing...'
          : programPrice === 0
          ? 'Register for Free'
          : `Pay ₹${programPrice} & Register`}
      </button>
    </form>
  );
}



