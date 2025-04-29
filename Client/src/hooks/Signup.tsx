import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { AuthResponse } from "@supabase/supabase-js";
import useUserStore from "@/store/UserStore";
import { SignupSchema } from "@/lib/schemas";
import { z } from "zod";

const SignupDataSchema = SignupSchema._def.schema.pick({
  username: true,
  email: true,
  password: true,
});
type SignupData = z.infer<typeof SignupDataSchema>;

export const useRegisterUser = () => {
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  const registerUser = async (data: SignupData) => {
    const response = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
        },
      },
    });
    return response;
  };

  const { mutate: registerUserMutation, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (response: AuthResponse) => {
      if (response.data?.user && response.data?.session) {
        toast.success("Signed up successfully!");
        setUser(response.data.user);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
      if (response.error) {
        toast.error("Sign-up failed, please try again");
      }
    },
    onError: (error: any) => {
      toast.error("Sign-up failed, please try again");
      console.error("Signup Error:", error);
    },
  });

  return { registerUserMutation, isPending };
};
