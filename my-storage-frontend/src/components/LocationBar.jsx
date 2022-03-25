import { Box } from "@mui/system";
import React from "react";
import { LinearProgress, Typography } from "@mui/material";
import HorizontalList from "./HorizontalList";
import { getFiles } from '../http/Data';
import { useNavigate } from "react-router-dom";

const LocationBar = ({ location, onLoaded, group_id = null, onLocationChanged }) => {
    const [prosessing, setProsrssing] = React.useState(false);
    const nav = useNavigate();

    React.useEffect(() => {
        if (location) {
            loadFiles(location, group_id, onLoaded, setProsrssing, nav);
        }
    }, [location, group_id, nav, onLoaded]);


    const handleClick = (index) => {
        onLocationChanged && onLocationChanged(location.split('/').slice(0, index + 1).join('/'));
    }

    return (
        <HorizontalList flex={1}>
            {prosessing && <LinearProgress sx={{ position: 'absolute', inset: "0 0 0" }} />}

            <Box sx={{ position: 'relative', display: 'flex', overflow: 'visible', justifyContent: 'flex-end', alignItems: 'flex-end', }}>
                {
                    location &&
                    location.split('/').map((e, i) => e && (
                        <React.Fragment key={i}>
                            <Typography fontSize="1rem" mr={0.5} variant="caption">/</Typography>
                            <Typography fontSize="1rem" mr={0.5} variant="caption" color="secondary"
                                sx={{ cursor: 'pointer', ":hover": { transform: 'scale(1.1)', } }}
                                onClick={() => handleClick(i)}
                            >
                                {e}
                            </Typography>
                        </React.Fragment>
                    ))
                }
            </Box>
        </HorizontalList>
    );
}


const loadFiles = async (location, group_id, onLoaded, setProsrssing, nav) => {
    setProsrssing(true);

    const res = await getFiles(location, group_id ? group_id : null);

    if (res.ok){
        const js = await res.json();
        onLoaded(js.data);
        setProsrssing(false);
        return;
    }

    nav('/error/' + res.status + '/' + res.statusText);
}

export default LocationBar;