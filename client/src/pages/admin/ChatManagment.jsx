import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/shared/Table'
import { Avatar } from '@mui/material'
import { dashboardData } from '../../components/constants/SampleData'
import { transformImage } from '../../lib/Features'

const ChatManagment = () => {
  const columns = [
    {
      field: "id",
      headerClassName: "table-header",
      minWidth: 200,
      headerName: "id",
    },
    {
      field: "attachments",
      headerClassName: "table-header",
      minWidth: 150,
      headerName: "attachments",
      renderCell: (params) => <Avatar alt={params.row.name} src={params.row.avatar} />
    },
    {
      field: "content",
      headerClassName: "table-header",
      minWidth: 400,
      headerName: "content",
    },
    {
      field: "sender",
      headerClassName: "table-header",
      minWidth: 150,
      headerName: "sent by",
      renderCell: (params) => <div>
        <Avatar alt={params.row.sender?.name} src={params.row.sender?.avatar} />
        <span>{params.row.sender?.name}</span>
      </div>
    },,
    {
      field: "friends",
      headerClassName: "table-header",
      minWidth: 150,
      headerName: "friends",
    },
    {
      field: "groupChat",
      headerClassName: "table-header",
      minWidth: 150,
      headerName: "Group Chat",
    },
    {
      field: "Created At",
      headerClassName: "table-header",
      minWidth: 250,
      headerName: "Created At",
    }
  ]
  const [rows, setRows] = useState([])
  useEffect(() => {
    // setRows(dashboardData.users.map((user) =>
    //   ({ ...user, id: user._id, avatar: transformImage(user.avatar[0]) })
    // ))
  }, [])
  return (
    <AdminLayout>
      <Table heading={"All Users"} columns={columns} rows={rows} />
    </AdminLayout>
  )
}

export default ChatManagment