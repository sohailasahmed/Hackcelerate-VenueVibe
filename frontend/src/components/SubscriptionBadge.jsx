export default function SubscriptionBadge({ tier }) {
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${
      tier === 'pro' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-gray-100 text-gray-800'
    }`}>
      {tier === 'pro' ? 'PRO MEMBER' : 'BASIC'}
    </span>
  );
}