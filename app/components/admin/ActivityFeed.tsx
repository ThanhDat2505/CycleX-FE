import React from 'react';
import { UserPlus, ShoppingCart, RefreshCcw, Bell } from 'lucide-react';
import { RecentActivity } from '../../types/adminDashboard';

interface ActivityFeedProps {
    activities: RecentActivity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
    const getIcon = (type: string) => {
        switch (type) {
            case 'USER_REGISTER': return <UserPlus size={18} className="text-blue-600" />;
            case 'ORDER_CREATE': return <ShoppingCart size={18} className="text-purple-600" />;
            case 'DATA_UPDATE': return <RefreshCcw size={18} className="text-amber-600" />;
            default: return <Bell size={18} className="text-gray-600" />;
        }
    };

    const getBgColor = (type: string) => {
        switch (type) {
            case 'USER_REGISTER': return 'bg-blue-50';
            case 'ORDER_CREATE': return 'bg-purple-50';
            case 'DATA_UPDATE': return 'bg-amber-50';
            default: return 'bg-gray-50';
        }
    };

    const formatTimestamp = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + date.toLocaleDateString();
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-6">
                {activities.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No recent activities found.</p>
                ) : (
                    activities.map((activity, index) => (
                        <div key={activity.id} className="flex group">
                            <div className="relative flex flex-col items-center mr-4">
                                <div className={`z-10 p-2.5 rounded-full ${getBgColor(activity.type)} transition-transform group-hover:scale-110`}>
                                    {getIcon(activity.type)}
                                </div>
                                {index !== activities.length - 1 && (
                                    <div className="w-0.5 bg-gray-100 h-full absolute top-10"></div>
                                )}
                            </div>
                            <div className="pb-6">
                                <p className="text-sm font-semibold text-gray-900">{activity.description}</p>
                                <p className="text-xs text-gray-500 mt-1">{formatTimestamp(activity.timestamp)}</p>
                                {activity.user && (
                                    <p className="text-xs font-medium text-blue-600 mt-1">by {activity.user}</p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <button className="w-full mt-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                View All Activities
            </button>
        </div>
    );
};

export default ActivityFeed;
