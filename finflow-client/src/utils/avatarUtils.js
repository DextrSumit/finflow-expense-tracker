export const AVATAR_OPTIONS = [
  { id: 'bear',      emoji: '🐻', bg: '#FF9800' },
  { id: 'fox',       emoji: '🦊', bg: '#FF5722' },
  { id: 'cat',       emoji: '🐱', bg: '#9C27B0' },
  { id: 'dog',       emoji: '🐶', bg: '#2196F3' },
  { id: 'panda',     emoji: '🐼', bg: '#607D8B' },
  { id: 'tiger',     emoji: '🐯', bg: '#FF9800' },
  { id: 'lion',      emoji: '🦁', bg: '#FFC107' },
  { id: 'monkey',    emoji: '🐵', bg: '#795548' },
  { id: 'penguin',   emoji: '🐧', bg: '#00BCD4' },
  { id: 'koala',     emoji: '🐨', bg: '#9E9E9E' },
  { id: 'frog',      emoji: '🐸', bg: '#4CAF50' },
  { id: 'rabbit',    emoji: '🐰', bg: '#E91E63' },
  { id: 'owl',       emoji: '🦉', bg: '#3F51B5' },
  { id: 'dragon',    emoji: '🐲', bg: '#F44336' },
  { id: 'unicorn',   emoji: '🦄', bg: '#E91E63' },
  { id: 'robot',     emoji: '🤖', bg: '#455A64' },
  { id: 'alien',     emoji: '👽', bg: '#4CAF50' },
  { id: 'ninja',     emoji: '🥷', bg: '#212121' },
  { id: 'wizard',    emoji: '🧙', bg: '#7B1FA2' },
  { id: 'astronaut', emoji: '👨‍🚀', bg: '#1565C0' },
];

export function getAvatar(avatarId) {
  return AVATAR_OPTIONS.find(a => a.id === avatarId) || null;
}