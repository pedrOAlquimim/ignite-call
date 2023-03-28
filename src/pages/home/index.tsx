import { Heading, Text } from '@pedro-ignite-ds/react'
import { Container, Hero, Preview } from './styles'
import Image from 'next/image'
import previewImage from '../../assets/app-preview.png'
import { ClaimUsenameForm } from './components/ClaimUsernameForm'

export default function Home() {
  return (
    <Container>
      <Hero>
        <Heading as="h1" size="4xl">
          Agendamento descomplicado
        </Heading>
        <Text size="xl">
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre.
        </Text>

        <ClaimUsenameForm />
      </Hero>

      <Preview>
        <Image
          src={previewImage}
          height={400}
          quality={100}
          priority
          alt="Calendário simbolizando a aplicação em funcionamento"
        />
      </Preview>
    </Container>
  )
}
