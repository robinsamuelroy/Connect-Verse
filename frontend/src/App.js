import logo from './logo.svg';
import './App.css';
import UserWrapper from './Components/user/UserWrapper/UserWrapper'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import userStore from './Components/redux/userStore';




function App() {

  return (
   <BrowserRouter>

<Provider store={userStore}>
  <Routes>
    <Route path="/*" element={<UserWrapper/>}>

    </Route>
  </Routes>
</Provider>
</BrowserRouter>
  );
}


export default App;
