import { Button, Heading, MultiStep, Text } from '@pedro-ignite-ds/react'
import { Container, Header, ConnectBox, ConnectItem } from './styles'
import { ArrowRight } from 'phosphor-react'
import { signIn } from 'next-auth/react'

export default function ConnectCalendar() {
  // async function handleRegisterForm(data: RegisterFormData) {}

  return (
    <Container>
      <Header>
        <Heading as="strong">Conecte sua agenda!</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>

        <MultiStep size={4} currentStep={2} />
      </Header>

      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>
          <Button variant="secondary" onClick={() => signIn('google')}>
            Conectar
            <ArrowRight />
          </Button>
        </ConnectItem>

        <Button type="submit">
          Próximo passo
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  )
}
