import React from 'react'
import { Table } from 'antd';
const Productlist = () => {
    const columns = [
        {
          title: 'No.',
          dataIndex: 'key',
        },
        {
          title: 'Tên',
          dataIndex: 'name',
        },
        {
          title: 'Sản phẩm',
          dataIndex: 'product',
        },
        {
          title: 'Trạng thái',
          dataIndex: 'status',
        },
      ];
      const data1= [];
    for (let i = 0; i < 46; i++) {
      data1.push({
        key: i,
        name: `Edward King ${i}`,
        product: 32,
        status: `London, Park Lane no. ${i}`,
      });
    }
  return (
    
    <div>
        <h3 className="mb-4 title">Danh sách sản phẩm</h3>
        <div>
        <Table columns={columns} dataSource={data1} />
        </div>
    </div>
  )
}

export default Productlist