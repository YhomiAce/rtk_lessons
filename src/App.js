import PostsList from "./components/PostsList";
import AddPostForm from './components/AddPostForm';
import SinglePostPage from "./components/SinglePostPage";
import Layout from "./components/layouts/Layout";
import { Navigate, Route, Routes } from "react-router-dom";
import EditPostForm from "./components/EditPostForm";
import UsersList from "./components/UsersList";
import UserPage from "./components/UserPage";

function App() {
  return (
    <Routes >
      <Route path="/" element={<Layout />}>
        <Route index element={<PostsList />} />
        <Route path="post">
          <Route path="" element={<AddPostForm />} />
          <Route path=":postId" element={<SinglePostPage />} />
          <Route path="edit/:postId" element={<EditPostForm />} />
        </Route>
        <Route path="user">
          <Route index element={<UsersList />} />
          <Route path=":userId" element={<UserPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

    </Routes>
  );
}

export default App;
