import { useContext } from "react";
import { userDataContext } from "../context/UserContext";

function Home() {
  const { userData } = useContext(userDataContext);

  console.log(userData);

  return (
    <div>
      <div>Home</div>

      <div className="p-8">
        <h1>Welcome {userData?.name}</h1>
      </div>
    </div>
  );
}

export default Home;