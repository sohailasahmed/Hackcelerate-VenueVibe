export const SubscriptionButton = ({ userTier }) => {
  return (
    <div className="fixed bottom-4 right-4">
      {userTier === 'basic' ? (
        <a 
          href="/subscriptions"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          Upgrade to Pro
        </a>
      ) : (
        <div className="text-green-600 font-bold">PRO USER</div>
      )}
    </div>
  );
};