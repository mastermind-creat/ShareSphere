import AuthForm from '@/components/auth-form';
import AuthLayout from '../(auth)/layout';

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthForm mode="login" />
    </AuthLayout>
  );
}
