import React, {createContext} from "react";
import { ThemeProvider as  MuiThemeProvider, createTheme } from "@mui/material/styles";
import { blueGrey, grey, indigo } from "@mui/material/colors";

const Context = createContext({});

const ThemeProvider = ({ children })=>{
    const [themeMode, setThemeMode] = React.useState(
        localStorage.getItem('theme') || "light"
    );
    
    const theme = React.useMemo(()=>{
        switch(themeMode){
            case 'dark': 
                localStorage.setItem('theme', 'dark');
                return createTheme({
                    palette: {
                        mode: "dark",
                        primary:{
                            main: blueGrey[700],
                            dark: blueGrey[800],
                            light: blueGrey[600]
                        },
                        background:{
                            default: grey[900],
                            paper: grey[800],
                            "900": grey[700],
                            "800": grey[600],
                            "700": grey[500],
                            "600": grey[400],
                        }
                    },
                });
            default: 
                localStorage.setItem('theme', 'light');
                return createTheme({
                    palette: {
                        mode: "light",
                        primary:{
                            main: indigo[200],
                            dark: indigo[300],
                            light: indigo[100]
                        },
                        background:{
                            default: grey[200],
                            paper: grey[50],
                            "900": grey[100],
                            "800": grey[300],
                            "700": grey[400],
                            "600": grey[500],
                        }
                    },
                });
        }
    }, [themeMode]);


    
    return (
        <MuiThemeProvider theme={theme}>
            <Context.Provider value={[themeMode, setThemeMode]}>
                {children}
            </Context.Provider>
        </MuiThemeProvider>
    );
}

export default ThemeProvider;

export function useThemeMode () { return React.useContext(Context)};
