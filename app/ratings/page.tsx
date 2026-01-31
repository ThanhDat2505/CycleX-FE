// app/ratings/page.tsx
"use client";

import React from "react";

// Mock data outside component to avoid impure function calls during render
const getMockRatings = () => {
  const oneDayAgo = new Date(Date.now() - 86400000).toISOString();
  const threeDaysAgo = new Date(Date.now() - 86400000 * 3).toISOString();
  const fiveDaysAgo = new Date(Date.now() - 86400000 * 5).toISOString();
  const sevenDaysAgo = new Date(Date.now() - 86400000 * 7).toISOString();
  const tenDaysAgo = new Date(Date.now() - 86400000 * 10).toISOString();
  const twelveDaysAgo = new Date(Date.now() - 86400000 * 12).toISOString();
  const fourteenDaysAgo = new Date(Date.now() - 86400000 * 14).toISOString();
  const sixteenDaysAgo = new Date(Date.now() - 86400000 * 16).toISOString();

  return [
    {
      id: 1,
      stars: 5,
      review: "Excellent condition! Very happy with this purchase.",
      createdDate: oneDayAgo,
    },
    {
      id: 2,
      stars: 5,
      review: "Seller was very responsive. Bike is as described.",
      createdDate: threeDaysAgo,
    },
    {
      id: 3,
      stars: 4,
      review: "Good bike, minor scratches but not noticeable.",
      createdDate: fiveDaysAgo,
    },
    {
      id: 4,
      stars: 5,
      review: "Perfect transaction. Highly recommended!",
      createdDate: sevenDaysAgo,
    },
    {
      id: 5,
      stars: 5,
      review: "Very well maintained bike. Great price!",
      createdDate: tenDaysAgo,
    },
    {
      id: 6,
      stars: 4,
      review: "Good condition. Shipping was fast.",
      createdDate: twelveDaysAgo,
    },
    {
      id: 7,
      stars: 5,
      review: "Exactly what I was looking for!",
      createdDate: fourteenDaysAgo,
    },
    {
      id: 8,
      stars: 5,
      review: "Outstanding seller. Will buy again.",
      createdDate: sixteenDaysAgo,
    },
  ];
};

const RatingsPage: React.FC = () => {
  // Get mock data
  const userRatings = getMockRatings();

  const avgRating = (
    userRatings.reduce((sum, r) => sum + r.stars, 0) / userRatings.length
  ).toFixed(1);

  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: userRatings.filter((r) => r.stars === stars).length,
  }));

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Ratings & Reviews
      </h1>
      <p className="text-gray-600 mb-8">
        Your seller reputation and customer feedback
      </p>

      {/* Overall Rating */}
      <div className="bg-white rounded-lg p-8 border border-gray-200 mb-8 text-center">
        <p className="text-gray-600 text-sm font-semibold mb-2">
          OVERALL RATING
        </p>
        <p className="text-6xl font-bold text-gray-900 mb-2">{avgRating}</p>
        <div className="flex justify-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-2xl">
              {i < Math.round(parseFloat(avgRating)) ? "⭐" : "☆"}
            </span>
          ))}
        </div>
        <p className="text-gray-600">From {userRatings.length} reviews</p>
      </div>

      {/* Rating Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Rating Breakdown
          </h2>
          {ratingBreakdown.map(({ stars, count }) => {
            const percentage = (count / userRatings.length) * 100;
            return (
              <div key={stars} className="flex items-center gap-4 mb-4">
                <div className="flex gap-1">
                  {[...Array(stars)].map((_, i) => (
                    <span key={i} className="text-lg">
                      ⭐
                    </span>
                  ))}
                </div>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF8A00]"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="font-semibold text-gray-900 w-8 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Statistics</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {userRatings.length}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Positive (4-5 ⭐)</p>
              <p className="text-2xl font-bold text-green-600">
                {userRatings.filter((r) => r.stars >= 4).length}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Neutral (3 ⭐)</p>
              <p className="text-2xl font-bold text-yellow-600">
                {userRatings.filter((r) => r.stars === 3).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Reviews</h2>
        </div>

        <div className="divide-y divide-gray-100">
          {userRatings.slice(0, 10).map((rating) => (
            <div key={rating.id} className="p-6 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex gap-1">
                  {[...Array(rating.stars)].map((_, i) => (
                    <span key={i} className="text-lg">
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(rating.createdDate).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{rating.review}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingsPage;
