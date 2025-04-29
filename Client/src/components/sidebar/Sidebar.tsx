import { Home, Logout, Logo } from "@/assets";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export const Sidebar = ({ isMobile }: { isMobile?: boolean }) => {
  const nav = useNavigate();

  const handleLogout = async () => {
    try {
      toast.loading("Logging Out...");
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      toast.dismiss();
      toast.success("Logged Out");
      nav("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.dismiss();
      toast.error("Logout failed");
    }
  };

  return (
    <aside
      className={`relative flex flex-col ${
        isMobile ? "min-h-[100dvh] w-[100px]" : "min-h-screen  w-[121px] "
      } flex-shrink-0 border-r border-baseborder bg-baseform/30`}
    >
      <section className="flex flex-col gap-8 max-h-max overflow-scroll w-full border-b px-[32px] py-4 border-baseborder">
        <img src={Logo} />
      </section>
      <section className="flex flex-col gap-8 max-h-max overflow-scroll w-full px-[30px] py-[30px]">
        <div
          className={`flex rounded-lg bg-btn justify-center items-center h-[40px]`}
        >
          <img src={Home} className="w-[50%]" />
        </div>
      </section>
      <div className="mt-auto">
        <img
          src={Logout}
          className={`cursor-pointer ${
            isMobile ? "p-6 w-[75%] mx-auto" : "p-12"
          }`}
          onClick={handleLogout}
        />
      </div>
    </aside>
  );
};
