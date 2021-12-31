import { withPageAuthRequired } from "@auth0/nextjs-auth0";

const AdminLayout = withPageAuthRequired((children) => {
  <>{children}</>;
});

export default AdminLayout;
