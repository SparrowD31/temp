import Home from "./Home";

function ShoppingLayout(){
    return(
        <div className="flex flex-col bg-white overflow-hidden">
            <Home/>
            <main className=""flex flex-col w-full>
                <Outlet/>
            </main>

        </div>
    )

}