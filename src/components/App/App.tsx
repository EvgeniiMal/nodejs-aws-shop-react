import { Routes, Route } from "react-router-dom";
import MainLayout from "~/components/MainLayout/MainLayout";
import PageProductForm from "~/components/pages/PageProductForm/PageProductForm";
import PageOrders from "~/components/pages/PageOrders/PageOrders";
import PageOrder from "~/components/pages/PageOrder/PageOrder";
import PageProductImport from "~/components/pages/admin/PageProductImport/PageProductImport";
import PageCart from "~/components/pages/PageCart/PageCart";
import PageProducts from "~/components/pages/PageProducts/PageProducts";
import PageLogin from "~/components/pages/PageLogin/PageLogin";
import ProtectedRoute from "~/components/ProtectedRoute/ProtectedRoute";
import { Typography } from "@mui/material";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/login" element={<PageLogin />} />
        <Route path="/" element={<PageProducts />} />
        <Route path="cart" element={<PageCart />} />
        <Route path="admin/orders">
          <Route
            index
            element={
              <ProtectedRoute>
                <PageOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path=":id"
            element={
              <ProtectedRoute>
                <PageOrder />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="admin/products"
          element={
            <ProtectedRoute>
              <PageProductImport />
            </ProtectedRoute>
          }
        />
        <Route path="admin/product-form">
          <Route
            index
            element={
              <ProtectedRoute>
                <PageProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path=":id"
            element={
              <ProtectedRoute>
                <PageProductForm />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="*"
          element={<Typography variant="h1">Not found</Typography>}
        />
      </Routes>
    </MainLayout>
  );
}

export default App;
