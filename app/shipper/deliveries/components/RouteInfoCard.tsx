'use client';

import { MESSAGES } from '@/app/constants/messages';
import { Phone, MapPin } from 'lucide-react';

interface ContactInfo {
    name: string;
    phone: string;
    address: string;
}

interface RouteInfoCardProps {
    sender: ContactInfo;
    receiver: ContactInfo;
}

/** Contact point display (pickup or dropoff) */
function ContactPoint({ contact, label, dotColor, borderColor }: {
    contact: ContactInfo;
    label: string;
    dotColor: string;
    borderColor: string;
}) {
    return (
        <div className="p-6 relative z-10">
            <div className="flex gap-4">
                <div className="mt-1">
                    <div className={`w-4 h-4 rounded-full ${dotColor} border-4 ${borderColor} shadow-sm`} />
                </div>
                <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
                    <h4 className="text-base font-semibold text-gray-900">{contact.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{contact.address}</p>
                    <div className="flex items-center gap-3 mt-3">
                        <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full transition-colors">
                            <Phone className="w-3.5 h-3.5" />
                            {MESSAGES.S62_BTN_CALL}
                        </a>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-1.5 rounded-full transition-colors"
                        >
                            <MapPin className="w-3.5 h-3.5" />
                            {MESSAGES.S62_BTN_MAP}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

/** Route card showing sender→receiver with visual connector */
export function RouteInfoCard({ sender, receiver }: RouteInfoCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
            {/* Visual Connector Line */}
            <div className="absolute left-[2.25rem] top-12 bottom-12 w-0.5 bg-gray-200 z-0" />

            <ContactPoint
                contact={sender}
                label={MESSAGES.S62_PICKUP_LABEL}
                dotColor="bg-blue-500"
                borderColor="border-blue-100"
            />

            <div className="border-t border-gray-100 mx-6" />

            <ContactPoint
                contact={receiver}
                label={MESSAGES.S62_DROPOFF_LABEL}
                dotColor="bg-orange-500"
                borderColor="border-orange-100"
            />
        </div>
    );
}
