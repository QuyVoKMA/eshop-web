import React from 'react'
import CustomInput from '../components/CustomInput'

const AddBlogcat = () => {
  return (
    <div>
        <h3 className='mb-4 title'>Thêm danh mục Blog</h3>
        <div>
            <form action="">
                <CustomInput 
                type="text" label="Enter Blog Category"
                ></CustomInput>
                <button className='btn btn-success border-0 roundned-3 my-5' type='submit'>Thêm danh mục Blog</button>
            </form>
        </div>
    </div>
  )
}

export default AddBlogcat