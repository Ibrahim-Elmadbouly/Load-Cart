"use client";
import React, { useState } from 'react';
import { Label, TextInput, Button, Spinner } from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (!res) {
        setError('Network error. Please try again.');
        toast.error('Network error. Please try again.');
        return;
      }

      if (res.error) {
        const friendly = res.error === 'CredentialsSignin' ? 'Invalid email or password.' : res.error;
        setError(friendly);
        toast.error(friendly);
        return;
      }

      toast.success('Signed in successfully');
      router.push('/');
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
      toast.error(err?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="text-3xl font-bold text-purple-600">
            Load Cart
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg sm:rounded-xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="text-gray-700">Email address</Label>
              <div className="mt-1">
                <TextInput id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="Enter your email" sizing="md" />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="mt-1">
                <TextInput id="password" name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="Enter your password" sizing="md" />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button type="button" onClick={() => { setShowForgot((v) => !v); if (!forgotEmail) setForgotEmail(formData.email); }} className="font-medium text-purple-600 hover:text-purple-500">
                  Forgot your password?
                </button>
              </div>
            </div>

            <div>
              <Button type="submit" disabled={isLoading} className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2"><Spinner size="sm" /> Signing in...</div>
                ) : (
                  'Sign in'
                )}
              </Button>
            </div>
          </form>
          {showForgot && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-md font-semibold text-gray-900 mb-2">Reset your password</h3>
              <p className="text-sm text-gray-600 mb-3">Enter your account email and we'll send you a reset code.</p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!forgotEmail) {
                    toast.error('Please enter your email');
                    return;
                  }
                  try {
                    setForgotLoading(true);
                    const res = await fetch('https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: forgotEmail.trim() })
                    });
                    const data = await res.json().catch(() => ({}));
                    if (!res.ok) throw new Error(data?.message || 'Failed to send reset email');
                    toast.success('Reset code sent. Check your email inbox/spam.');
                    setShowVerify(true);
                  } catch (err: any) {
                    toast.error(err?.message || 'Failed to send reset email');
                  } finally {
                    setForgotLoading(false);
                  }
                }}
                className="space-y-3"
              >
                <div>
                  <Label htmlFor="forgot-email" className="text-gray-700">Email address</Label>
                  <div className="mt-1">
                    <TextInput
                      id="forgot-email"
                      name="forgot-email"
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter your email"
                      sizing="md"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" disabled={forgotLoading} className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white">
                    {forgotLoading ? <div className="flex items-center justify-center gap-2"><Spinner size="sm" /> Sending...</div> : 'Send reset code'}
                  </Button>
                  <Button type="button" color="light" onClick={() => setShowForgot(false)} className="h-10 w-30">
                    Cancel
                  </Button>
                </div>
              </form>
              {showVerify && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Verify reset code</h4>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!resetCode) { toast.error('Please enter the reset code'); return; }
                      try {
                        setVerifyLoading(true);
                        const res = await fetch('https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ resetCode: resetCode.trim() })
                        });
                        const data = await res.json().catch(() => ({}));
                        if (!res.ok) throw new Error(data?.message || 'Invalid or expired code');
                        toast.success('Code verified. You can now reset your password.');
                        
                      } catch (err: any) {
                        toast.error(err?.message || 'Failed to verify code');
                      } finally {
                        setVerifyLoading(false);
                      }
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <Label htmlFor="reset-code" className="text-gray-700">Reset code</Label>
                      <div className="mt-1">
                        <TextInput
                          id="reset-code"
                          name="reset-code"
                          type="text"
                          required
                          value={resetCode}
                          onChange={(e) => setResetCode(e.target.value)}
                          placeholder="Enter the code you received"
                          sizing="md"
                        />
                      </div>
                    </div>
                    <div>
                      <Button type="submit" disabled={verifyLoading} className="h-10 bg-green-600 hover:bg-green-700 text-white w-30">
                        {verifyLoading ? <div className="flex items-center justify-center gap-2"><Spinner size="sm" /> Verifying...</div> : 'Verify code'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
          <div className="mt-6 text-center text-sm text-gray-600">
            New here? <Link href="/register" className="text-purple-600 hover:text-purple-500 font-medium">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
