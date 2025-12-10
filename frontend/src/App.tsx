import { BrowserRouter, Routes, Route } from "react-router";
import { ThemeProvider } from "@/providers/themeProvider";
import Layout from "./layout";
import BlogPage from "@/pages/blog";
import ErrorPage from "@/pages/error";
import AllBlogsPage from "./pages/allBlogs";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<AllBlogsPage />} />
            <Route path="blogs/:blogId" element={<BlogPage />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
