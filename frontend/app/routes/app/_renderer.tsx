import { reactRenderer } from "@hono/react-renderer";
import AppLayout from "@/islands/layout/appLayout.tsx";

export default reactRenderer(({ children, Layout }) => {
  return (
    <Layout>
      <AppLayout>
        <main className="p-4">{children}</main>
      </AppLayout>
    </Layout>
  );
});
