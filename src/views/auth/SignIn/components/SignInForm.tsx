import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import classNames from '@/utils/classNames'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { ReactNode } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup';
import { signInWithEmailAsync } from '@/contexts/auth-context/auth-context.action'
import { useAuthContext } from '@/contexts'
import { useNavigate } from 'react-router-dom'

interface SignInFormProps extends CommonProps {
    disableSubmit?: boolean
    passwordHint?: string | ReactNode
    setMessage?: (message: string) => void
}

type SignInFormSchema = {
    email: string
    password: string
}

const SignInForm = (props: SignInFormProps) => {
    const { signInWithEmailSuccess } = useAuthContext()
    const navigate = useNavigate()
    const { disableSubmit = false, className, setMessage, passwordHint } = props


    const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting } = useFormik<SignInFormSchema>({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        }),
        onSubmit: (values) => {
            setSubmitting(true)
            signInWithEmailAsync(values, navigate).then((res => {
                signInWithEmailSuccess(res)
                navigate("/app/dashboard/ecommerce")
                window.location.reload(); // Add this line
            })).catch((error) => {
                console.error('Sign in failed:', error)
                setMessage?.(error.message || 'Sign in failed')
            }).finally(() => setSubmitting(false))
        },
    });




    return (
        <div className={className}>
            <Form onSubmit={handleSubmit}>
                <FormItem
                    label="Email"
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email}
                >
                    <Input
                        id='email'
                        type="email"
                        placeholder="example@email.com"
                        autoComplete="off"
                        value={values.email}
                        onChange={handleChange}
                    />
                </FormItem>
                <FormItem
                    label="Password"
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password}
                    className={classNames(
                        passwordHint ? 'mb-0' : '',
                        errors.password ? 'mb-8' : '',
                    )}
                >
                    <PasswordInput
                        id='password'
                        type="text"
                        placeholder="********"
                        autoComplete="off"
                        value={values.password}
                        onChange={handleChange}
                    />
                </FormItem>
                {passwordHint}
                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
            </Form>
        </div>
    )
}

export default SignInForm
