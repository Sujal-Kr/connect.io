import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/shared/Table'
import { Avatar } from '@mui/material'
import { dashboardData } from '../../components/constants/SampleData'
import { transformImage } from '../../lib/Features'

const UserManagement = () => {
  const columns = [
    {
      field: "id",
      headerClassName: "table-header",
      minWidth: 200,
      headerName: "id",
    },
    {
      field: "avatar",
      headerClassName: "table-header",
      minWidth: 150,
      headerName: "avatar",
      renderCell: (params) => <Avatar alt={params.row.name} src={params.row.avatar} />
    },
    {
      field: "name",
      headerClassName: "table-header",
      minWidth: 200,
      headerName: "name",
    },
    {
      field: "username",
      headerClassName: "table-header",
      minWidth: 200,
      headerName: "username",
    },
    {
      field: "friends",
      headerClassName: "table-header",
      minWidth: 150,
      headerName: "friends",
    },
    {
      field: "groups",
      headerClassName: "table-header",
      minWidth: 150,
      headerName: "groups",
    },
  ]
  const [rows, setRows] = useState([])
  useEffect(() => {
    setRows(dashboardData.users.map((user) =>
      ({ ...user, id: user._id, avatar: transformImage(user.avatar[0]) })
    ))
  }, [])
  return (
    <AdminLayout>
      <Table heading={"All Users"} columns={columns} rows={rows} />
    </AdminLayout>
  )
}

export default UserManagement