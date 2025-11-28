'use client';

import { useState, useEffect } from 'react';
import { Settings, Building2, Mail, Bell, Users, Save, Loader2 } from 'lucide-react';

interface Setting {
  id: string;
  key: string;
  value: string | null;
  category: string;
  description: string | null;
}

interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: 'admin' | 'trainer';
  created_at: string;
}

export function SettingsPageContent() {
  const [activeTab, setActiveTab] = useState<'gym' | 'email' | 'notification' | 'users' | 'system'>('gym');
  const [settings, setSettings] = useState<Setting[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form states
  const [gymForm, setGymForm] = useState({
    gym_name: '',
    gym_address: '',
    gym_phone: '',
    gym_email: '',
    gym_website: '',
  });

  const [emailForm, setEmailForm] = useState({
    email_from: '',
    email_trainer_name: '',
    email_signature_phone: '',
  });

  const [notificationForm, setNotificationForm] = useState({
    notification_appointment_reminder_hours: '24',
    notification_payment_reminder_days: '7',
    notification_membership_expiry_days: '7',
    notification_enabled: 'true',
  });

  const [systemForm, setSystemForm] = useState({
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    date_format: 'DD/MM/YYYY',
  });

  const [userForm, setUserForm] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role: 'trainer' as 'admin' | 'trainer',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsRes, usersRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/settings/users'),
      ]);

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        const settingsList = data.data.settings || [];
        setSettings(settingsList);

        // Populate forms
        const settingsObj: Record<string, string> = {};
        settingsList.forEach((s: Setting) => {
          settingsObj[s.key] = s.value || '';
        });

        setGymForm({
          gym_name: settingsObj.gym_name || '',
          gym_address: settingsObj.gym_address || '',
          gym_phone: settingsObj.gym_phone || '',
          gym_email: settingsObj.gym_email || '',
          gym_website: settingsObj.gym_website || '',
        });

        setEmailForm({
          email_from: settingsObj.email_from || '',
          email_trainer_name: settingsObj.email_trainer_name || '',
          email_signature_phone: settingsObj.email_signature_phone || '',
        });

        setNotificationForm({
          notification_appointment_reminder_hours: settingsObj.notification_appointment_reminder_hours || '24',
          notification_payment_reminder_days: settingsObj.notification_payment_reminder_days || '7',
          notification_membership_expiry_days: settingsObj.notification_membership_expiry_days || '7',
          notification_enabled: settingsObj.notification_enabled || 'true',
        });

        setSystemForm({
          timezone: settingsObj.timezone || 'Asia/Kolkata',
          currency: settingsObj.currency || 'INR',
          date_format: settingsObj.date_format || 'DD/MM/YYYY',
        });
      }

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (category: string) => {
    setSaving(true);
    try {
      let settingsToUpdate: Array<{ key: string; value: string | null }> = [];

      if (category === 'gym') {
        settingsToUpdate = [
          { key: 'gym_name', value: gymForm.gym_name },
          { key: 'gym_address', value: gymForm.gym_address },
          { key: 'gym_phone', value: gymForm.gym_phone },
          { key: 'gym_email', value: gymForm.gym_email },
          { key: 'gym_website', value: gymForm.gym_website },
        ];
      } else if (category === 'email') {
        settingsToUpdate = [
          { key: 'email_from', value: emailForm.email_from },
          { key: 'email_trainer_name', value: emailForm.email_trainer_name },
          { key: 'email_signature_phone', value: emailForm.email_signature_phone },
        ];
      } else if (category === 'notification') {
        settingsToUpdate = [
          { key: 'notification_appointment_reminder_hours', value: notificationForm.notification_appointment_reminder_hours },
          { key: 'notification_payment_reminder_days', value: notificationForm.notification_payment_reminder_days },
          { key: 'notification_membership_expiry_days', value: notificationForm.notification_membership_expiry_days },
          { key: 'notification_enabled', value: notificationForm.notification_enabled },
        ];
      } else if (category === 'system') {
        settingsToUpdate = [
          { key: 'timezone', value: systemForm.timezone },
          { key: 'currency', value: systemForm.currency },
          { key: 'date_format', value: systemForm.date_format },
        ];
      }

      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsToUpdate }),
      });

      if (response.ok) {
        alert('Settings saved successfully!');
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const saveUser = async () => {
    setSaving(true);
    try {
      const url = editingUser ? '/api/settings/users' : '/api/settings/users';
      const method = editingUser ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          editingUser
            ? {
                id: editingUser.id,
                full_name: userForm.full_name,
                phone: userForm.phone,
                role: userForm.role,
              }
            : userForm
        ),
      });

      if (response.ok) {
        alert(editingUser ? 'User updated successfully!' : 'User created successfully!');
        setShowUserForm(false);
        setEditingUser(null);
        setUserForm({
          email: '',
          password: '',
          full_name: '',
          phone: '',
          role: 'trainer',
        });
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save user');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const editUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      email: user.email,
      password: '', // Don't pre-fill password
      full_name: user.full_name || '',
      phone: user.phone || '',
      role: user.role,
    });
    setShowUserForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const tabs = [
    { id: 'gym', label: 'Gym Information', icon: Building2 },
    { id: 'email', label: 'Email Settings', icon: Mail },
    { id: 'notification', label: 'Notifications', icon: Bell },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'system', label: 'System', icon: Settings },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">Settings</h1>
            <p className="text-gray-400 text-lg">Manage system configuration</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl p-6">
        {/* Gym Information */}
        {activeTab === 'gym' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Gym Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Gym Name</label>
                <input
                  type="text"
                  value={gymForm.gym_name}
                  onChange={(e) => setGymForm({ ...gymForm, gym_name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                <input
                  type="text"
                  value={gymForm.gym_phone}
                  onChange={(e) => setGymForm({ ...gymForm, gym_phone: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                <textarea
                  value={gymForm.gym_address}
                  onChange={(e) => setGymForm({ ...gymForm, gym_address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={gymForm.gym_email}
                  onChange={(e) => setGymForm({ ...gymForm, gym_email: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                <input
                  type="url"
                  value={gymForm.gym_website}
                  onChange={(e) => setGymForm({ ...gymForm, gym_website: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
            </div>
            <button
              onClick={() => saveSettings('gym')}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        )}

        {/* Email Settings */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Email Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">From Address</label>
                <input
                  type="text"
                  value={emailForm.email_from}
                  onChange={(e) => setEmailForm({ ...emailForm, email_from: e.target.value })}
                  placeholder="KR Fitness <no-reply@domain.com>"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
                <p className="text-xs text-gray-500 mt-1">Format: Display Name &lt;email@domain.com&gt;</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Trainer Name (Email Signature)</label>
                <input
                  type="text"
                  value={emailForm.email_trainer_name}
                  onChange={(e) => setEmailForm({ ...emailForm, email_trainer_name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone (Email Signature)</label>
                <input
                  type="text"
                  value={emailForm.email_signature_phone}
                  onChange={(e) => setEmailForm({ ...emailForm, email_signature_phone: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
            </div>
            <button
              onClick={() => saveSettings('email')}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notification' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Notification Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Appointment Reminder (hours before)</label>
                <input
                  type="number"
                  value={notificationForm.notification_appointment_reminder_hours}
                  onChange={(e) => setNotificationForm({ ...notificationForm, notification_appointment_reminder_hours: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Payment Reminder (days before)</label>
                <input
                  type="number"
                  value={notificationForm.notification_payment_reminder_days}
                  onChange={(e) => setNotificationForm({ ...notificationForm, notification_payment_reminder_days: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Membership Expiry Reminder (days before)</label>
                <input
                  type="number"
                  value={notificationForm.notification_membership_expiry_days}
                  onChange={(e) => setNotificationForm({ ...notificationForm, notification_membership_expiry_days: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={notificationForm.notification_enabled === 'true'}
                    onChange={(e) => setNotificationForm({ ...notificationForm, notification_enabled: e.target.checked ? 'true' : 'false' })}
                    className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-300">Enable Automated Notifications</span>
                </label>
              </div>
            </div>
            <button
              onClick={() => saveSettings('notification')}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        )}

        {/* User Management */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">User Management</h2>
              <button
                onClick={() => {
                  setEditingUser(null);
                  setUserForm({
                    email: '',
                    password: '',
                    full_name: '',
                    phone: '',
                    role: 'trainer',
                  });
                  setShowUserForm(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
              >
                Add User
              </button>
            </div>

            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-white">{user.full_name || user.email}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded ${user.role === 'admin' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`}>
                        {user.role}
                      </span>
                      {user.phone && <span className="text-xs text-gray-500">{user.phone}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => editUser(user)}
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all text-sm"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>

            {/* User Form Modal */}
            {showUserForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-6 max-w-md w-full">
                  <h3 className="text-xl font-bold text-white mb-6">
                    {editingUser ? 'Edit User' : 'Add New User'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        disabled={!!editingUser}
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white disabled:opacity-50"
                      />
                    </div>
                    {!editingUser && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                          type="password"
                          value={userForm.password}
                          onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={userForm.full_name}
                        onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                      <input
                        type="text"
                        value={userForm.phone}
                        onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                      <select
                        value={userForm.role}
                        onChange={(e) => setUserForm({ ...userForm, role: e.target.value as 'admin' | 'trainer' })}
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                      >
                        <option value="trainer">Trainer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={saveUser}
                      disabled={saving}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setShowUserForm(false);
                        setEditingUser(null);
                      }}
                      className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* System Settings */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">System Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                <select
                  value={systemForm.timezone}
                  onChange={(e) => setSystemForm({ ...systemForm, timezone: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                <select
                  value={systemForm.currency}
                  onChange={(e) => setSystemForm({ ...systemForm, currency: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date Format</label>
                <select
                  value={systemForm.date_format}
                  onChange={(e) => setSystemForm({ ...systemForm, date_format: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => saveSettings('system')}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}



