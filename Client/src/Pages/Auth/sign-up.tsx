import { SignupSchema } from "@/lib/schemas";
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
import { useRegisterUser } from "../../hooks/Signup";
import { Input } from "@/components/ui/input";
import CardWrapper from "../../components/ui/card-wrapper";

export const Signup = () => {
  const { registerUserMutation, isPending } = useRegisterUser();

  const onSubmit = (values: z.infer<typeof SignupSchema>) => {
    const { confirmPassword, ...registrationData } = values;
    registerUserMutation(registrationData);
  };

  const signupForm = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <div className="w-full max-w-[90%] sm:max-w-[400px] mx-auto">
      <CardWrapper
        title="Create account"
        backLabel="Already have an account? Login"
        backHref="/login"
      >
        <Form {...signupForm}>
          <form
            onSubmit={signupForm.handleSubmit(onSubmit)}
            className="space-y-4 w-full px-4 sm:px-0"
          >
            <FormField
              control={signupForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="border-authborder bg-bgcolor/30 text-white "
                      placeholder="Username"
                      {...field}
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signupForm.control}
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
              control={signupForm.control}
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
            <FormField
              control={signupForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="border-authborder bg-black text-white"
                      placeholder="Confirm Password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full bg-btn text-black hover:bg-[#52ab37]"
              disabled={isPending}
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};
