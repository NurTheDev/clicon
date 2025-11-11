import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import instance from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { Bounce, toast } from "react-toastify";
import * as z from "zod";

const emailRegisterSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").trim(),
    email: z.string().email("Invalid email address").trim(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const phoneRegisterSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").trim(),
    phone: z
      .string()
      .regex(/^\+?[0-9]{10,15}$/, "Please enter a valid phone number")
      .trim(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type EmailRegisterValues = z.infer<typeof emailRegisterSchema>;
type PhoneRegisterValues = z.infer<typeof phoneRegisterSchema>;

const Register = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [userIdentifier, setUserIdentifier] = useState(""); // email or phone

  const emailForm = useForm<EmailRegisterValues>({
    resolver: zodResolver(emailRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const phoneForm = useForm<PhoneRegisterValues>({
    resolver: zodResolver(phoneRegisterSchema),
    defaultValues: {
      name: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (
      data: EmailRegisterValues | PhoneRegisterValues
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> => {
      const response = await instance.post("/auth/register", data);
      const result = response.data;
      if (result.status !== "success") {
        throw new Error(result.message || "Registration failed");
      }
      return result.data;
    },
    onSuccess: (data, variables) => {
      toast.success(`Registration successful! OTP sent to your ${activeTab}.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });

      // Store email or phone for OTP verification
      if ("email" in variables) {
        setUserIdentifier(variables.email);
      } else {
        setUserIdentifier(variables.phone);
      }

      setShowOTP(true);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Registration failed", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    },
  });

  // Verify OTP mutation
  const verifyOTPMutation = useMutation({
    mutationFn: async () => {
      //   const endpoint = activeTab === "email" ? "verify-email" : "verify-phone";
      const body =
        activeTab === "email"
          ? { email: userIdentifier, otp }
          : { phone: userIdentifier, otp };

      const response = await instance.post("/auth/verify-account", body);
      const result = response.data;
      if (result.status !== "success") {
        throw new Error(result.message || "OTP verification failed");
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("Account verified successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    },
    onError: (error: Error) => {
      toast.error(error.message || "OTP verification failed", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    },
  });

  // Resend OTP mutation
  const resendOTPMutation = useMutation({
    mutationFn: async () => {
      const body =
        activeTab === "email"
          ? { email: userIdentifier }
          : { phone: userIdentifier };
      const response = await instance.post("/auth/resend-otp", body);
      const result = response.data;
      if (result.status !== "success") {
        throw new Error(result.message || "Failed to resend OTP");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("OTP resent successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to resend OTP", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    },
  });

  const onEmailSubmit = async (data: EmailRegisterValues) => {
    registerMutation.mutate(data);
  };

  const onPhoneSubmit = async (data: PhoneRegisterValues) => {
    registerMutation.mutate(data);
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    verifyOTPMutation.mutate();
  };

  if (showOTP) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Verify Your Account
            </CardTitle>
            <CardDescription className="text-center">
              Enter the 6-digit OTP sent to your {activeTab}
              <br />
              <span className="font-semibold">{userIdentifier}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              onClick={handleVerifyOTP}
              disabled={verifyOTPMutation.isPending || otp.length !== 6}
              className="w-full">
              {verifyOTPMutation.isPending ? "Verifying..." : "Verify OTP"}
            </Button>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => resendOTPMutation.mutate()}
                disabled={resendOTPMutation.isPending}
                className="text-sm">
                {resendOTPMutation.isPending ? "Sending..." : "Resend OTP"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Sign up with email or phone number
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "email" | "phone")}
            className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </TabsTrigger>
            </TabsList>

            {/* Email Registration */}
            <TabsContent value="email">
              <Form {...emailForm}>
                <form
                  onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                  className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            {...field}
                            disabled={registerMutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                            disabled={registerMutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={emailForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter password"
                              {...field}
                              disabled={registerMutation.isPending}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full"
                              onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">
                          Min 8 chars, 1 uppercase, 1 lowercase, 1 number
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={emailForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm password"
                              {...field}
                              disabled={registerMutation.isPending}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }>
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={registerMutation.isPending}>
                    {registerMutation.isPending
                      ? "Creating Account..."
                      : "Create Account"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            {/* Phone Registration */}
            <TabsContent value="phone">
              <Form {...phoneForm}>
                <form
                  onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}
                  className="space-y-4">
                  <FormField
                    control={phoneForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            {...field}
                            disabled={registerMutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={phoneForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+1234567890"
                            {...field}
                            disabled={registerMutation.isPending}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Include country code (e.g., +1, +880)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={phoneForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter password"
                              {...field}
                              disabled={registerMutation.isPending}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full"
                              onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">
                          Min 8 chars, 1 uppercase, 1 lowercase, 1 number
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={phoneForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm password"
                              {...field}
                              disabled={registerMutation.isPending}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }>
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={registerMutation.isPending}>
                    {registerMutation.isPending
                      ? "Creating Account..."
                      : "Create Account"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
