import {createBrowserRouter , RouterProvider} from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PageLayOut } from './layout/PageLayout';
import { Home } from './pages/Home';
import { WorkFlow } from './pages/WorkFlow';
import { Project } from './pages/Project';

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <PageLayOut/>,
      children: [
        {
          path: '/home',
          element: <Home/>
        },
        {
          path: '/',
          element: <Home/>
        },
        {
          path: '/home/workflow',
          element: <WorkFlow/>
        },
        {
          path: '/workflow',
          element: <WorkFlow/>
        },
        {
          path: '/home/project/:id',
          element: <Project/>
        },
        {
          path: '/project/:id',
          element: <Project/>
        }
      ]
    },
    {
      path: '/login',
      element: <Login/>,
    },
    {
      path: '/register',
      element: <Register/>,
    }
  ])
  return  (
    <>
    <RouterProvider router={router}/>
    </>
    
  )
};

export default App;
