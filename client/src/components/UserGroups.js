import React, { useState, useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import ConfirmationModal from './ConfirmationModal';

function UserGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  // Fetch User Groups
  const fetchGroups = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('googleToken'));
      if (!userInfo || !userInfo.email) {
        setError('No user logged in.');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/groups/email/${userInfo.email}`);
      if (!response.ok) {
        throw new Error('Failed to fetch groups.');
      }

      const data = await response.json();
      setGroups(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Group Function
  const handleDeleteGroup = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/groups/${groupId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        setConfirmDelete(null); // Close confirmation popup
        throw new Error('Failed to delete group.');
      }

      // Remove deleted group from UI
      setGroups(groups.filter(group => group.group_id !== groupId));
      setConfirmDelete(null); // Close confirmation popup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card bg-white shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-blue-800">Your Groups</h2>

      {loading && <p className="text-gray-500">Loading groups...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {groups.length === 0 && !loading ? (
        <p className="text-gray-500">You are not in any groups.</p>
      ) : (
        <ul className="list-disc list-inside">
          {groups.map((group) => (
            <li key={group.group_id} className="flex justify-between items-center p-2 bg-gray-100 rounded mb-2">
              <span>{group.group_name}</span>
              <button 
                className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
                onClick={() => setConfirmDelete(group.group_id)}
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Delete Confirmation Popup */}
      <ConfirmationModal
        isOpen={confirmDelete}
        title="⚠️ Confirm Deletion"
        message="Are you sure you want to delete this group? All receipts and payments asscoiated with this group will be deleted (for all members). This action cannot be undone."
        onConfirm={() => handleDeleteGroup(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
        cancelText="No, Cancel"
        successText="Yes, Delete"
      />
    </div>
  );
}

export default UserGroups;
