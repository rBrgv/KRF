/**
 * Shared booking slot configuration
 * All bookings must use these time slots
 */

// Mon-Sat: Starting at 10:00 AM with 20-minute intervals
export const MON_SAT_SLOTS = (() => {
  const slots: string[] = [];
  // Generate slots from 10:00 AM to 1:00 PM
  for (let hour = 10; hour <= 12; hour++) {
    for (let min = 0; min < 60; min += 20) {
      slots.push(`${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
    }
  }
  // Add 1:00 PM slot
  slots.push('13:00');
  return slots;
})();

// Sunday: 9:00, 9:20, 9:40, 10:00 AM
export const SUNDAY_SLOTS = ['09:00', '09:20', '09:40', '10:00'];

/**
 * Get available time slots for a given date
 */
export function getTimeSlotsForDate(date: string | Date): string[] {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const dayOfWeek = dateObj.getDay();
  
  // Sunday (0) gets special slots
  if (dayOfWeek === 0) {
    return SUNDAY_SLOTS;
  }
  
  // Mon-Sat get regular slots
  return MON_SAT_SLOTS;
}

/**
 * Check if a time slot is valid for a given date
 */
export function isValidTimeSlot(date: string | Date, time: string): boolean {
  const validSlots = getTimeSlotsForDate(date);
  return validSlots.includes(time);
}

/**
 * Calculate end time (20 minutes after start)
 */
export function calculateEndTime(startTime: string): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  let endHours = hours;
  let endMinutes = minutes + 20;
  
  if (endMinutes >= 60) {
    endHours += 1;
    endMinutes -= 60;
  }
  
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}

/**
 * Format time for display (add AM/PM)
 */
export function formatTimeForDisplay(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  if (hours < 12) {
    return `${hours}:${String(minutes).padStart(2, '0')} AM`;
  } else if (hours === 12) {
    return `12:${String(minutes).padStart(2, '0')} PM`;
  } else {
    return `${hours - 12}:${String(minutes).padStart(2, '0')} PM`;
  }
}

