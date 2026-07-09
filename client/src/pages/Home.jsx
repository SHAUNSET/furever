import { useContext } from "react";
import { userDataContext } from "../context/UserContext";

function Home() {
  const { userData } = useContext(userDataContext);

  console.log(userData);

  return (
    <div>
       
    </div>
  );
}

export default Home;