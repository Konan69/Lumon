import { useMutation } from "@tanstack/react-query";
import { SignupSchema } from "@/lib/schemas";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/store/UserStore";
import { AuthTokenResponsePassword } from "@supabase/supabase-js";
import { z } from "zod";

const LoginSchema = SignupSchema._def.schema.pick({
  email: true,
  password: true,
});
type LoginData = z.infer<typeof LoginSchema>;

export const useLoginUser = () => {
  const { setUser } = useUserStore();
  const navigate = useNavigate();
  const loginUser = async (data: LoginData) => {
    const response = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    return response;
  };

  const { mutate: loginUserMutation, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (response: AuthTokenResponsePassword) => {
      if (response.data?.user && response.data?.session) {
        toast.success("Login Successful");
        //@ts-ignore
        setUser(response.data.user);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
      if (response.error) {
        toast.error(response.error.message);
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response.data.message || "Login failed, please try again"
      );
    },
  });

  return { loginUserMutation, isPending };
};
