import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './pages/Login';
import Resetpassword from './pages/Resetpassword';
import Forgotpassword from './pages/Forgotpassword';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Enquiries from './pages/Enquiries';
import Bloglist from './pages/Bloglist';
import Blogcatlist from './pages/Blogcatlist';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Colorlist from './pages/Colorlist';
import Categorylist from './pages/CategoryList';
import Brandlist from './pages/Brandlist';
import Productlist from './pages/Productlist';
import AddBlog from './pages/AddBlog';
import AddBlogcat from './pages/AddBlogcat';
import AddColor from './pages/AddColor';
import Addcat from './pages/Addcat';
import AddBrand from './pages/AddBrand';
import AddProduct from './pages/AddProduct';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/reset-password' element={<Resetpassword/>} />
        <Route path='/forgot-password' element={<Forgotpassword/>} />
        <Route path='/admin' element={<MainLayout/>} >
          <Route index element={<Dashboard />} />
          <Route path='enquiries' element={<Enquiries />} />
          <Route path='list-blogs' element={<Bloglist />} />
          <Route path='blog' element={<AddBlog />} />
          <Route path='blogs-category-list' element={<Blogcatlist />} />
          <Route path='blogs-category' element={<AddBlogcat />} />
          <Route path='orders' element={<Orders />} />
          <Route path='customers' element={<Customers />} />
          <Route path='list-color' element={<Colorlist />} />
          <Route path='color' element={<AddColor />} />
          <Route path='list-category' element={<Categorylist />} />
          <Route path='category' element={<Addcat />} />
          <Route path='list-brand' element={<Brandlist />} />
          <Route path='list-product' element={<Productlist />} />
          <Route path='product' element={<AddProduct />} />
          <Route path='brand' element={<AddBrand />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
