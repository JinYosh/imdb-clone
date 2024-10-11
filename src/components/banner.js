import avatar from "./Avatar.jpg"
function Banner(){
    return (
        <div className="h-[20vh] md:h-[60vh] bg-cover flex items-end" style = {{backgroundImage: "url("+ avatar +")"}}>
            <div className="text-xl md:text-3xl bg-gray-900 bg-opacity-60 p-4 text-white w-full align-middle ">Avatar : The way of water</div>
        </div>
        
    );
}

export default Banner;