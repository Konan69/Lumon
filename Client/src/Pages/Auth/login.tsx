import { LoginSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CardWrapper from "../../components/ui/card-wrapper";
import { HeaderWrapper } from "@/components/header-wrapper";
import { useLoginUser } from "../../hooks/Login";

export const Login = () => {
  const { loginUserMutation, isPending } = useLoginUser();
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    loginUserMutation(values);
  };

  const loginForm = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <HeaderWrapper
      title={`Stay on top of your schedule with Lumon`}
      className="pt-8 sm:pt-16"
    >
      <div className="w-full max-w-[90%] sm:max-w-[400px] mx-auto">
        <CardWrapper
          title="Login"
          backLabel="Don't have an account? Sign up"
          backHref="/"
        >
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onSubmit)}
              className="space-y-4 w-full px-4 sm:px-0"
            >
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="border-authborder bg-black text-white"
                        placeholder="Email Address"
                        {...field}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="border-authborder bg-black text-white"
                        placeholder="Password"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={isPending}
                className="w-full bg-btn text-black hover:bg-[#52ab37]"
                type="submit"
              >
                Login
              </Button>
            </form>
          </Form>
        </CardWrapper>
      </div>
    </HeaderWrapper>
  );
};
