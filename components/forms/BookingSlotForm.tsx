'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, Clock, User, Phone, Mail, X } from 'lucide-react';
import { getTimeSlotsForDate, calculateEndTime, formatTimeForDisplay } from '@/lib/booking-slots';

interface BookingSlotFormProps {
  serviceName: string;
  serviceType: 'offline' | 'online';
  onClose: () => void;
  onSuccess: (appointmentId: string, leadId: string, whatsappUrl: string) => void;
  inline?: boolean; // If true, renders inline instead of as a modal
}

export function BookingSlotForm({ serviceName, serviceType, onClose, onSuccess, inline = false }: BookingSlotFormProps) {
  const searchParams = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: '',
    referrer: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Read UTM parameters from URL
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

  // Get available dates (next 30 days, including Sundays)
  const getAvailableDates = () => {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedDate) {
      newErrors.date = 'Please select a date';
    }

    if (!selectedTime) {
      newErrors.time = 'Please select a time slot';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (formData.phone.trim().length < 10) {
      newErrors.phone = 'Phone must be at least 10 digits';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create lead first
      const leadSource = serviceType === 'offline' ? 'service-booking-offline' : 'service-booking-online';
      const leadResponse = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          goal: `Booking ${serviceType === 'offline' ? 'Free Trial' : 'Consultation'} for ${serviceName}`,
          source: leadSource,
          utm_source: formData.utm_source || null,
          utm_medium: formData.utm_medium || null,
          utm_campaign: formData.utm_campaign || null,
          utm_content: formData.utm_content || null,
          referrer: formData.referrer || null,
        }),
      });

      if (!leadResponse.ok) {
        const errorData = await leadResponse.json();
        throw new Error(errorData.error || 'Failed to create lead');
      }

      const leadData = await leadResponse.json();
      const leadId = leadData.data.id;

      // Step 2: Create appointment and link to lead
      const endTime = calculateEndTime(selectedTime);
      const title = serviceType === 'offline' 
        ? `Free Trial - ${serviceName}`
        : `Consultation - ${serviceName}`;

      const appointmentResponse = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          date: selectedDate,
          start_time: selectedTime,
          end_time: endTime,
          type: serviceType === 'offline' ? 'studio' : 'consultation',
          notes: `Service: ${serviceName}\nClient: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nLead ID: ${leadId}`,
        }),
      });

      if (!appointmentResponse.ok) {
        const errorData = await appointmentResponse.json();
        throw new Error(errorData.error || 'Failed to book appointment');
      }

      const appointmentData = await appointmentResponse.json();
      const appointmentId = appointmentData.data.id;

      // Generate WhatsApp URL
      const baseNumber = '6361079633';
      const envWhatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || baseNumber;
      const whatsappClean = envWhatsapp.replace(/[^0-9]/g, '');
      let whatsappWithCountry: string;
      
      if (whatsappClean.length === 12 && whatsappClean.startsWith('91')) {
        whatsappWithCountry = whatsappClean;
      } else if (whatsappClean.length === 10) {
        whatsappWithCountry = `91${whatsappClean}`;
      } else {
        whatsappWithCountry = '916361079633';
      }

      const dateObj = new Date(selectedDate);
      const formattedDate = dateObj.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      const message = `Hi, I'd like to book a ${serviceType === 'offline' ? 'Free Trial' : 'Consultation'} for:\n\n` +
        `• Service: ${serviceName}\n` +
        `• Date: ${formattedDate}\n` +
        `• Time: ${selectedTime}\n` +
        `• Name: ${formData.name}\n` +
        `• Phone: ${formData.phone}\n\n` +
        `Please confirm availability.`;

      const whatsappUrl = `https://wa.me/${whatsappWithCountry}?text=${encodeURIComponent(message)}`;

      onSuccess(appointmentId, leadId, whatsappUrl);
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      alert(error.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const renderForm = () => (
    <div className={`${inline ? 'w-full premium-card rounded-2xl p-6' : 'bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto premium-card border border-gray-700'}`}>
      {!inline && (
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white">Book Your Slot</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
      {inline && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Book Your Slot</h2>
          <p className="text-gray-400">Mon to Sat: 10:00 AM onwards (20 min slots) | Sun: 9:00-10:00 AM (20 min slots)</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={`${inline ? '' : 'p-6'} space-y-6`}>
          {/* Date Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
              <Calendar className="w-5 h-5 text-red-400" />
              Select Date *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {availableDates.slice(0, 12).map((date) => {
                const dateObj = new Date(date);
                const dayOfWeek = dateObj.getDay();
                const dayName = dateObj.toLocaleDateString('en-IN', { weekday: 'short' });
                const dayNum = dateObj.getDate();
                const month = dateObj.toLocaleDateString('en-IN', { month: 'short' });
                const isSelected = selectedDate === date;
                const isSunday = dayOfWeek === 0;

                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedTime(''); // Reset time when date changes
                      if (errors.date) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.date;
                          return newErrors;
                        });
                      }
                    }}
                    className={`p-3 rounded-xl border-2 transition-all relative ${
                      isSelected
                        ? 'border-red-500 bg-red-500/10 text-white'
                        : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-red-500/50'
                    } ${isSunday ? 'ring-2 ring-blue-500/30' : ''}`}
                  >
                    <div className="text-xs font-semibold">{dayName}</div>
                    <div className="text-lg font-bold">{dayNum}</div>
                    <div className="text-xs">{month}</div>
                    {isSunday && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
            {errors.date && (
              <p className="mt-2 text-sm text-red-400">{errors.date}</p>
            )}
          </div>

          {/* Time Selection */}
          {selectedDate && (() => {
            const dateObj = new Date(selectedDate);
            const dayOfWeek = dateObj.getDay();
            const isSunday = dayOfWeek === 0;
            const availableSlots = getTimeSlotsForDate(selectedDate);
            const slotLabel = isSunday 
              ? 'Sunday - 9:00 AM to 10:00 AM (20 min slots)'
              : 'Mon to Sat - 10:00 AM onwards (20 min slots)';

            return (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                  <Clock className="w-5 h-5 text-red-400" />
                  Select Time Slot *
                </label>
                <div className="mb-3">
                  <div className="text-xs font-semibold text-gray-400 mb-2">{slotLabel}</div>
                  <div className={`grid ${isSunday ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6'} gap-2`}>
                    {availableSlots.map((time) => {
                      const isSelected = selectedTime === time;
                      
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => {
                            setSelectedTime(time);
                            if (errors.time) {
                              setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.time;
                                return newErrors;
                              });
                            }
                          }}
                          className={`p-2 rounded-lg border transition-all text-sm ${
                            isSelected
                              ? 'border-red-500 bg-red-500/10 text-white font-semibold'
                              : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-red-500/50'
                          }`}
                        >
                          {formatTimeForDisplay(time)}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {errors.time && (
                  <p className="mt-2 text-sm text-red-400">{errors.time}</p>
                )}
              </div>
            );
          })()}

          {/* Client Information */}
          <div className="space-y-4 pt-4 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-red-400" />
              Your Details
            </h3>

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.name ? 'border-red-500' : 'border-gray-700'
                } bg-gray-800/50 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none`}
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-300 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.phone ? 'border-red-500' : 'border-gray-700'
                } bg-gray-800/50 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none`}
                placeholder="+91 XXXXX XXXXX"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.email ? 'border-red-500' : 'border-gray-700'
                } bg-gray-800/50 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            {!inline && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${inline ? 'w-full' : 'flex-1'} px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
    </div>
  );

  if (inline) {
    return renderForm();
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {renderForm()}
    </div>
  );
}

