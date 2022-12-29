import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './store';
import { extendedUserApiSlice } from './features/users/usersSlice';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { extendedApiSlice } from './features/posts/postsSlice';
// import { fetchPosts } from './features/posts/postsSlice';

// store.dispatch(fetchPosts());
store.dispatch(extendedApiSlice.endpoints.getPosts.initiate());
store.dispatch(extendedUserApiSlice.endpoints.getUsers.initiate());
// store.dispatch(fetchUsers());

const app = (
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path='/*' element={<App />} />
      </Routes>
    </Router>
  </Provider>
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(app);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
