import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
  } from '@ant-design/icons';
import {Link} from 'react-router-dom';
  import{
    AiOutlineDashboard,
    AiOutlineShoppingCart,
    AiOutlineUser,
    AiOutlineBgColors,
  } from 'react-icons/ai'
  import {SiBrandfolder} from 'react-icons/si'
  import {BiCategory, BiBookAdd} from 'react-icons/bi'
  import {ImBlog} from 'react-icons/im'
  import {IoIosNotifications} from 'react-icons/io'
  import {BsQuestionSquare} from 'react-icons/bs'
  import {FaClipboardList, FaBloggerB, FaRegListAlt} from 'react-icons/fa'
  import { Layout, Menu, theme } from 'antd';
  import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Outlet } from 'react-router-dom';
  const { Header, Sider, Content } = Layout;


const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
      token: { colorBgContainer },
    } = theme.useToken();
    const navigate = useNavigate()
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
            <h2 className='text-white fs-5 text-center py-3 mb-5'>
               <span className='sm-logo'>Eshop</span>
               <span className='lg-logo'>Admin Eshop</span>
                </h2></div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['']}
          onClick={({key}) =>{
            if(key === 'signout'){

            }else{
                navigate(key)
            }
          }}
          items={[
            {
              key: '',
              icon: <AiOutlineDashboard className='fs-4'/>,
              label: 'Bảng điều khuyển',
            },
            {
              key: 'customers',
              icon: <AiOutlineUser className='fs-4'/>,
              label: 'Khách hàng',
            },
            {
              key: 'catalog',
              icon: <AiOutlineShoppingCart className='fs-4'/>,
              label: 'Danh mục',
              children: [
                {
                    key: 'product',
                    icon: <AiOutlineShoppingCart className='fs-4'/>,
                    label: 'Thêm sản phẩm',
                },
                {
                    key: 'list-product',
                    icon: <AiOutlineShoppingCart className='fs-4'/>,
                    label: 'Danh sách sản phẩm',
                },
                {
                    key: 'brand',
                    icon: <SiBrandfolder className='fs-4'/>,
                    label: 'Thương hiệu',
                },
                {
                    key: 'list-brand  ',
                    icon: <SiBrandfolder className='fs-4'/>,
                    label: 'Danh sách thương hiệu',
                },
                {
                    key: 'category',
                    icon: <BiCategory className='fs-4'/>,
                    label: 'Loại sản phẩm',
                },
                {
                    key: 'list-category',
                    icon: <BiCategory className='fs-4'/>,
                    label: 'Danh sách loại sản phẩm',
                },
                {
                    key: 'color',
                    icon: <AiOutlineBgColors className='fs-4'/>,
                    label: 'Màu',
                },
                {
                    key: 'list-color',
                    icon: <AiOutlineBgColors className='fs-4'/>,
                    label: 'Danh sách màu',
                },
              ]
            },
            {
                key: 'orders',
                icon: <FaClipboardList className='fs-4'/>,
                label: 'Orders',
              },
            {
                key: 'blogs',
                icon: <FaBloggerB className='fs-4'/>,
                label: 'Blogs',
                children:[
                    {
                      key: 'blog',
                      icon: <BiBookAdd className='fs-4'/>,
                      label: 'Thêm Blogs',
                  },
                    {
                        key: 'list-blogs',
                        icon: <FaBloggerB className='fs-4'/>,
                        label: 'Danh sách Blogs',
                    },
                    {
                        key: 'blogs-category',
                        icon: <ImBlog className='fs-4'/>,
                        label: 'Thêm danh mục Blogs',
                    },
                    {
                        key: 'blogs-category-list',
                        icon: <FaRegListAlt className='fs-4'/>,
                        label: 'Danh sách danh mục Blogs',
                    },
                ]
              },
              {
                key: 'enquiries',
                icon: <BsQuestionSquare className='fs-4'/>,
                label: 'Thắc mắc',
              }, 
            
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
        className='d-flex justify-content-between ps-3 pe-5'
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
          <div className='d-flex gap-4 align-items-center'>
            <div className='position-relative'>
                <IoIosNotifications className='fs-4'/>
                <span className='badge bg-warning rounded-circle p-1 position-absolute'>3</span>
                </div>
            <div className='d-flex gap-3 align-items-center dropdown'>
                <div>
                    <img 
                    width={32}
                    height={32}
                    src='https://i0.wp.com/vssmn.org/wp-content/uploads/2018/12/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png?fit=860%2C681&ssl=1&w=640' alt='' />
                </div>
                <div role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                    <h5 className='mb-0'>NavDeep</h5>
                    <p className='mb-0'>example@gmail.com</p>
                </div>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">

                <li><Link className="dropdown-item py-1 mb-1" style={{height: "auto", lineHeight: "20px"}} to="/">Hồ sơ</Link></li>
                <li><Link className="dropdown-item py-1 mb-1" style={{height: "auto", lineHeight: "20px"}} to="/ ">Đăng xuất</Link></li>
                {/* <li><Link className="dropdown-item py-1 mb-1" style={{height: "auto", lineHeight: "20px"}} to="/">Something else here</Link></li> */}
                </div>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout