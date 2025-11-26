'use client';

export default function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="mt-4 text-center text-gray-600 font-medium">Loading...</div>
            </div>
        </div>
    );
}
