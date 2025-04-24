export default function layout({ children }) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-300 font-sans m-0 p-0">
            {children}
        </div>
    );
}