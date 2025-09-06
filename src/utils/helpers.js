export const truncateText = (txt, max) =>
  txt.length <= max ? txt : txt.slice(0, max) + '...';

export const formatSessionDate = (date) => {
  const now = new Date();
  const diffHours = (now - date) / (1000 * 60 * 60);
  return diffHours < 24
    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

