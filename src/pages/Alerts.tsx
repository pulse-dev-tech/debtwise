import React, { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { storage } from '../utils/storage';
import { Alert } from '../types';

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const savedAlerts = storage.getAlerts();
    setAlerts(savedAlerts);
  }, []);

  const handleMarkAsRead = (id: string) => {
    const updatedAlerts = alerts.map(alert =>
      alert.id === id ? { ...alert, isRead: true } : alert
    );
    setAlerts(updatedAlerts);
    storage.setAlerts(updatedAlerts);
  };

  const handleDismiss = (id: string) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== id);
    setAlerts(updatedAlerts);
    storage.setAlerts(updatedAlerts);
  };

  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  const readAlerts = alerts.filter(alert => alert.isRead);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold">Alerts</h1>
        </div>
        <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
          {unreadAlerts.length} unread
        </span>
      </div>

      {/* Unread Alerts */}
      {unreadAlerts.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Unread Alerts</h2>
          <div className="space-y-4">
            {unreadAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg"
              >
                <div>
                  <p className="font-medium">{alert.message}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(alert.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleMarkAsRead(alert.id)}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-full"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Read Alerts */}
      {readAlerts.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Previous Alerts</h2>
          <div className="space-y-4">
            {readAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="text-gray-600 dark:text-gray-300">{alert.message}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(alert.date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDismiss(alert.id)}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {alerts.length === 0 && (
        <div className="card text-center py-12">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Alerts</h2>
          <p className="text-gray-600 dark:text-gray-400">
            You're all caught up! New alerts will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Alerts;