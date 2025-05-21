import { AppSidebar } from "@/islands/sidber/appSidebar.tsx";
import { reactRenderer } from "@hono/react-renderer";

export default reactRenderer(({ children, Layout }) => {
  return (
    <Layout>
      <main className="flex flex-row gap-4">
        <AppSidebar />
        <div id="app-container" className="py-4 pr-4 w-full">
          {children}
        </div>
      </main>
    </Layout>
  );
});
