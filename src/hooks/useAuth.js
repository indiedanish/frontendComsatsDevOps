import { useContext } from "react";

import ThemeContext from '../contexts/themeContext';

const useAuth = () => {


    const { auth, setAuth } = useContext(ThemeContext);
    return { auth, setAuth };
}

export default useAuth;


	