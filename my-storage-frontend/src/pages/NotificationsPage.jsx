import { Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import NotificationsList from "../components/Notifications/NotificationsList";
import SearchBar from "../components/SearchBar";
import { PageRoot } from "../components/StyledComponents";
import { useNotification } from "../context/NotificationContext";


const NotificationsPage = () => {
    const [filter, setFilter] = React.useState(null);
    const [tab, setTab] = React.useState(0);
    const [notifications, setNotifications] = useNotification();

    return (
        <PageRoot>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <SearchBar onChange={setFilter} />
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={(e, v) => setTab(v)} >
                    <Tab label="Invites"  />
                    <Tab label="Requests"  />
                </Tabs>
            </Box>

            <NotificationsList filter={filter} type={tab === 0 ? "invites" : "requests"} setData={setNotifications} items={notifications}/>
        </PageRoot>
    );
}

export default NotificationsPage;