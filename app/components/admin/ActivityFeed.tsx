import React from 'react';
import { UserPlus, ShoppingCart, RefreshCcw, Bell } from 'lucide-react';
import { RecentActivity } from '../../types/adminDashboard';

interface ActivityFeedProps {
    activities: RecentActivity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities = [] }) => {
    const safeActivities = Array.isArray(activities) ? activities : [];

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
                {safeActivities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
                        <div className="p-4 bg-gray-50 rounded-2xl mb-4 text-gray-300">
                            <Bell size={32} />
                        </div>
                        <p className="text-gray-400 font-medium">No recent activities found.</p>
                    </div>
                ) : (
                    activities.map((activity, index) => (
                        <div 
                            key={activity.id} 
                            className="flex group animate-fade-in-up"
                            style={{ animationDelay: `${(index + 2) * 150}ms` }}
                        >
                            <div className="relative flex flex-col items-center mr-4">
                                <div className={`z-10 p-2.5 rounded-2xl ${getBgColor(activity.type)} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                                    {getIcon(activity.type)}
                                </div>
                                {index !== activities.length - 1 && (
                                    <div className="w-0.5 bg-gray-100 h-full absolute top-12"></div>
                                )}
                            </div>
                            <div className="pb-8">
                                <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{activity.description}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5">{formatTimestamp(activity.timestamp)}</p>
                                {activity.user && (
                                    <div className="mt-2 flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        <p className="text-[11px] font-bold text-blue-600 tracking-tight">{activity.user}</p>
                                    </div>
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
