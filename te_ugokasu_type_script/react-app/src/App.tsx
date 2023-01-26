import { AlertButton, Button } from "./libs/Button"
import { Heading } from "./libs/Heading"
import { Input } from "./libs/Input"
import { Text } from "./libs/Text"
import { TextArea } from "./libs/TextArea"

export const App = () => {
  return (
    <>
      <Heading tag="h1"><Text text='見出し'></Text></Heading>
      <Button onClick={() => console.log('clicked!')} title='Button' type='primary' width={96} />
      <Button onClick={() => console.warn('clicked!')} title='Button' type='secondary' />
      <AlertButton onClick={() => console.error('clicked!')} title='Button' />
      <TextArea width={500} maxLength={30} />
      <Input type='text' />
    </>
  )
}