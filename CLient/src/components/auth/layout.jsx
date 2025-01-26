import { Outlet } from 'react-router-dom';

function AuthLayout() {
    return (
        <div className="flex min-h-[calc(100vh-80px)] w-full">
            <div className="flex flex-1 items-center justify-center bg-white px-4 py-8">
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;