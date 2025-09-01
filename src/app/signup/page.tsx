import AuthForm from '@/components/auth-form';
import AuthLayout from '../(auth)/layout';

export default function SignupPage() {
  return (
    <AuthLayout>
      <AuthForm mode="signup" />
    </AuthLayout>
  );
}
