//Remove this file

import useAuth from "../context/AuthContext";
import { SampleNavBar } from "../layouts/SampleNavBar";

//keep screen components like login, tasks etc in this folder

// you may use layout,components inside screen

const LoginScreen = () => {
  return (
    <div>
      login page is done
      <SampleNavBar />
    </div>
  );
};

export default LoginScreen;
