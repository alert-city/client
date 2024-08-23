import Link from "next/link";
import React from "react";

type RouteLinkProps = {
  children: React.ReactNode;
  className?: string;
};

const Root = {
  Metadata: {
    title: " Submission | Alert City",
  },
  Path: "/" as const,
  Link: ({ children, className }: RouteLinkProps) => (
    <Link href={Root.Path} className={className}>
      {children}
    </Link>
  ),
};


const Login = {
  Metadata: {
    title: "Sign In | Alert City",
  },
  Path: "/login" as const,
  Link: ({ children, className }: RouteLinkProps) => (
    <Link href={Login.Path} className={className}>
      {children}
    </Link>
  ),
};

const Register = {
  Metadata: {
    title: "Sign Up | Alert City",
  },
  Path: "/register" as const,
  Link: ({ children, className }: RouteLinkProps) => (
    <Link href={Register.Path} className={className}>
      {children}
    </Link>
  ),
};

const ResetPassword = {
  Metadata: {
    title: "Reset Password | Alert City",
  },
  Path: "/reset-password" as const,
  Link: ({ children, className }: RouteLinkProps) => (
    <Link href={ResetPassword.Path} className={className}>
      {children}
    </Link>
  ),
};

const Submission = {
  Metadata: {
    title: "Submission | Alert City",
  },
  Path: "/submission" as const,
  Link: ({ children, className }: RouteLinkProps) => (
    <Link href={Submission.Path} className={className}>
      {children}
    </Link>
  ),
}

const Admin = {
  Metadata: {
    title: "Admin | Alert City",
  },
  Path: "/admin" as const,
  Link: ({ children, className }: RouteLinkProps) => (
    <Link href={Admin.Path} className={className}>
      {children}
    </Link>
  ),
}

const Staff ={
  Metadata: {
    title: "Staff | Alert City",
  },
  Path: "/staff" as const,
  Link: ({ children, className }: RouteLinkProps) => (
    <Link href={Staff.Path} className={className}>
      {children}
    </Link>
  ),
}

const Enable2FA = {
  Metadata: {
    title: "Enable 2FA | Alert City",
  },
  Path: "/enable-2FA" as const,
  Link: ({ children, className }: RouteLinkProps) => (
    <Link href={Enable2FA.Path} className={className}>
      {children}
    </Link>
  ),
}

const Review = {
  Metadata: {
    title: "Review | Alert City",
  },
  Path: "/review" as const,
  Link: ({ children, className }: RouteLinkProps) => (
    <Link href={Review.Path} className={className}>
      {children}
    </Link>
  ),
}

const Profile = {
  Metadata: {
    title: "Profile | Alert City",
  },
  Path: "/profile" as const,
  Link: ({ children, className }: RouteLinkProps) => (
    <Link href={Profile.Path} className={className}>
      {children}
    </Link>
  ),
}

const Activate = {
  Metadata: {
    title: "Activate Account | Alert City",
  },
  Path: "/activate" as const,
  Link: ({ children, className }: RouteLinkProps) => (
    <Link href={Activate.Path} className={className}>
      {children}
    </Link>
  ),
}

const UserManagement = {
  Metadata: {
    title: "User Management | Alert City",
  },
  Path: "/user-management" as const,
  Link: ({ children, className }: RouteLinkProps) => (
    <Link href={UserManagement.Path} className={className}>
      {children}
    </Link>
  ),
}

export const RouteConfig = {
  Root,
  Login,
  Register,
  ResetPassword,
  Submission,
  Admin,
  Staff,
  Enable2FA,
  Review,
  Profile,
  Activate,
  UserManagement,
};
