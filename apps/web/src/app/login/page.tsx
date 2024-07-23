import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Login } from "@/components/ux/Login";
import { Signup } from "@/components/ux/Signup";
import { loginAction, signupAction } from "./actions";

export default async function LoginPage() {
  return (
    <div className="w-full h-full grid md:items-center justify-items-center">
      <Tabs defaultValue="login" className="w-full md:w-[48rem] ">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login loginAction={loginAction} />
        </TabsContent>
        <TabsContent value="signup">
          <Signup signupAction={signupAction} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
