import React from 'react'
import CustomInput from '../components/CustomInput'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
const { Dragger } = Upload;
const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

const AddProduct = () => {
  const [desc, setDesc] = useState()
  const handleDesc = (e) =>{
      setDesc(e)
  }
  return (
    <div>
        <h3 className='mb-4 title'>Thêm sản phẩm</h3>
        <div>
            <form action="">
                <CustomInput 
                type="text" label="Enter Product Title"
                ></CustomInput>
                <div className='mb-3'>
                <ReactQuill theme="snow" value={desc} onChange={(evt) =>{
                        handleDesc(evt)
                    }} />
                </div>

                  <CustomInput 
                type="text" label="Enter Price"
                ></CustomInput>

                    <select name='' id='' className='form-control py-3 mb-3'>
                    <option value="">
                    Chọn thương hiệu
                    </option>
                    </select>

                <select name='' id='' className='form-control py-3 mb-3'>
                    <option value="">
                    Chọn danh mục
                    </option>
                    </select>

                    <select name='' id='' className='form-control py-3 mb-3'>
                    <option value="">
                    Chọn màu
                    </option>
                    </select>

                    <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                <InboxOutlined />
                </p>
                <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                <p className="ant-upload-hint">
                Hỗ trợ tải lên một lần hoặc hàng loạt. Nghiêm cấm tải lên dữ liệu của công ty hoặc các tệp bị cấm khác.
                </p>
            </Dragger>
                    
                <button className='btn btn-success border-0 roundned-3 my-5' type='submit'>Thêm sản phẩm</button>
            </form>
        </div>
    </div>
  )
}

export default AddProduct