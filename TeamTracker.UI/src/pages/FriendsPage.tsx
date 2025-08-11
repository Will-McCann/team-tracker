import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFriends, addFriend, getFriendTeams, removeFriend } from '../services/api';
import type { Team } from '../types/team';
import TeamList from '../components/TeamList';

interface Friend {
  id: number;
  username: string;
}

export default function FriendsPage() {
  const navigate = useNavigate();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [friendTeams, setFriendTeams] = useState<Team[]>([]);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchFriends = async () => {
    try {
      const data = await getFriends() as { friends: Friend[] };
      setFriends(data.friends);
      if (selectedFriend && !data.friends.find(f => f.id === selectedFriend.id)) {
        setSelectedFriend(null);
        setFriendTeams([]);
      }
    } catch (error) {
      console.error('Failed to fetch friends', error);
    }
  };

  const handleAddFriend = async () => {
    const username = prompt('Enter the username of the friend to add:');
    if (!username) return;
    try {
      await addFriend(username);
      fetchFriends();
    } catch (error) {
      alert('Failed to add friend. Make sure username is entered correctly.');
      console.error('Failed to add friend', error);
    }
  };

  const handleRemoveFriend = async () => {
    if (!selectedFriend) return;
    const confirm = window.confirm(`Are you sure you want to remove ${selectedFriend.username} as a friend?`);
    if (!confirm) return;

    try {
      setLoadingRemove(true);
      await removeFriend(selectedFriend.username);
      await fetchFriends();
    } catch (error) {
      console.error('Failed to remove friend', error);
    } finally {
      setLoadingRemove(false);
    }
  };

  const handleSelectFriend = async (friend: Friend) => {
    if (selectedFriend?.id === friend.id) {
      setSelectedFriend(null);
      setFriendTeams([]);
    } else {
      setSelectedFriend(friend);
      try {
        const teams = await getFriendTeams(friend.id);
        setFriendTeams(teams);
      } catch (error) {
        console.error('Failed to fetch friend teams', error);
        setFriendTeams([]);
      }
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  // Filtered friends list
  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/home')}
        className="mb-4 text-blue-600 hover:underline"
      >
        &larr; Back to Home
      </button>

      <h2 className="text-3xl font-semibold text-center mb-6">Your Friends</h2>

      {/* Add + Remove buttons on left, Search on right */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <div className="flex gap-3">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={handleAddFriend}
          >
            Add Friend
          </button>

          <button
            disabled={!selectedFriend || loadingRemove}
            onClick={handleRemoveFriend}
            className={`px-4 py-2 rounded-lg transition
              ${!selectedFriend || loadingRemove
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'}
            `}
          >
            {loadingRemove ? 'Removing...' : 'Remove Friend'}
          </button>
        </div>

        <input
          type="text"
          placeholder="Search friends..."
          className="border border-gray-300 px-4 py-2 rounded-lg w-full md:w-56"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {filteredFriends.length === 0 ? (
        <p className="text-gray-500 text-center">No friends found.</p>
      ) : (
        <ul
          className="mb-6 max-h-80 overflow-y-auto border border-gray-300 rounded-md"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#a0aec0 transparent' }}
        >
          {filteredFriends.map((friend) => (
            <li
              key={friend.id}
              className={`cursor-pointer px-4 py-2 border-b last:border-b-0 rounded-none
                ${selectedFriend?.id === friend.id
                  ? 'bg-blue-100 font-semibold text-blue-700'
                  : 'hover:bg-gray-100 text-gray-800'}
              `}
              onClick={() => handleSelectFriend(friend)}
            >
              {friend.username}
            </li>
          ))}
        </ul>
      )}

      {selectedFriend && (
        <div>
          <h3 className="text-xl font-semibold mb-3">
            {selectedFriend.username}’s Teams
          </h3>
          <TeamList teams={friendTeams} readOnly />
        </div>
      )}
    </div>
  );
}
