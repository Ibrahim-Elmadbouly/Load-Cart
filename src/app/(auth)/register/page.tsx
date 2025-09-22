"use client";
import React, { useState } from 'react';
import { Label, TextInput, Checkbox, Button, Spinner } from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }
    if (!formData.phone || formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://ecommerce.routemisr.com/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          rePassword: formData.password,
          phone: formData.phone,
        })
      });
      const data = await response.json();

      if (!response.ok || !data.token) {
        setError(data.message || 'Registration failed. Please try again.');
        setIsLoading(false);
        return;
      }

      try {
        localStorage.setItem('loadcart_token', data.token);
        if (data.user) localStorage.setItem('loadcart_user', JSON.stringify(data.user));
      } catch {}

      router.push('/');
    } catch {
      setError('Network error. Please try again.');
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
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg sm:rounded-xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name" className="text-gray-700">Full name</Label>
              <div className="mt-1">
                <TextInput id="name" name="name" type="text" autoComplete="name" required value={formData.name} onChange={handleChange} placeholder="Enter your full name" sizing="md" />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700">Email address</Label>
              <div className="mt-1">
                <TextInput id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} placeholder="Enter your email" sizing="md" />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-gray-700">Phone number</Label>
              <div className="mt-1">
                <TextInput id="phone" name="phone" type="tel" autoComplete="tel" required value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" sizing="md" />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="mt-1">
                <TextInput id="password" name="password" type="password" autoComplete="new-password" required value={formData.password} onChange={handleChange} placeholder="Create a password" sizing="md" />
              </div>
              <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters long</p>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-700">Confirm password</Label>
              <div className="mt-1">
                <TextInput id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" sizing="md" />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex items-center gap-2">
              <Checkbox id="agree-terms" required />
              <Label htmlFor="agree-terms" className="text-gray-900">
                I agree to the <a href="#" className="text-purple-600 hover:text-purple-500">Terms of Service</a> and <a href="#" className="text-purple-600 hover:text-purple-500">Privacy Policy</a>
              </Label>
            </div>

            <div>
              <Button type="submit" disabled={isLoading} className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2"><Spinner size="sm" /> Creating account...</div>
                ) : (
                  'Create account'
                )}
              </Button>
            </div>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account? <Link href="/login" className="text-purple-600 hover:text-purple-500 font-medium">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
