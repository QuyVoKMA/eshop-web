import React from 'react'
import CustomInput from '../components/CustomInput'

const AddColor = () => {
  return (
    <div>
        <h3 className='mb-4 title'>Thêm màu</h3>
        <div>
            <form action="">
                <CustomInput 
                type="color" label="Enter Color"
                ></CustomInput>
                <button className='btn btn-success border-0 roundned-3 my-5' type='submit'>Thêm màu</button>
            </form>
        </div>
    </div>
  )
}

export default AddColor