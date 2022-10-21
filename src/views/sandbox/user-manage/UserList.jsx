import { Button, Form, Input, Modal, Select, Switch, Table } from 'antd'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import UserForm from '../../../components/user-manage/UserForm'


export default function UserList() {

  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      key: "region",
      render: (item) => {
        return (
          <b>{item ? item : "全球"}</b>
        )
      }
    },
    {
      title: "角色名称",
      dataIndex: "role",
      render: (role) => {
        // console.log("role==", role);
        return (
          role.roleName
        )
      }
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "用户状态",
      // dataIndex: "roleState",
      render: (item) => {
        return (
          <Switch checked={item.roleState} disabled={item.default}
            onChange={() => handleOnChange_SwitchState(item)
            } />
        )
      }
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button danger disabled={item.default} onClick={() => { handleDeleteUser(item) }}> 删除</Button >
            <Button type="primary" disabled={item.default} onClick={() => {
              handleEditUser(item)
            }}>编辑</Button>
          </div >
        )
      }
    }
  ]

  const [usersData, setUsersData] = useState([])
  const [regionsData, setRegionsData] = useState([])
  const [rolesData, setRolesData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const refAddForm = useRef(null)
  const [userFormAction, setUserFormAction] = useState("")

  const loadUsersData = () => {
    const target = `http://localhost:5001/users?_expand=role`
    axios.get(target).then(
      (resp) => {
        setUsersData(resp.data)
      }
    )
  }

  const loadRegions = () => {
    const target = `http://localhost:5001/regions`
    axios.get(target).then(
      (resp) => {
        setRegionsData(resp.data)
      }
    )
  }

  const loadRolesData = () => {
    const target = `http://localhost:5001/roles`
    axios.get(target).then(
      (resp) => {
        setRolesData(resp.data)
      }
    )
  }


  useEffect(() => {
    loadUsersData()
    loadRegions()
    loadRolesData()
  }, [])


  const handleOnChange_SwitchState = (item) => {
    // console.log("item===>", item);
    const target = `http://localhost:5001/users/${item.id}`
    axios.patch(target, {
      roleState: !item.roleState
    }).then(
      () => {
        loadUsersData()
      }
    )
  }
  const handleOnClick_AddUser = () => {
    setUserFormAction("AddUser")
    setIsModalOpen(true)
  }
  const handleOnCancel_Modal = () => {
    setIsModalOpen(false)
    setUserFormAction("")
  }

  const handleOnOk_Modal = () => {
    setIsModalOpen(false)
    setUserFormAction("")
    // console.log("add==>", refAddForm);

    refAddForm.current.validateFields().then(
      (value) => {
        // console.log(value);

        switch (setUserFormAction) {
          case "AddUser":
            // create user
            const target = `http://localhost:5001/users`
            axios.post(target, {
              ...value,
              roleState: true,
              default: false
            }).then(
              () => {
                loadUsersData()
              }
            )
          // case "EditUser":
          //   // create user
          //   const target2 = `http://localhost:5001/users`
          //   axios.patch(target2, {
          //     ...value,
          //     roleState: true,
          //     default: false
          //   }).then(
          //     () => {
          //       loadUsersData()
          //     }
          //   )
        }

      }
    ).catch(
      (err) => {
        console.log(err);
      }
    )
  }

  const handleDeleteUser = (item) => {
    // console.log(item);
    const target = `http://localhost:5001/users/${item.id}`
    axios.delete(target).then(() => {
      loadUsersData()
    })
  }

  const handleEditUser = (item) => {



    // setTimeout(() => {
    //   setUserFormAction("EditUser")
    //   setIsModalOpen(true)
    //   console.log("===>", item);

    //   console.log(refAddForm.current);
    //   // refAddForm.current.setFieldsValue({
    //   //   item
    //   // })
    // }, 0)
    setTimeout(

      () => {
        setIsModalOpen(true)
        // console.log(refAddForm.current);
        console.log(item);

        refAddForm.current.setFieldsValue(
          { ...item }
        )
      }
      , 0)
  }

  return (
    <div>
      <Button type="primary" onClick={handleOnClick_AddUser}>添加用户</Button>
      <Table rowKey="id" dataSource={usersData} columns={columns}
        pagination={{ pageSize: 5 }} />

      <Modal open={isModalOpen}
        onCancel={handleOnCancel_Modal}
        onOk={handleOnOk_Modal}
      >
        <UserForm regionsData={regionsData}
          rolesData={rolesData}
          ref={refAddForm} />
      </Modal>
    </div>
  )
}

