import { Button, Text, TextInput } from '@pedro-ignite-ds/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormAnotation } from './styles'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'

const claimusernameSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' })
    .regex(/^([a-z\\\\-]+)$/i, {
      message: 'O usuário pode ter apenas letras e hifens.',
    })
    .transform((username) => username.toLowerCase()),
})

type ClaimUsernameFormData = z.infer<typeof claimusernameSchema>

export function ClaimUsenameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimusernameSchema),
  })

  const router = useRouter()

  async function handleClaimUsernameForm(data: ClaimUsernameFormData) {
    const { username } = data

    await router.push(`/register?username=${username}`)
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsernameForm)}>
        <TextInput
          prefix="igniteagenda.com/"
          placeholder="seu-usuário"
          {...register('username')}
        />
        <Button type="submit" disabled={isSubmitting}>
          Reservar
          <ArrowRight />
        </Button>
      </Form>

      <FormAnotation>
        <Text size="sm">
          {errors.username
            ? errors.username?.message
            : 'Digite o nome de usuário'}
        </Text>
      </FormAnotation>
    </>
  )
}
