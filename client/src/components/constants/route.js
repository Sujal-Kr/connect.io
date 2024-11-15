import { DashboardOutlined, GroupsOutlined, LogoutOutlined, ManageAccountsOutlined, MessageOutlined } from "@mui/icons-material";

export const tabs = [{
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: DashboardOutlined
},
{
    name: "Users",
    path: "/admin/users",
    icon: ManageAccountsOutlined
},
{
    name: "Chats",
    path: "/admin/chats",
    icon: GroupsOutlined
},
{
    name: "Messages",
    path: "/admin/messages",
    icon: MessageOutlined
},
{
    name:"Logout",
    path:"/",
    icon:LogoutOutlined
}
]