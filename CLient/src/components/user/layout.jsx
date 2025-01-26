import { Outlet } from "react-router-dom";

function UserLayout(){
    return(
        <div className="flex flex-column bg-white overflow-hidden ">
            <main className="flex flex-col w-full">
                <Outlet />
            </main>
        </div>
        
    )
}
export default UserLayout;