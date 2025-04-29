import { Sidebar } from "@/components/sidebar";
import { Todo } from "../todo";
import { Header } from "@/components/header";
import { useGetCategories } from "@/hooks/useCategory";

export const Dashboard = () => {
  useGetCategories();

  return (
    <div className="flex h-screen">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1">
          <Todo />
        </main>
      </div>
    </div>
  );
};
