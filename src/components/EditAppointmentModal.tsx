import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Appointment {
  id: number;
  title: string;
  subject: string;
  date: string;
}

interface EditAppointmentModalProps {
  isOpen: boolean;
  appointment: Appointment;
  onClose: () => void;
  onSave: (updatedAppointment: Appointment) => void;
}

export function EditAppointmentModal({ isOpen, appointment, onClose, onSave }: EditAppointmentModalProps) {
  const [appointmentTitle, setAppointmentTitle] = useState(appointment.title);
  const [appointmentSubject, setAppointmentSubject] = useState(appointment.subject);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [attendeeValue, setAttendeeValue] = useState('');
  const [showAttendeeDropdown, setShowAttendeeDropdown] = useState(false);

  useEffect(() => {
    // Parse the existing date (format: "Feb 12, 2026, 3:00 pm")
    if (appointment.date) {
      const dateTimeMatch = appointment.date.match(/([A-Za-z]+\s\d+,\s\d+),\s(\d+:\d+\s[ap]m)/);
      if (dateTimeMatch) {
        setAppointmentDate(dateTimeMatch[1]);
        setAppointmentTime(dateTimeMatch[2]);
      }
    }
    setAppointmentTitle(appointment.title);
    setAppointmentSubject(appointment.subject);
  }, [appointment]);

  const handleSave = () => {
    const updatedAppointment: Appointment = {
      id: appointment.id,
      title: appointmentTitle,
      subject: appointmentSubject,
      date: `${appointmentDate}, ${appointmentTime}`
    };
    onSave(updatedAppointment);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <div className="bg-white rounded-[20px] w-full max-w-lg p-6 relative mx-4" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Edit appointment</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-900 mb-2 block">Title</label>
            <input
              type="text"
              placeholder="Enter title"
              value={appointmentTitle}
              onChange={(e) => setAppointmentTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-sm text-gray-900 mb-2 block">Subject</label>
            <input
              type="text"
              placeholder="Enter subject"
              value={appointmentSubject}
              onChange={(e) => setAppointmentSubject(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-sm text-gray-900 mb-2 block">Date & Time</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Sat Feb 7, 2026"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="12:00 AM"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                className="px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-900 mb-2 block">Attendees (for google invite)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Choose attendees or team members"
                value={attendeeValue}
                onChange={(e) => setAttendeeValue(e.target.value)}
                onFocus={() => setShowAttendeeDropdown(true)}
                onBlur={() => setTimeout(() => setShowAttendeeDropdown(false), 200)}
                className="w-full px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {showAttendeeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => {
                      setAttendeeValue('#1 Team Member');
                      setShowAttendeeDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                  >
                    #1 Team Member
                  </button>
                  <button
                    onClick={() => {
                      setAttendeeValue('#2 Team Member');
                      setShowAttendeeDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                  >
                    #2 Team Member
                  </button>
                  <button
                    onClick={() => {
                      setAttendeeValue('#3 Team Member');
                      setShowAttendeeDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    #3 Team Member
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 text-sm border border-[#e8e8e8] text-[#051046] rounded-[32px] hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 bg-[#9473ff] hover:bg-[#7f5fd9] text-white rounded-[32px] flex items-center justify-center gap-2 whitespace-nowrap text-[16px] px-[24px] py-[10px]"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
